






mod color;
mod data_types;
mod decoder;
mod inner;
mod input;
mod options;
mod output;
mod signature;
#[cfg(test)]
pub(crate) mod test;

pub use color::*;
pub use data_types::*;
pub use decoder::*;
pub use inner::*;
pub use input::*;
pub use options::*;
pub use output::*;
pub use signature::*;

use crate::headers::image_metadata::Orientation;








#[derive(Debug, PartialEq)]
pub enum ProcessingResult<T, U> {
    Complete { result: T },
    NeedsMoreInput { size_hint: usize, fallback: U },
}

impl<T> ProcessingResult<T, ()> {
    fn new(
        result: Result<T, crate::error::Error>,
    ) -> Result<ProcessingResult<T, ()>, crate::error::Error> {
        match result {
            Ok(v) => Ok(ProcessingResult::Complete { result: v }),
            Err(crate::error::Error::OutOfBounds(v)) => Ok(ProcessingResult::NeedsMoreInput {
                size_hint: v,
                fallback: (),
            }),
            Err(e) => Err(e),
        }
    }
}

#[derive(Clone)]
pub struct JxlBasicInfo {
    pub size: (usize, usize),
    pub bit_depth: JxlBitDepth,
    pub orientation: Orientation,
    pub extra_channels: Vec<JxlExtraChannel>,
    pub animation: Option<JxlAnimation>,
}
