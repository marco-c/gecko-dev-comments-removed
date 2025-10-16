




use std::{borrow::Cow, fmt};

use crate::{
    error::{Error, Result},
    headers::color_encoding::{
        ColorEncoding, ColorSpace, Primaries, RenderingIntent, TransferFunction, WhitePoint,
    },
    util::{Matrix3x3, Vector3, inv_3x3_matrix, mul_3x3_matrix, mul_3x3_vector},
};


const K_BRADFORD: Matrix3x3<f64> = [
    [0.8951, 0.2664, -0.1614],
    [-0.7502, 1.7135, 0.0367],
    [0.0389, -0.0685, 1.0296],
];

const K_BRADFORD_INV: Matrix3x3<f64> = [
    [0.9869929, -0.1470543, 0.1599627],
    [0.4323053, 0.5183603, 0.0492912],
    [-0.0085287, 0.0400428, 0.9684867],
];

pub fn compute_md5(data: &[u8]) -> [u8; 16] {
    let mut sum = [0u8; 16];
    let mut data64 = data.to_vec();
    data64.push(128);

    
    let extra = (64 - ((data64.len() + 8) & 63)) & 63;
    data64.resize(data64.len() + extra, 0);

    
    let bit_len = (data.len() as u64) << 3;
    for i in (0..64).step_by(8) {
        data64.push((bit_len >> i) as u8);
    }

    const SINEPARTS: [u32; 64] = [
        0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613,
        0xfd469501, 0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193,
        0xa679438e, 0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d,
        0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
        0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942, 0x8771f681, 0x6d9d6122,
        0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70, 0x289b7ec6, 0xeaa127fa,
        0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244,
        0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
        0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
        0xeb86d391,
    ];

    const SHIFT: [u32; 64] = [
        7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5,
        9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10,
        15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21,
    ];

    let mut a0: u32 = 0x67452301;
    let mut b0: u32 = 0xefcdab89;
    let mut c0: u32 = 0x98badcfe;
    let mut d0: u32 = 0x10325476;

    for i in (0..data64.len()).step_by(64) {
        let mut a = a0;
        let mut b = b0;
        let mut c = c0;
        let mut d = d0;

        for j in 0..64 {
            let (f, g) = if j < 16 {
                ((b & c) | ((!b) & d), j)
            } else if j < 32 {
                ((d & b) | ((!d) & c), (5 * j + 1) & 0xf)
            } else if j < 48 {
                (b ^ c ^ d, (3 * j + 5) & 0xf)
            } else {
                (c ^ (b | (!d)), (7 * j) & 0xf)
            };

            let dg0 = data64[i + g * 4] as u32;
            let dg1 = data64[i + g * 4 + 1] as u32;
            let dg2 = data64[i + g * 4 + 2] as u32;
            let dg3 = data64[i + g * 4 + 3] as u32;
            let u = dg0 | (dg1 << 8) | (dg2 << 16) | (dg3 << 24);

            let f = f.wrapping_add(a).wrapping_add(SINEPARTS[j]).wrapping_add(u);
            a = d;
            d = c;
            c = b;
            b = b.wrapping_add((f << SHIFT[j]) | (f >> (32 - SHIFT[j])));
        }

        a0 = a0.wrapping_add(a);
        b0 = b0.wrapping_add(b);
        c0 = c0.wrapping_add(c);
        d0 = d0.wrapping_add(d);
    }

    sum[0] = a0 as u8;
    sum[1] = (a0 >> 8) as u8;
    sum[2] = (a0 >> 16) as u8;
    sum[3] = (a0 >> 24) as u8;
    sum[4] = b0 as u8;
    sum[5] = (b0 >> 8) as u8;
    sum[6] = (b0 >> 16) as u8;
    sum[7] = (b0 >> 24) as u8;
    sum[8] = c0 as u8;
    sum[9] = (c0 >> 8) as u8;
    sum[10] = (c0 >> 16) as u8;
    sum[11] = (c0 >> 24) as u8;
    sum[12] = d0 as u8;
    sum[13] = (d0 >> 8) as u8;
    sum[14] = (d0 >> 16) as u8;
    sum[15] = (d0 >> 24) as u8;
    sum
}

#[allow(clippy::too_many_arguments)]
pub(crate) fn primaries_to_xyz(
    rx: f32,
    ry: f32,
    gx: f32,
    gy: f32,
    bx: f32,
    by: f32,
    wx: f32,
    wy: f32,
) -> Result<Matrix3x3<f64>, Error> {
    
    if !((0.0..=1.0).contains(&wx) && (wy > 0.0 && wy <= 1.0)) {
        return Err(Error::IccInvalidWhitePoint(
            wx,
            wy,
            "White point coordinates out of range ([0,1] for x, (0,1] for y)".to_string(),
        ));
    }
    
    
    
    

    
    
    
    
    
    let rz = 1.0 - rx as f64 - ry as f64;
    let gz = 1.0 - gx as f64 - gy as f64;
    let bz = 1.0 - bx as f64 - by as f64;
    let p_matrix = [
        [rx as f64, gx as f64, bx as f64],
        [ry as f64, gy as f64, by as f64],
        [rz, gz, bz],
    ];

    let p_inv_matrix = inv_3x3_matrix(&p_matrix)?;

    
    
    let x_over_y_wp = wx as f64 / wy as f64;
    let z_over_y_wp = (1.0 - wx as f64 - wy as f64) / wy as f64;

    if !x_over_y_wp.is_finite() || !z_over_y_wp.is_finite() {
        return Err(Error::IccInvalidWhitePoint(
            wx,
            wy,
            "Calculated X/Y or Z/Y for white point is not finite.".to_string(),
        ));
    }
    let white_point_xyz_vec: Vector3<f64> = [x_over_y_wp, 1.0, z_over_y_wp];

    
    
    let s_vec = mul_3x3_vector(&p_inv_matrix, &white_point_xyz_vec);

    
    let s_diag_matrix = [
        [s_vec[0], 0.0, 0.0],
        [0.0, s_vec[1], 0.0],
        [0.0, 0.0, s_vec[2]],
    ];
    
    let result_matrix = mul_3x3_matrix(&p_matrix, &s_diag_matrix);

    Ok(result_matrix)
}

pub(crate) fn adapt_to_xyz_d50(wx: f32, wy: f32) -> Result<Matrix3x3<f64>, Error> {
    if !((0.0..=1.0).contains(&wx) && (wy > 0.0 && wy <= 1.0)) {
        return Err(Error::IccInvalidWhitePoint(
            wx,
            wy,
            "White point coordinates out of range ([0,1] for x, (0,1] for y)".to_string(),
        ));
    }

    
    let x_over_y = wx as f64 / wy as f64;
    let z_over_y = (1.0 - wx as f64 - wy as f64) / wy as f64;

    
    if !x_over_y.is_finite() || !z_over_y.is_finite() {
        return Err(Error::IccInvalidWhitePoint(
            wx,
            wy,
            "Calculated X/Y or Z/Y for white point is not finite.".to_string(),
        ));
    }
    let w: Vector3<f64> = [x_over_y, 1.0, z_over_y];

    
    
    let w50: Vector3<f64> = [0.96422, 1.0, 0.82521];

    
    let lms_source = mul_3x3_vector(&K_BRADFORD, &w);
    let lms_d50 = mul_3x3_vector(&K_BRADFORD, &w50);

    
    if lms_source.contains(&0.0) {
        return Err(Error::IccInvalidWhitePoint(
            wx,
            wy,
            "LMS components for source white point are zero, leading to division by zero."
                .to_string(),
        ));
    }

    
    let mut a_diag_matrix: Matrix3x3<f64> = [[0.0; 3]; 3];
    for i in 0..3 {
        a_diag_matrix[i][i] = lms_d50[i] / lms_source[i];
        if !a_diag_matrix[i][i].is_finite() {
            return Err(Error::IccInvalidWhitePoint(
                wx,
                wy,
                format!("Diagonal adaptation matrix component {i} is not finite."),
            ));
        }
    }

    
    let b_matrix = mul_3x3_matrix(&a_diag_matrix, &K_BRADFORD);
    let final_adaptation_matrix = mul_3x3_matrix(&K_BRADFORD_INV, &b_matrix);

    Ok(final_adaptation_matrix)
}

#[allow(clippy::too_many_arguments)]
pub(crate) fn primaries_to_xyz_d50(
    rx: f32,
    ry: f32,
    gx: f32,
    gy: f32,
    bx: f32,
    by: f32,
    wx: f32,
    wy: f32,
) -> Result<Matrix3x3<f64>, Error> {
    
    let rgb_to_xyz_native_wp_matrix = primaries_to_xyz(rx, ry, gx, gy, bx, by, wx, wy)?;

    
    let adaptation_to_d50_matrix = adapt_to_xyz_d50(wx, wy)?;
    
    

    
    
    
    let result_matrix = mul_3x3_matrix(&adaptation_to_d50_matrix, &rgb_to_xyz_native_wp_matrix);

    Ok(result_matrix)
}

#[allow(clippy::too_many_arguments)]
fn create_icc_rgb_matrix(
    rx: f32,
    ry: f32,
    gx: f32,
    gy: f32,
    bx: f32,
    by: f32,
    wx: f32,
    wy: f32,
) -> Result<Matrix3x3<f32>, Error> {
    
    let result_f64 = primaries_to_xyz_d50(rx, ry, gx, gy, bx, by, wx, wy)?;
    Ok(std::array::from_fn(|r_idx| {
        std::array::from_fn(|c_idx| result_f64[r_idx][c_idx] as f32)
    }))
}

#[derive(Clone, Debug, PartialEq)]
pub enum JxlWhitePoint {
    D65,
    E,
    DCI,
    Chromaticity { wx: f32, wy: f32 },
}

impl fmt::Display for JxlWhitePoint {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            JxlWhitePoint::D65 => f.write_str("D65"),
            JxlWhitePoint::E => f.write_str("EER"),
            JxlWhitePoint::DCI => f.write_str("DCI"),
            JxlWhitePoint::Chromaticity { wx, wy } => write!(f, "{wx:.7};{wy:.7}"),
        }
    }
}

impl JxlWhitePoint {
    pub fn to_xy_coords(&self) -> (f32, f32) {
        match self {
            JxlWhitePoint::Chromaticity { wx, wy } => (*wx, *wy),
            JxlWhitePoint::D65 => (0.3127, 0.3290),
            JxlWhitePoint::DCI => (0.314, 0.351),
            JxlWhitePoint::E => (1.0 / 3.0, 1.0 / 3.0),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum JxlPrimaries {
    SRGB,
    BT2100,
    P3,
    Chromaticities {
        rx: f32,
        ry: f32,
        gx: f32,
        gy: f32,
        bx: f32,
        by: f32,
    },
}

impl fmt::Display for JxlPrimaries {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            JxlPrimaries::SRGB => f.write_str("SRG"),
            JxlPrimaries::BT2100 => f.write_str("202"),
            JxlPrimaries::P3 => f.write_str("DCI"),
            JxlPrimaries::Chromaticities {
                rx,
                ry,
                gx,
                gy,
                bx,
                by,
            } => write!(f, "{rx:.7},{ry:.7};{gx:.7},{gy:.7};{bx:.7},{by:.7}"),
        }
    }
}

impl JxlPrimaries {
    pub fn to_xy_coords(&self) -> [(f32, f32); 3] {
        match self {
            JxlPrimaries::Chromaticities {
                rx,
                ry,
                gx,
                gy,
                bx,
                by,
            } => [(*rx, *ry), (*gx, *gy), (*bx, *by)],
            JxlPrimaries::SRGB => [
                
                (0.639_998_7, 0.330_010_15),
                
                (0.300_003_8, 0.600_003_36),
                
                (0.150_002_05, 0.059_997_204),
                
            ],
            JxlPrimaries::BT2100 => [
                (0.708, 0.292), 
                (0.170, 0.797), 
                (0.131, 0.046), 
            ],
            JxlPrimaries::P3 => [
                (0.680, 0.320), 
                (0.265, 0.690), 
                (0.150, 0.060), 
            ],
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum JxlTransferFunction {
    BT709,
    Linear,
    SRGB,
    PQ,
    DCI,
    HLG,
    Gamma(f32),
}

impl fmt::Display for JxlTransferFunction {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            JxlTransferFunction::BT709 => f.write_str("709"),
            JxlTransferFunction::Linear => f.write_str("Lin"),
            JxlTransferFunction::SRGB => f.write_str("SRG"),
            JxlTransferFunction::PQ => f.write_str("PeQ"),
            JxlTransferFunction::DCI => f.write_str("DCI"),
            JxlTransferFunction::HLG => f.write_str("HLG"),
            JxlTransferFunction::Gamma(g) => write!(f, "g{g:.7}"),
        }
    }
}

#[derive(Clone, Debug, PartialEq)]
pub enum JxlColorEncoding {
    RgbColorSpace {
        white_point: JxlWhitePoint,
        primaries: JxlPrimaries,
        transfer_function: JxlTransferFunction,
        rendering_intent: RenderingIntent,
    },
    GrayscaleColorSpace {
        white_point: JxlWhitePoint,
        transfer_function: JxlTransferFunction,
        rendering_intent: RenderingIntent,
    },
    XYB {
        rendering_intent: RenderingIntent,
    },
}

impl JxlColorEncoding {
    pub fn from_internal(internal: &ColorEncoding) -> Result<Self> {
        let rendering_intent = internal.rendering_intent;
        if internal.color_space == ColorSpace::XYB {
            if rendering_intent != RenderingIntent::Perceptual {
                return Err(Error::InvalidRenderingIntent);
            }
            return Ok(Self::XYB { rendering_intent });
        }

        let white_point = match internal.white_point {
            WhitePoint::D65 => JxlWhitePoint::D65,
            WhitePoint::E => JxlWhitePoint::E,
            WhitePoint::DCI => JxlWhitePoint::DCI,
            WhitePoint::Custom => {
                let (wx, wy) = internal.white.as_f32_coords();
                JxlWhitePoint::Chromaticity { wx, wy }
            }
        };
        let transfer_function = if internal.tf.have_gamma {
            JxlTransferFunction::Gamma(internal.tf.gamma())
        } else {
            match internal.tf.transfer_function {
                TransferFunction::BT709 => JxlTransferFunction::BT709,
                TransferFunction::Linear => JxlTransferFunction::Linear,
                TransferFunction::SRGB => JxlTransferFunction::SRGB,
                TransferFunction::PQ => JxlTransferFunction::PQ,
                TransferFunction::DCI => JxlTransferFunction::DCI,
                TransferFunction::HLG => JxlTransferFunction::HLG,
                TransferFunction::Unknown => {
                    return Err(Error::InvalidColorEncoding);
                }
            }
        };

        if internal.color_space == ColorSpace::Gray {
            return Ok(Self::GrayscaleColorSpace {
                white_point,
                transfer_function,
                rendering_intent,
            });
        }

        let primaries = match internal.primaries {
            Primaries::SRGB => JxlPrimaries::SRGB,
            Primaries::BT2100 => JxlPrimaries::BT2100,
            Primaries::P3 => JxlPrimaries::P3,
            Primaries::Custom => {
                let (rx, ry) = internal.custom_primaries[0].as_f32_coords();
                let (gx, gy) = internal.custom_primaries[1].as_f32_coords();
                let (bx, by) = internal.custom_primaries[2].as_f32_coords();
                JxlPrimaries::Chromaticities {
                    rx,
                    ry,
                    gx,
                    gy,
                    bx,
                    by,
                }
            }
        };

        match internal.color_space {
            ColorSpace::Gray | ColorSpace::XYB => unreachable!(),
            ColorSpace::RGB => Ok(Self::RgbColorSpace {
                white_point,
                primaries,
                transfer_function,
                rendering_intent,
            }),
            ColorSpace::Unknown => Err(Error::InvalidColorSpace),
        }
    }

    fn create_icc_cicp_tag_data(&self, tags_data: &mut Vec<u8>) -> Result<Option<TagInfo>, Error> {
        let JxlColorEncoding::RgbColorSpace {
            white_point,
            primaries,
            transfer_function,
            ..
        } = self
        else {
            return Ok(None);
        };

        
        let primaries_val: u8 = match (white_point, primaries) {
            (JxlWhitePoint::D65, JxlPrimaries::SRGB) => 1,
            (JxlWhitePoint::D65, JxlPrimaries::BT2100) => 9,
            (JxlWhitePoint::D65, JxlPrimaries::P3) => 12,
            (JxlWhitePoint::DCI, JxlPrimaries::P3) => 11,
            _ => return Ok(None),
        };

        let tf_val = match transfer_function {
            JxlTransferFunction::BT709 => 1,
            JxlTransferFunction::Linear => 8,
            JxlTransferFunction::SRGB => 13,
            JxlTransferFunction::PQ => 16,
            JxlTransferFunction::DCI => 17,
            JxlTransferFunction::HLG => 18,
            
            JxlTransferFunction::Gamma(_) => return Ok(None),
        };

        let signature = b"cicp";
        let start_offset = tags_data.len() as u32;
        tags_data.extend_from_slice(signature);
        let data_len = tags_data.len();
        tags_data.resize(tags_data.len() + 4, 0);
        write_u32_be(tags_data, data_len, 0)?;
        tags_data.push(primaries_val);
        tags_data.push(tf_val);
        
        tags_data.push(0);
        
        tags_data.push(1);

        Ok(Some(TagInfo {
            signature: *signature,
            offset_in_tags_blob: start_offset,
            size_unpadded: 12,
        }))
    }

    fn can_tone_map_for_icc(&self) -> bool {
        let JxlColorEncoding::RgbColorSpace {
            white_point,
            primaries,
            transfer_function,
            ..
        } = self
        else {
            return false;
        };
        
        
        
        
        
        

        
        
        
        
        
        
        

        if let JxlPrimaries::Chromaticities { .. } = primaries {
            return false;
        }

        matches!(
            transfer_function,
            JxlTransferFunction::PQ | JxlTransferFunction::HLG
        ) && (*white_point == JxlWhitePoint::D65
            || (*white_point == JxlWhitePoint::DCI && *primaries == JxlPrimaries::P3))
    }

    pub fn get_color_encoding_description(&self) -> String {
        
        if let Some(common_name) = match self {
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::SRGB,
                transfer_function: JxlTransferFunction::SRGB,
                rendering_intent: RenderingIntent::Perceptual,
            } => Some("sRGB"),
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::P3,
                transfer_function: JxlTransferFunction::SRGB,
                rendering_intent: RenderingIntent::Perceptual,
            } => Some("DisplayP3"),
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::BT2100,
                transfer_function: JxlTransferFunction::PQ,
                rendering_intent: RenderingIntent::Relative,
            } => Some("Rec2100PQ"),
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::BT2100,
                transfer_function: JxlTransferFunction::HLG,
                rendering_intent: RenderingIntent::Relative,
            } => Some("Rec2100HLG"),
            _ => None,
        } {
            return common_name.to_string();
        }

        
        let mut d = String::with_capacity(64);

        match self {
            JxlColorEncoding::RgbColorSpace {
                white_point,
                primaries,
                transfer_function,
                rendering_intent,
            } => {
                d.push_str("RGB_");
                d.push_str(&white_point.to_string());
                d.push('_');
                d.push_str(&primaries.to_string());
                d.push('_');
                d.push_str(&rendering_intent.to_string());
                d.push('_');
                d.push_str(&transfer_function.to_string());
            }
            JxlColorEncoding::GrayscaleColorSpace {
                white_point,
                transfer_function,
                rendering_intent,
            } => {
                d.push_str("Gra_");
                d.push_str(&white_point.to_string());
                d.push('_');
                d.push_str(&rendering_intent.to_string());
                d.push('_');
                d.push_str(&transfer_function.to_string());
            }
            JxlColorEncoding::XYB { rendering_intent } => {
                d.push_str("XYB_");
                d.push_str(&rendering_intent.to_string());
            }
        }

        d
    }

    fn create_icc_header(&self) -> Result<Vec<u8>, Error> {
        let mut header_data = vec![0u8; 128];

        
        write_u32_be(&mut header_data, 0, 0)?;
        const CMM_TAG: &str = "jxl ";
        
        write_icc_tag(&mut header_data, 4, CMM_TAG)?;

        
        
        write_u32_be(&mut header_data, 8, 0x04400000u32)?;

        let profile_class_str = match self {
            JxlColorEncoding::XYB { .. } => "scnr",
            _ => "mntr",
        };
        write_icc_tag(&mut header_data, 12, profile_class_str)?;

        
        let data_color_space_str = match self {
            JxlColorEncoding::GrayscaleColorSpace { .. } => "GRAY",
            _ => "RGB ",
        };
        write_icc_tag(&mut header_data, 16, data_color_space_str)?;

        
        
        
        const K_ENABLE_3D_ICC_TONEMAPPING: bool = true;
        if K_ENABLE_3D_ICC_TONEMAPPING && self.can_tone_map_for_icc() {
            write_icc_tag(&mut header_data, 20, "Lab ")?;
        } else {
            write_icc_tag(&mut header_data, 20, "XYZ ")?;
        }

        
        write_u16_be(&mut header_data, 24, 2019)?; 
        write_u16_be(&mut header_data, 26, 12)?; 
        write_u16_be(&mut header_data, 28, 1)?; 
        write_u16_be(&mut header_data, 30, 0)?; 
        write_u16_be(&mut header_data, 32, 0)?; 
        write_u16_be(&mut header_data, 34, 0)?; 

        write_icc_tag(&mut header_data, 36, "acsp")?;
        write_icc_tag(&mut header_data, 40, "APPL")?;

        
        write_u32_be(&mut header_data, 44, 0)?;
        
        write_u32_be(&mut header_data, 48, 0)?;
        
        write_u32_be(&mut header_data, 52, 0)?;
        
        write_u32_be(&mut header_data, 56, 0)?;
        write_u32_be(&mut header_data, 60, 0)?;

        
        let rendering_intent = match self {
            JxlColorEncoding::RgbColorSpace {
                rendering_intent, ..
            }
            | JxlColorEncoding::GrayscaleColorSpace {
                rendering_intent, ..
            }
            | JxlColorEncoding::XYB { rendering_intent } => rendering_intent,
        };
        write_u32_be(&mut header_data, 64, *rendering_intent as u32)?;

        
        write_u32_be(&mut header_data, 68, 0x0000F6D6)?;
        write_u32_be(&mut header_data, 72, 0x00010000)?;
        write_u32_be(&mut header_data, 76, 0x0000D32D)?;

        
        write_icc_tag(&mut header_data, 80, CMM_TAG)?;

        
        

        

        Ok(header_data)
    }

    pub fn maybe_create_profile(&self) -> Result<Option<Vec<u8>>, Error> {
        if let JxlColorEncoding::XYB { rendering_intent } = self
            && *rendering_intent != RenderingIntent::Perceptual
        {
            return Err(Error::InvalidRenderingIntent);
        }
        let header = self.create_icc_header()?;
        let mut tags_data: Vec<u8> = Vec::new();
        let mut collected_tags: Vec<TagInfo> = Vec::new();

        
        let description_string = self.get_color_encoding_description();

        let desc_tag_start_offset = tags_data.len() as u32; 
        create_icc_mluc_tag(&mut tags_data, &description_string)?;
        let desc_tag_unpadded_size = (tags_data.len() as u32) - desc_tag_start_offset;
        pad_to_4_byte_boundary(&mut tags_data);
        collected_tags.push(TagInfo {
            signature: *b"desc",
            offset_in_tags_blob: desc_tag_start_offset,
            size_unpadded: desc_tag_unpadded_size,
        });

        
        let copyright_string = "CC0";
        let cprt_tag_start_offset = tags_data.len() as u32;
        create_icc_mluc_tag(&mut tags_data, copyright_string)?;
        let cprt_tag_unpadded_size = (tags_data.len() as u32) - cprt_tag_start_offset;
        pad_to_4_byte_boundary(&mut tags_data);
        collected_tags.push(TagInfo {
            signature: *b"cprt",
            offset_in_tags_blob: cprt_tag_start_offset,
            size_unpadded: cprt_tag_unpadded_size,
        });

        match self {
            JxlColorEncoding::GrayscaleColorSpace { white_point, .. } => {
                let (wx, wy) = white_point.to_xy_coords();
                collected_tags.push(create_icc_xyz_tag(
                    &mut tags_data,
                    &cie_xyz_from_white_cie_xy(wx, wy)?,
                )?);
            }
            _ => {
                
                const D50: [f32; 3] = [0.964203f32, 1.0, 0.824905];
                collected_tags.push(create_icc_xyz_tag(&mut tags_data, &D50)?);
            }
        }
        pad_to_4_byte_boundary(&mut tags_data);
        if !matches!(self, JxlColorEncoding::GrayscaleColorSpace { .. }) {
            let (wx, wy) = match self {
                JxlColorEncoding::GrayscaleColorSpace { .. } => unreachable!(),
                JxlColorEncoding::RgbColorSpace { white_point, .. } => white_point.to_xy_coords(),
                JxlColorEncoding::XYB { .. } => JxlWhitePoint::D65.to_xy_coords(),
            };
            let chad_matrix_f64 = adapt_to_xyz_d50(wx, wy)?;
            let chad_matrix = std::array::from_fn(|r_idx| {
                std::array::from_fn(|c_idx| chad_matrix_f64[r_idx][c_idx] as f32)
            });
            collected_tags.push(create_icc_chad_tag(&mut tags_data, &chad_matrix)?);
            pad_to_4_byte_boundary(&mut tags_data);
        }

        if let JxlColorEncoding::RgbColorSpace {
            white_point,
            primaries,
            ..
        } = self
        {
            if let Some(tag_info) = self.create_icc_cicp_tag_data(&mut tags_data)? {
                collected_tags.push(tag_info);
                
                
                
            }

            
            let primaries_coords = primaries.to_xy_coords();
            let (rx, ry) = primaries_coords[0];
            let (gx, gy) = primaries_coords[1];
            let (bx, by) = primaries_coords[2];
            let (wx, wy) = white_point.to_xy_coords();

            
            let m = create_icc_rgb_matrix(rx, ry, gx, gy, bx, by, wx, wy)?;

            
            let r_xyz = [m[0][0], m[1][0], m[2][0]];
            let g_xyz = [m[0][1], m[1][1], m[2][1]];
            let b_xyz = [m[0][2], m[1][2], m[2][2]];

            
            let create_xyz_type_tag_data =
                |tags: &mut Vec<u8>, xyz: &[f32; 3]| -> Result<u32, Error> {
                    let start_offset = tags.len();
                    
                    tags.extend_from_slice(b"XYZ ");
                    tags.extend_from_slice(&0u32.to_be_bytes());
                    for &val in xyz {
                        append_s15_fixed_16(tags, val)?;
                    }
                    Ok((tags.len() - start_offset) as u32)
                };

            
            let r_xyz_tag_start_offset = tags_data.len() as u32;
            let r_xyz_tag_unpadded_size = create_xyz_type_tag_data(&mut tags_data, &r_xyz)?;
            pad_to_4_byte_boundary(&mut tags_data);
            collected_tags.push(TagInfo {
                signature: *b"rXYZ", 
                offset_in_tags_blob: r_xyz_tag_start_offset,
                size_unpadded: r_xyz_tag_unpadded_size,
            });

            
            let g_xyz_tag_start_offset = tags_data.len() as u32;
            let g_xyz_tag_unpadded_size = create_xyz_type_tag_data(&mut tags_data, &g_xyz)?;
            pad_to_4_byte_boundary(&mut tags_data);
            collected_tags.push(TagInfo {
                signature: *b"gXYZ",
                offset_in_tags_blob: g_xyz_tag_start_offset,
                size_unpadded: g_xyz_tag_unpadded_size,
            });

            
            let b_xyz_tag_start_offset = tags_data.len() as u32;
            let b_xyz_tag_unpadded_size = create_xyz_type_tag_data(&mut tags_data, &b_xyz)?;
            pad_to_4_byte_boundary(&mut tags_data);
            collected_tags.push(TagInfo {
                signature: *b"bXYZ",
                offset_in_tags_blob: b_xyz_tag_start_offset,
                size_unpadded: b_xyz_tag_unpadded_size,
            });
        }
        if self.can_tone_map_for_icc() {
            todo!("implement A2B0 and B2A0 tags when being able to tone map")
        } else {
            match self {
                JxlColorEncoding::XYB { .. } => todo!("implement A2B0 and B2A0 tags"),
                JxlColorEncoding::RgbColorSpace {
                    transfer_function, ..
                }
                | JxlColorEncoding::GrayscaleColorSpace {
                    transfer_function, ..
                } => {
                    let trc_tag_start_offset = tags_data.len() as u32;
                    let trc_tag_unpadded_size = match transfer_function {
                        JxlTransferFunction::Gamma(g) => {
                            
                            let gamma = 1.0 / g;
                            create_icc_curv_para_tag(&mut tags_data, &[gamma], 0)?
                        }
                        JxlTransferFunction::SRGB => {
                            
                            const PARAMS: [f32; 5] =
                                [2.4, 1.0 / 1.055, 0.055 / 1.055, 1.0 / 12.92, 0.04045];
                            create_icc_curv_para_tag(&mut tags_data, &PARAMS, 3)?
                        }
                        JxlTransferFunction::BT709 => {
                            
                            const PARAMS: [f32; 5] =
                                [1.0 / 0.45, 1.0 / 1.099, 0.099 / 1.099, 1.0 / 4.5, 0.081];
                            create_icc_curv_para_tag(&mut tags_data, &PARAMS, 3)?
                        }
                        JxlTransferFunction::Linear => {
                            
                            const PARAMS: [f32; 5] = [1.0, 1.0, 0.0, 1.0, 0.0];
                            create_icc_curv_para_tag(&mut tags_data, &PARAMS, 3)?
                        }
                        JxlTransferFunction::DCI => {
                            
                            const PARAMS: [f32; 5] = [2.6, 1.0, 0.0, 1.0, 0.0];
                            create_icc_curv_para_tag(&mut tags_data, &PARAMS, 3)?
                        }
                        JxlTransferFunction::HLG | JxlTransferFunction::PQ => {
                            let params = create_table_curve(64, transfer_function, false)?;
                            create_icc_curv_para_tag(&mut tags_data, params.as_slice(), 3)?
                        }
                    };
                    pad_to_4_byte_boundary(&mut tags_data);

                    match self {
                        JxlColorEncoding::GrayscaleColorSpace { .. } => {
                            
                            collected_tags.push(TagInfo {
                                signature: *b"kTRC",
                                offset_in_tags_blob: trc_tag_start_offset,
                                size_unpadded: trc_tag_unpadded_size,
                            });
                        }
                        _ => {
                            
                            
                            collected_tags.push(TagInfo {
                                signature: *b"rTRC",
                                offset_in_tags_blob: trc_tag_start_offset,
                                size_unpadded: trc_tag_unpadded_size,
                            });
                            collected_tags.push(TagInfo {
                                signature: *b"gTRC",
                                offset_in_tags_blob: trc_tag_start_offset, 
                                size_unpadded: trc_tag_unpadded_size,      
                            });
                            collected_tags.push(TagInfo {
                                signature: *b"bTRC",
                                offset_in_tags_blob: trc_tag_start_offset, 
                                size_unpadded: trc_tag_unpadded_size,      
                            });
                        }
                    }
                }
            }
        }

        
        let mut tag_table_bytes: Vec<u8> = Vec::new();
        
        tag_table_bytes.extend_from_slice(&(collected_tags.len() as u32).to_be_bytes());

        let header_size = header.len() as u32;
        
        let tag_table_on_disk_size = 4 + (collected_tags.len() as u32 * 12);

        for tag_info in &collected_tags {
            tag_table_bytes.extend_from_slice(&tag_info.signature);
            
            let final_profile_offset_for_tag =
                header_size + tag_table_on_disk_size + tag_info.offset_in_tags_blob;
            tag_table_bytes.extend_from_slice(&final_profile_offset_for_tag.to_be_bytes());
            
            
            
            
            
            

            tag_table_bytes.extend_from_slice(&tag_info.size_unpadded.to_be_bytes());
            
            
            
            
        }

        
        let mut final_icc_profile_data: Vec<u8> =
            Vec::with_capacity(header.len() + tag_table_bytes.len() + tags_data.len());
        final_icc_profile_data.extend_from_slice(&header);
        final_icc_profile_data.extend_from_slice(&tag_table_bytes);
        final_icc_profile_data.extend_from_slice(&tags_data);

        
        let total_profile_size = final_icc_profile_data.len() as u32;
        write_u32_be(&mut final_icc_profile_data, 0, total_profile_size)?;

        
        let mut final_icc_profile_data: Vec<u8> =
            Vec::with_capacity(header.len() + tag_table_bytes.len() + tags_data.len());
        final_icc_profile_data.extend_from_slice(&header);
        final_icc_profile_data.extend_from_slice(&tag_table_bytes);
        final_icc_profile_data.extend_from_slice(&tags_data);

        
        let total_profile_size = final_icc_profile_data.len() as u32;
        write_u32_be(&mut final_icc_profile_data, 0, total_profile_size)?;

        
        
        let mut profile_for_checksum = final_icc_profile_data.clone();

        if profile_for_checksum.len() >= 84 {
            
            profile_for_checksum[44..48].fill(0);
            
            profile_for_checksum[64..68].fill(0);
            
        }

        
        let checksum = compute_md5(&profile_for_checksum);

        
        
        if final_icc_profile_data.len() >= 100 {
            final_icc_profile_data[84..100].copy_from_slice(&checksum);
        }

        Ok(Some(final_icc_profile_data))
    }

    pub fn srgb(grayscale: bool) -> Self {
        if grayscale {
            JxlColorEncoding::GrayscaleColorSpace {
                white_point: JxlWhitePoint::D65,
                transfer_function: JxlTransferFunction::SRGB,
                rendering_intent: RenderingIntent::Relative,
            }
        } else {
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::SRGB,
                transfer_function: JxlTransferFunction::SRGB,
                rendering_intent: RenderingIntent::Relative,
            }
        }
    }
}

#[derive(Clone)]
pub enum JxlColorProfile {
    Icc(Vec<u8>),
    Simple(JxlColorEncoding),
}

impl JxlColorProfile {
    pub fn as_icc(&self) -> Cow<'_, Vec<u8>> {
        match self {
            Self::Icc(x) => Cow::Borrowed(x),
            Self::Simple(encoding) => Cow::Owned(encoding.maybe_create_profile().unwrap().unwrap()),
        }
    }
}


pub trait JxlCmsTransformer {
    
    
    
    
    fn do_transform(&mut self, input: &[f32], output: &mut [f32]);

    
    
    
    
    fn do_transform_inplace(&mut self, inout: &mut [f32]);
}

pub trait JxlCms {
    
    
    fn parse_icc(&mut self, icc: &[u8]) -> Result<(ColorEncoding, bool)>;

    
    
    
    
    fn initialize_transforms(
        &mut self,
        n: usize,
        max_pixels_per_transform: usize,
        input: JxlColorProfile,
        output: JxlColorProfile,
        intensity_target: f32,
    ) -> Result<Vec<Box<dyn JxlCmsTransformer>>>;
}


fn write_u32_be(slice: &mut [u8], pos: usize, value: u32) -> Result<(), Error> {
    if pos.checked_add(4).is_none_or(|end| end > slice.len()) {
        return Err(Error::IccWriteOutOfBounds);
    }
    slice[pos..pos + 4].copy_from_slice(&value.to_be_bytes());
    Ok(())
}


fn write_u16_be(slice: &mut [u8], pos: usize, value: u16) -> Result<(), Error> {
    if pos.checked_add(2).is_none_or(|end| end > slice.len()) {
        return Err(Error::IccWriteOutOfBounds);
    }
    slice[pos..pos + 2].copy_from_slice(&value.to_be_bytes());
    Ok(())
}


fn write_icc_tag(slice: &mut [u8], pos: usize, tag_str: &str) -> Result<(), Error> {
    if tag_str.len() != 4 || !tag_str.is_ascii() {
        return Err(Error::IccInvalidTagString(tag_str.to_string()));
    }
    if pos.checked_add(4).is_none_or(|end| end > slice.len()) {
        return Err(Error::IccWriteOutOfBounds);
    }
    slice[pos..pos + 4].copy_from_slice(tag_str.as_bytes());
    Ok(())
}





fn create_icc_mluc_tag(tags: &mut Vec<u8>, text: &str) -> Result<(), Error> {
    
    
    if !text.is_ascii() {
        return Err(Error::IccMlucTextNotAscii(text.to_string()));
    }
    
    tags.extend_from_slice(b"mluc");
    
    tags.extend_from_slice(&0u32.to_be_bytes());
    
    tags.extend_from_slice(&1u32.to_be_bytes());
    
    
    tags.extend_from_slice(&12u32.to_be_bytes());
    
    tags.extend_from_slice(b"en");
    
    tags.extend_from_slice(b"US");
    
    
    let string_actual_byte_length = text.len() * 2;
    tags.extend_from_slice(&(string_actual_byte_length as u32).to_be_bytes());
    
    
    tags.extend_from_slice(&28u32.to_be_bytes());
    
    
    for ascii_char_code in text.as_bytes() {
        tags.push(0u8);
        tags.push(*ascii_char_code);
    }

    Ok(())
}

struct TagInfo {
    signature: [u8; 4],
    
    offset_in_tags_blob: u32,
    
    size_unpadded: u32,
}

fn pad_to_4_byte_boundary(data: &mut Vec<u8>) {
    data.resize(data.len().next_multiple_of(4), 0u8);
}




fn append_s15_fixed_16(tags_data: &mut Vec<u8>, value: f32) -> Result<(), Error> {
    
    
    
    if !(value.is_finite() && (-32767.995..=32767.995).contains(&value)) {
        return Err(Error::IccValueOutOfRangeS15Fixed16(value));
    }

    
    let scaled_value = (value * 65536.0).round();
    
    let int_value = scaled_value as i32;
    tags_data.extend_from_slice(&int_value.to_be_bytes());
    Ok(())
}



fn create_icc_xyz_tag(tags_data: &mut Vec<u8>, xyz_color: &[f32; 3]) -> Result<TagInfo, Error> {
    
    let start_offset = tags_data.len() as u32;
    let signature = b"XYZ ";
    tags_data.extend_from_slice(signature);

    
    tags_data.extend_from_slice(&0u32.to_be_bytes());

    
    for &val in xyz_color {
        append_s15_fixed_16(tags_data, val)?;
    }

    Ok(TagInfo {
        signature: *b"wtpt",
        offset_in_tags_blob: start_offset,
        size_unpadded: (tags_data.len() as u32) - start_offset,
    })
}

fn create_icc_chad_tag(
    tags_data: &mut Vec<u8>,
    chad_matrix: &Matrix3x3<f32>,
) -> Result<TagInfo, Error> {
    
    let signature = b"sf32";
    let start_offset = tags_data.len() as u32;
    tags_data.extend_from_slice(signature);

    
    tags_data.extend_from_slice(&0u32.to_be_bytes());

    
    
    for row_array in chad_matrix.iter() {
        for &value in row_array.iter() {
            append_s15_fixed_16(tags_data, value)?;
        }
    }
    Ok(TagInfo {
        signature: *b"chad",
        offset_in_tags_blob: start_offset,
        size_unpadded: (tags_data.len() as u32) - start_offset,
    })
}


fn cie_xyz_from_white_cie_xy(wx: f32, wy: f32) -> Result<[f32; 3], Error> {
    
    if wy.abs() < 1e-12 {
        return Err(Error::IccInvalidWhitePointY(wy));
    }
    let factor = 1.0 / wy;
    let x_val = wx * factor;
    let y_val = 1.0f32;
    let z_val = (1.0 - wx - wy) * factor;
    Ok([x_val, y_val, z_val])
}



fn create_icc_curv_para_tag(
    tags_data: &mut Vec<u8>,
    params: &[f32],
    curve_type: u16,
) -> Result<u32, Error> {
    let start_offset = tags_data.len();
    
    tags_data.extend_from_slice(b"para");
    
    tags_data.extend_from_slice(&0u32.to_be_bytes());
    
    tags_data.extend_from_slice(&curve_type.to_be_bytes());
    
    tags_data.extend_from_slice(&0u16.to_be_bytes());
    
    for &param in params {
        append_s15_fixed_16(tags_data, param)?;
    }
    Ok((tags_data.len() - start_offset) as u32)
}

fn display_from_encoded_pq(display_intensity_target: f32, mut e: f64) -> f64 {
    const M1: f64 = 2610.0 / 16384.0;
    const M2: f64 = (2523.0 / 4096.0) * 128.0;
    const C1: f64 = 3424.0 / 4096.0;
    const C2: f64 = (2413.0 / 4096.0) * 32.0;
    const C3: f64 = (2392.0 / 4096.0) * 32.0;
    
    if e == 0.0 {
        return 0.0;
    }

    
    
    let original_sign = e.signum();
    e = e.abs();

    
    let xp = e.powf(1.0 / M2);
    let num = (xp - C1).max(0.0);
    let den = C2 - C3 * xp;

    
    
    
    debug_assert!(den != 0.0, "PQ transfer function denominator is zero.");

    let d = (num / den).powf(1.0 / M1);

    
    debug_assert!(
        d >= 0.0,
        "PQ intermediate value `d` should not be negative."
    );

    
    
    let scaled_d = d * (10000.0 / display_intensity_target as f64);

    
    scaled_d.copysign(original_sign)
}













#[allow(non_camel_case_types)]
struct TF_HLG;

impl TF_HLG {
    
    const A: f64 = 0.17883277;
    const RA: f64 = 1.0 / Self::A;
    const B: f64 = 1.0 - 4.0 * Self::A;
    const C: f64 = 0.5599107295;
    const INV_12: f64 = 1.0 / 12.0;

    
    
    
    
    
    #[inline]
    fn display_from_encoded(e: f64) -> f64 {
        Self::inv_oetf(e)
    }

    
    
    
    
    #[inline]
    #[allow(dead_code)]
    fn encoded_from_display(d: f64) -> f64 {
        Self::oetf(d)
    }

    
    fn oetf(mut s: f64) -> f64 {
        if s == 0.0 {
            return 0.0;
        }
        let original_sign = s.signum();
        s = s.abs();

        let e = if s <= Self::INV_12 {
            (3.0 * s).sqrt()
        } else {
            Self::A * (12.0 * s - Self::B).ln() + Self::C
        };

        
        debug_assert!(e > 0.0);

        e.copysign(original_sign)
    }

    
    fn inv_oetf(mut e: f64) -> f64 {
        if e == 0.0 {
            return 0.0;
        }
        let original_sign = e.signum();
        e = e.abs();

        let s = if e <= 0.5 {
            
            e * e * (1.0 / 3.0)
        } else {
            (((e - Self::C) * Self::RA).exp() + Self::B) * Self::INV_12
        };

        
        debug_assert!(s >= 0.0);

        s.copysign(original_sign)
    }
}













fn create_table_curve(
    n: usize,
    tf: &JxlTransferFunction,
    tone_map: bool,
) -> Result<Vec<f32>, Error> {
    
    
    if n > 4096 {
        return Err(Error::IccTableSizeExceeded(n));
    }

    if !matches!(tf, JxlTransferFunction::PQ | JxlTransferFunction::HLG) {
        return Err(Error::IccUnsupportedTransferFunction);
    }

    
    const PQ_INTENSITY_TARGET: f64 = 10000.0;
    
    const DEFAULT_INTENSITY_TARGET: f64 = 255.0; 

    let mut table = Vec::with_capacity(n);
    for i in 0..n {
        
        let x = i as f64 / (n - 1) as f64;

        
        
        let y = match tf {
            JxlTransferFunction::HLG => TF_HLG::display_from_encoded(x),
            JxlTransferFunction::PQ => {
                
                
                display_from_encoded_pq(PQ_INTENSITY_TARGET as f32, x) / PQ_INTENSITY_TARGET
            }
            _ => unreachable!(), 
        };

        
        if tone_map
            && *tf == JxlTransferFunction::PQ
            && PQ_INTENSITY_TARGET > DEFAULT_INTENSITY_TARGET
        {
            
            
            
            
        }

        
        
        let y_clamped = y.clamp(0.0, 1.0);

        
        table.push(y_clamped as f32);
    }

    Ok(table)
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_md5() {
        
        let test_cases = vec![
            ("", "d41d8cd98f00b204e9800998ecf8427e"),
            (
                "The quick brown fox jumps over the lazy dog",
                "9e107d9d372bb6826bd81d3542a419d6",
            ),
            ("abc", "900150983cd24fb0d6963f7d28e17f72"),
            ("message digest", "f96b697d7cb7938d525a2f31aaf161d0"),
            (
                "abcdefghijklmnopqrstuvwxyz",
                "c3fcd3d76192e4007dfb496cca67e13b",
            ),
            (
                "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
                "57edf4a22be3c955ac49da2e2107b67a",
            ),
        ];

        for (input, expected) in test_cases {
            let hash = compute_md5(input.as_bytes());
            let hex: String = hash.iter().map(|e| format!("{:02x}", e)).collect();
            assert_eq!(hex, expected, "Failed for input: '{}'", input);
        }
    }

    #[test]
    fn test_description() {
        assert_eq!(
            JxlColorEncoding::srgb(false).get_color_encoding_description(),
            "RGB_D65_SRG_Rel_SRG"
        );
        assert_eq!(
            JxlColorEncoding::srgb(true).get_color_encoding_description(),
            "Gra_D65_Rel_SRG"
        );
        assert_eq!(
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::BT2100,
                transfer_function: JxlTransferFunction::Gamma(1.7),
                rendering_intent: RenderingIntent::Relative
            }
            .get_color_encoding_description(),
            "RGB_D65_202_Rel_g1.7000000"
        );
        assert_eq!(
            JxlColorEncoding::RgbColorSpace {
                white_point: JxlWhitePoint::D65,
                primaries: JxlPrimaries::P3,
                transfer_function: JxlTransferFunction::SRGB,
                rendering_intent: RenderingIntent::Perceptual
            }
            .get_color_encoding_description(),
            "DisplayP3"
        );
    }
}
