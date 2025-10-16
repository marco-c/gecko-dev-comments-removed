




use crate::BLOCK_DIM;
use crate::error::{Error::InvalidVarDCTTransform, Result};

pub const MAX_COEFF_BLOCKS: usize = 32;
pub const MAX_BLOCK_DIM: usize = BLOCK_DIM * MAX_COEFF_BLOCKS;
pub const MAX_COEFF_AREA: usize = MAX_BLOCK_DIM * MAX_BLOCK_DIM;

#[allow(clippy::upper_case_acronyms)]
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum HfTransformType {
    
    
    DCT = 0,
    
    
    IDENTITY = 1,
    
    DCT2X2 = 2,
    
    DCT4X4 = 3,
    
    DCT16X16 = 4,
    
    DCT32X32 = 5,
    
    DCT16X8 = 6,
    
    DCT8X16 = 7,
    
    DCT32X8 = 8,
    
    DCT8X32 = 9,
    
    DCT32X16 = 10,
    
    DCT16X32 = 11,
    
    DCT4X8 = 12,
    DCT8X4 = 13,
    
    AFV0 = 14,
    AFV1 = 15,
    AFV2 = 16,
    AFV3 = 17,
    
    DCT64X64 = 18,
    DCT64X32 = 19,
    DCT32X64 = 20,
    
    DCT128X128 = 21,
    DCT128X64 = 22,
    DCT64X128 = 23,
    DCT256X256 = 24,
    DCT256X128 = 25,
    DCT128X256 = 26,
}

impl HfTransformType {
    pub const INVALID_TRANSFORM: u8 = Self::CARDINALITY as u8;
    pub const CARDINALITY: usize = Self::VALUES.len();
    pub const VALUES: [HfTransformType; 27] = [
        HfTransformType::DCT,
        HfTransformType::IDENTITY,
        HfTransformType::DCT2X2,
        HfTransformType::DCT4X4,
        HfTransformType::DCT16X16,
        HfTransformType::DCT32X32,
        HfTransformType::DCT16X8,
        HfTransformType::DCT8X16,
        HfTransformType::DCT32X8,
        HfTransformType::DCT8X32,
        HfTransformType::DCT32X16,
        HfTransformType::DCT16X32,
        HfTransformType::DCT4X8,
        HfTransformType::DCT8X4,
        HfTransformType::AFV0,
        HfTransformType::AFV1,
        HfTransformType::AFV2,
        HfTransformType::AFV3,
        HfTransformType::DCT64X64,
        HfTransformType::DCT64X32,
        HfTransformType::DCT32X64,
        HfTransformType::DCT128X128,
        HfTransformType::DCT128X64,
        HfTransformType::DCT64X128,
        HfTransformType::DCT256X256,
        HfTransformType::DCT256X128,
        HfTransformType::DCT128X256,
    ];
    pub fn from_usize(idx: usize) -> Result<HfTransformType> {
        match HfTransformType::VALUES.get(idx) {
            Some(transform) => Ok(*transform),
            None => Err(InvalidVarDCTTransform(idx)),
        }
    }
}

pub fn covered_blocks_x(transform: HfTransformType) -> u32 {
    let lut: [u32; HfTransformType::CARDINALITY] = [
        1, 1, 1, 1, 2, 4, 1, 2, 1, 4, 2, 4, 1, 1, 1, 1, 1, 1, 8, 4, 8, 16, 8, 16, 32, 16, 32,
    ];
    lut[transform as usize]
}

pub fn covered_blocks_y(transform: HfTransformType) -> u32 {
    let lut: [u32; HfTransformType::CARDINALITY] = [
        1, 1, 1, 1, 2, 4, 2, 1, 4, 1, 4, 2, 1, 1, 1, 1, 1, 1, 8, 8, 4, 16, 16, 8, 32, 32, 16,
    ];
    lut[transform as usize]
}

pub fn block_shape_id(transform: HfTransformType) -> u32 {
    let lut: [u32; HfTransformType::CARDINALITY] = [
        0, 1, 1, 1, 2, 3, 4, 4, 5, 5, 6, 6, 1, 1, 1, 1, 1, 1, 7, 8, 8, 9, 10, 10, 11, 12, 12,
    ];
    lut[transform as usize]
}
