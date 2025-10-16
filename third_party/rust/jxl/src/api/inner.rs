




#[cfg(test)]
use crate::api::FrameCallback;
use crate::{
    api::JxlFrameHeader,
    error::{Error, Result},
};

use super::{JxlBasicInfo, JxlCms, JxlColorProfile, JxlDecoderOptions, JxlPixelFormat};
use box_parser::BoxParser;
use codestream_parser::CodestreamParser;

mod box_parser;
mod codestream_parser;
mod process;


pub struct JxlDecoderInner {
    options: JxlDecoderOptions,
    cms: Option<Box<dyn JxlCms>>,
    box_parser: BoxParser,
    codestream_parser: CodestreamParser,
}

impl JxlDecoderInner {
    
    pub fn new(options: JxlDecoderOptions, cms: Option<Box<dyn JxlCms>>) -> Self {
        JxlDecoderInner {
            options,
            cms,
            box_parser: BoxParser::new(),
            codestream_parser: CodestreamParser::new(),
        }
    }

    #[cfg(test)]
    pub fn with_frame_callback(mut self, callback: Box<FrameCallback>) -> Self {
        self.codestream_parser.frame_callback = Some(callback);
        self
    }

    #[cfg(test)]
    pub fn decoded_frames(&self) -> usize {
        self.codestream_parser.decoded_frames
    }

    
    pub fn basic_info(&self) -> Option<&JxlBasicInfo> {
        self.codestream_parser.basic_info.as_ref()
    }

    
    pub fn embedded_color_profile(&self) -> Option<&JxlColorProfile> {
        self.codestream_parser.embedded_color_profile.as_ref()
    }

    
    pub fn output_color_profile(&self) -> Option<&JxlColorProfile> {
        self.codestream_parser.output_color_profile.as_ref()
    }

    
    
    pub fn set_output_color_profile(&mut self, profile: &JxlColorProfile) -> Result<()> {
        if let (JxlColorProfile::Icc(_), None) = (profile, &self.cms) {
            return Err(Error::ICCOutputNoCMS);
        }
        unimplemented!()
    }

    pub fn current_pixel_format(&self) -> Option<&JxlPixelFormat> {
        self.codestream_parser.pixel_format.as_ref()
    }

    pub fn set_pixel_format(&mut self, pixel_format: JxlPixelFormat) {
        drop(pixel_format);
        unimplemented!()
    }

    pub fn frame_header(&self) -> Option<JxlFrameHeader> {
        let frame_header = self.codestream_parser.frame.as_ref()?.header();
        Some(JxlFrameHeader {
            name: frame_header.name.clone(),
            duration: self
                .codestream_parser
                .animation
                .as_ref()
                .map(|anim| frame_header.duration(anim)),
        })
    }
    
    pub fn num_completed_passes(&self) -> Option<usize> {
        None 
    }

    
    pub fn rewind(&mut self) {
        
        self.box_parser = BoxParser::new();
        self.codestream_parser = CodestreamParser::new();
    }

    pub fn has_more_frames(&self) -> bool {
        self.codestream_parser.has_more_frames
    }
}
