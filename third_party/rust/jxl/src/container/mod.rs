






pub mod box_header;
pub mod parse;

use box_header::*;
pub use parse::ParseEvent;
use parse::*;


#[derive(Debug, Default)]
pub struct ContainerParser {
    state: DetectState,
    jxlp_index_state: JxlpIndexState,
    previous_consumed_bytes: usize,
}

#[derive(Debug, Default)]
enum DetectState {
    #[default]
    WaitingSignature,
    WaitingBoxHeader,
    WaitingJxlpIndex(ContainerBoxHeader),
    InAuxBox {
        #[allow(unused)]
        header: ContainerBoxHeader,
        bytes_left: Option<usize>,
    },
    InCodestream {
        kind: BitstreamKind,
        bytes_left: Option<usize>,
    },
}


#[derive(Debug, Copy, Clone, Eq, PartialEq)]
pub enum BitstreamKind {
    
    Unknown,
    
    BareCodestream,
    
    Container,
    
    Invalid,
}

#[derive(Debug, Copy, Clone, Eq, PartialEq, Default)]
enum JxlpIndexState {
    #[default]
    Initial,
    SingleJxlc,
    Jxlp(u32),
    JxlpFinished,
}

impl ContainerParser {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn kind(&self) -> BitstreamKind {
        match self.state {
            DetectState::WaitingSignature => BitstreamKind::Unknown,
            DetectState::WaitingBoxHeader
            | DetectState::WaitingJxlpIndex(..)
            | DetectState::InAuxBox { .. } => BitstreamKind::Container,
            DetectState::InCodestream { kind, .. } => kind,
        }
    }

    
    
    
    
    
    
    pub fn process_bytes<'inner, 'buf>(
        &'inner mut self,
        input: &'buf [u8],
    ) -> ParseEvents<'inner, 'buf> {
        ParseEvents::new(self, input)
    }

    
    
    
    
    
    pub fn previous_consumed_bytes(&self) -> usize {
        self.previous_consumed_bytes
    }
}

#[cfg(test)]
impl ContainerParser {
    pub(crate) fn collect_codestream(input: &[u8]) -> crate::error::Result<Vec<u8>> {
        let mut parser = Self::new();
        let mut codestream = Vec::new();
        for event in parser.process_bytes(input) {
            match event? {
                ParseEvent::BitstreamKind(_) => {}
                ParseEvent::Codestream(buf) => {
                    codestream.extend_from_slice(buf);
                }
            }
        }
        Ok(codestream)
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use test_log::test;

    #[rustfmt::skip]
    const HEADER: &[u8] = &[
        0x00, 0x00, 0x00, 0x0c, b'J', b'X', b'L', b' ', 0x0d, 0x0a, 0x87, 0x0a, 0x00, 0x00, 0x00, 0x14,
        b'f', b't', b'y', b'p', b'j', b'x', b'l', b' ', 0x00, 0x00, 0x00, 0x00, b'j', b'x', b'l', b' ',
    ];

    #[test]
    fn parse_partial() {
        arbtest::arbtest(|u| {
            
            let total_len = u.arbitrary_len::<u8>()?;
            let mut codestream0 = vec![0u8; total_len / 2];
            u.fill_buffer(&mut codestream0)?;
            let mut codestream1 = vec![0u8; total_len - codestream0.len()];
            u.fill_buffer(&mut codestream1)?;

            let mut container = HEADER.to_vec();
            container.extend_from_slice(&(12 + codestream0.len() as u32).to_be_bytes());
            container.extend_from_slice(b"jxlp\x00\x00\x00\x00");
            container.extend_from_slice(&codestream0);

            container.extend_from_slice(&(12 + codestream1.len() as u32).to_be_bytes());
            container.extend_from_slice(b"jxlp\x80\x00\x00\x01");
            container.extend_from_slice(&codestream1);

            let mut expected = codestream0;
            expected.extend(codestream1);

            
            let mut tests = Vec::new();
            u.arbitrary_loop(Some(1), Some(10), |u| {
                let split_at_idx = u.choose_index(container.len())?;
                tests.push(container.split_at(split_at_idx));
                Ok(std::ops::ControlFlow::Continue(()))
            })?;

            
            for (first, second) in tests {
                let mut codestream = Vec::new();
                let mut parser = ContainerParser::new();

                for event in parser.process_bytes(first) {
                    let event = event.unwrap();
                    if let ParseEvent::Codestream(data) = event {
                        codestream.extend_from_slice(data);
                    }
                }

                let consumed = parser.previous_consumed_bytes();
                let mut second_chunk = first[consumed..].to_vec();
                second_chunk.extend_from_slice(second);

                for event in parser.process_bytes(&second_chunk) {
                    let event = event.unwrap();
                    if let ParseEvent::Codestream(data) = event {
                        codestream.extend_from_slice(data);
                    }
                }

                assert_eq!(codestream, expected);
            }

            Ok(())
        });
    }
}
