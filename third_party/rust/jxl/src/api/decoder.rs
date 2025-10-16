




use super::{
    JxlBasicInfo, JxlBitstreamInput, JxlCms, JxlColorProfile, JxlDecoderInner, JxlDecoderOptions,
    JxlOutputBuffer, JxlPixelFormat, ProcessingResult,
};
#[cfg(test)]
use crate::frame::Frame;
use crate::{api::JxlFrameHeader, error::Result};
use states::*;
use std::marker::PhantomData;

pub mod states {
    pub trait JxlState {}
    pub struct Initialized;
    pub struct WithImageInfo;
    pub struct WithFrameInfo;
    impl JxlState for Initialized {}
    impl JxlState for WithImageInfo {}
    impl JxlState for WithFrameInfo {}
}





pub struct JxlDecoder<State: JxlState> {
    inner: JxlDecoderInner,
    _state: PhantomData<State>,
}

#[cfg(test)]
pub type FrameCallback = dyn FnMut(&Frame, usize) -> Result<()>;

impl<S: JxlState> JxlDecoder<S> {
    fn wrap_inner(inner: JxlDecoderInner) -> Self {
        Self {
            inner,
            _state: PhantomData,
        }
    }

    
    #[cfg(test)]
    pub fn with_frame_callback(mut self, callback: Box<FrameCallback>) -> Self {
        self.inner = self.inner.with_frame_callback(callback);
        self
    }

    #[cfg(test)]
    pub fn decoded_frames(&self) -> usize {
        self.inner.decoded_frames()
    }

    
    pub fn rewind(mut self) -> JxlDecoder<Initialized> {
        self.inner.rewind();
        JxlDecoder::wrap_inner(self.inner)
    }

    fn map_inner_processing_result<SuccessState: JxlState>(
        self,
        inner_result: ProcessingResult<(), ()>,
    ) -> ProcessingResult<JxlDecoder<SuccessState>, Self> {
        match inner_result {
            ProcessingResult::Complete { .. } => ProcessingResult::Complete {
                result: JxlDecoder::wrap_inner(self.inner),
            },
            ProcessingResult::NeedsMoreInput { size_hint, .. } => {
                ProcessingResult::NeedsMoreInput {
                    size_hint,
                    fallback: self,
                }
            }
        }
    }
}

impl JxlDecoder<Initialized> {
    pub fn new(options: JxlDecoderOptions) -> Self {
        Self::wrap_inner(JxlDecoderInner::new(options, None))
    }

    pub fn new_with_cms(options: JxlDecoderOptions, cms: impl JxlCms + 'static) -> Self {
        Self::wrap_inner(JxlDecoderInner::new(options, Some(Box::new(cms))))
    }

    pub fn process(
        mut self,
        input: &mut impl JxlBitstreamInput,
    ) -> Result<ProcessingResult<JxlDecoder<WithImageInfo>, Self>> {
        let inner_result = self.inner.process(input, None)?;
        Ok(self.map_inner_processing_result(inner_result))
    }
}

impl JxlDecoder<WithImageInfo> {
    

    
    pub fn basic_info(&self) -> &JxlBasicInfo {
        self.inner.basic_info().unwrap()
    }

    
    pub fn embedded_color_profile(&self) -> &JxlColorProfile {
        self.inner.embedded_color_profile().unwrap()
    }

    
    pub fn output_color_profile(&self) -> &JxlColorProfile {
        self.inner.output_color_profile().unwrap()
    }

    
    
    pub fn set_output_color_profile(&mut self, profile: &JxlColorProfile) -> Result<()> {
        self.inner.set_output_color_profile(profile)
    }

    pub fn current_pixel_format(&self) -> &JxlPixelFormat {
        self.inner.current_pixel_format().unwrap()
    }

    pub fn set_pixel_format(&mut self, pixel_format: JxlPixelFormat) {
        self.inner.set_pixel_format(pixel_format);
    }

    pub fn process(
        mut self,
        input: &mut impl JxlBitstreamInput,
    ) -> Result<ProcessingResult<JxlDecoder<WithFrameInfo>, Self>> {
        let inner_result = self.inner.process(input, None)?;
        Ok(self.map_inner_processing_result(inner_result))
    }

    pub fn has_more_frames(&self) -> bool {
        self.inner.has_more_frames()
    }
}

impl JxlDecoder<WithFrameInfo> {
    
    pub fn skip_frame(
        mut self,
        input: &mut impl JxlBitstreamInput,
    ) -> Result<ProcessingResult<JxlDecoder<WithImageInfo>, Self>> {
        let inner_result = self.inner.process(input, None)?;
        Ok(self.map_inner_processing_result(inner_result))
    }

    
    pub fn frame_header(&self) -> JxlFrameHeader {
        self.inner.frame_header().unwrap()
    }

    
    pub fn num_completed_passes(&self) -> usize {
        self.inner.num_completed_passes().unwrap()
    }

    
    pub fn flush_pixels(&mut self, buffers: &mut [JxlOutputBuffer<'_>]) -> Result<()> {
        self.inner.flush_pixels(buffers)
    }

    
    
    pub fn process<In: JxlBitstreamInput>(
        mut self,
        input: &mut In,
        buffers: &mut [JxlOutputBuffer<'_>],
    ) -> Result<ProcessingResult<JxlDecoder<WithImageInfo>, Self>> {
        let inner_result = self.inner.process(input, Some(buffers))?;
        Ok(self.map_inner_processing_result(inner_result))
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::api::JxlDecoderOptions;
    use crate::api::test::create_output_buffers;
    use jxl_macros::for_each_test_file;
    use std::path::Path;

    #[test]
    fn decode_small_chunks() {
        arbtest::arbtest(|u| {
            decode_test_data(
                std::fs::read("resources/test/green_queen_vardct_e3.jxl")
                    .expect("Failed to read test file"),
                u.arbitrary::<u8>().unwrap() as usize + 1,
            )
            .unwrap();
            Ok(())
        });
    }

    fn decode_test_data(data: Vec<u8>, chunk_size: usize) -> Result<(), crate::error::Error> {
        
        let options = JxlDecoderOptions::default();
        let mut initialized_decoder = JxlDecoder::<states::Initialized>::new(options);

        let mut input = data.as_slice();
        let mut chunk_input = &input[0..0];

        
        let mut decoder_with_image_info = loop {
            chunk_input = &input[..(chunk_input.len().saturating_add(chunk_size)).min(input.len())];
            let available_before = chunk_input.len();
            let process_result = initialized_decoder.process(&mut chunk_input);
            input = &input[(available_before - chunk_input.len())..];
            match process_result.unwrap() {
                ProcessingResult::Complete { result } => break result,
                ProcessingResult::NeedsMoreInput { fallback, .. } => {
                    if input.is_empty() {
                        panic!("Unexpected end of input while reading image info");
                    }
                    initialized_decoder = fallback;
                }
            }
        };

        
        let basic_info = decoder_with_image_info.basic_info().clone();
        assert!(basic_info.bit_depth.bits_per_sample() > 0);

        
        let (width, height) = basic_info.size;
        assert!(width > 0);
        assert!(height > 0);

        
        let pixel_format = decoder_with_image_info.current_pixel_format().clone();
        let num_channels = pixel_format.color_type.samples_per_pixel();
        assert!(num_channels > 0);

        let mut frame_count = 0;

        loop {
            
            let mut decoder_with_frame_info = loop {
                chunk_input =
                    &input[..(chunk_input.len().saturating_add(chunk_size)).min(input.len())];
                let available_before = chunk_input.len();
                let process_result = decoder_with_image_info.process(&mut chunk_input);
                input = &input[(available_before - chunk_input.len())..];
                match process_result.unwrap() {
                    ProcessingResult::Complete { result } => break result,
                    ProcessingResult::NeedsMoreInput { fallback, .. } => {
                        if input.is_empty() {
                            panic!("Unexpected end of input while reading frame info");
                        }
                        decoder_with_image_info = fallback;
                    }
                }
            };
            decoder_with_frame_info.frame_header();

            create_output_buffers!(basic_info, pixel_format, output_buffers, output_slices);

            decoder_with_image_info = loop {
                chunk_input =
                    &input[..(chunk_input.len().saturating_add(chunk_size)).min(input.len())];
                let available_before = chunk_input.len();
                let process_result =
                    decoder_with_frame_info.process(&mut chunk_input, &mut output_slices);
                input = &input[(available_before - chunk_input.len())..];
                match process_result.unwrap() {
                    ProcessingResult::Complete { result } => break result,
                    ProcessingResult::NeedsMoreInput { fallback, .. } => {
                        if input.is_empty() {
                            panic!("Unexpected end of input while decoding frame");
                        }
                        decoder_with_frame_info = fallback;
                    }
                }
            };

            
            if pixel_format.color_type == Rgb {
                
                assert!(!output_buffers.is_empty());
                assert_eq!(output_buffers[0].len(), width * height * 12); 
                
                for buffer in &output_buffers[1..] {
                    assert_eq!(buffer.len(), width * height * 4);
                }
            } else {
                
                assert_eq!(output_buffers.len(), num_channels);
                for buffer in &output_buffers {
                    assert_eq!(buffer.len(), width * height * 4);
                }
            }

            frame_count += 1;

            
            if !decoder_with_image_info.has_more_frames() {
                break;
            }
        }

        
        assert!(frame_count > 0, "No frames were decoded");

        Ok(())
    }

    fn decode_test_file(path: &Path) -> Result<(), crate::error::Error> {
        decode_test_data(
            std::fs::read(path).expect("Failed to read test file"),
            usize::MAX,
        )
    }

    for_each_test_file!(decode_test_file);
}
