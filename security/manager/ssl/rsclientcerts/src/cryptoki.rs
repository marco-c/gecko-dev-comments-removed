




use byteorder::{NativeEndian, WriteBytesExt};
use digest::{Digest, DynDigest};
use pkcs11_bindings::*;
use rand::rngs::OsRng;
use rand::RngCore;
use rsclientcerts_util::error::{Error, ErrorType};
use rsclientcerts_util::{error_here, read_encoded_certificate_identifiers};
use std::convert::TryInto;
use std::iter::zip;

use crate::manager::CryptokiObject;




pub const ENCODED_OID_BYTES_SECP256R1: &[u8] =
    &[0x06, 0x08, 0x2a, 0x86, 0x48, 0xce, 0x3d, 0x03, 0x01, 0x07];
pub const ENCODED_OID_BYTES_SECP384R1: &[u8] = &[0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x22];
pub const ENCODED_OID_BYTES_SECP521R1: &[u8] = &[0x06, 0x05, 0x2b, 0x81, 0x04, 0x00, 0x23];



pub fn serialize_uint<T: TryInto<u64>>(value: T) -> Result<Vec<u8>, Error> {
    let value_size = std::mem::size_of::<T>();
    let mut value_buf = Vec::with_capacity(value_size);
    let value_as_u64 = value
        .try_into()
        .map_err(|_| error_here!(ErrorType::ValueTooLarge))?;
    value_buf
        .write_uint::<NativeEndian>(value_as_u64, value_size)
        .map_err(|_| error_here!(ErrorType::LibraryFailure))?;
    Ok(value_buf)
}

fn make_hasher(params: &CK_RSA_PKCS_PSS_PARAMS) -> Result<Box<dyn DynDigest>, Error> {
    match params.hashAlg {
        CKM_SHA256 => Ok(Box::new(sha2::Sha256::new())),
        CKM_SHA384 => Ok(Box::new(sha2::Sha384::new())),
        CKM_SHA512 => Ok(Box::new(sha2::Sha512::new())),
        _ => Err(error_here!(ErrorType::LibraryFailure)),
    }
}


fn mgf(
    mgf_seed: &[u8],
    mask_len: usize,
    h_len: usize,
    params: &CK_RSA_PKCS_PSS_PARAMS,
) -> Result<Vec<u8>, Error> {
    
    
    
    
    if mask_len > 1 << 30 {
        return Err(error_here!(ErrorType::LibraryFailure));
    }
    
    let mut t = Vec::with_capacity(mask_len);
    
    
    for counter in 0..mask_len.div_ceil(h_len) {
        
        
        
        let c = u32::to_be_bytes(counter.try_into().unwrap());
        
        
        let mut hasher = make_hasher(params)?;
        hasher.update(mgf_seed);
        hasher.update(&c);
        t.extend_from_slice(&mut hasher.finalize());
    }
    
    t.truncate(mask_len);
    Ok(t)
}

pub fn modulus_bit_length(modulus: &[u8]) -> usize {
    let mut bit_length = modulus.len() * 8;
    for byte in modulus {
        if *byte != 0 {
            
            let leading_zeros: usize = byte.leading_zeros().try_into().unwrap();
            bit_length -= leading_zeros;
            return bit_length;
        }
        bit_length -= 8;
    }
    bit_length
}






pub fn emsa_pss_encode(
    m_hash: &[u8],
    em_bits: usize,
    params: &CK_RSA_PKCS_PSS_PARAMS,
) -> Result<Vec<u8>, Error> {
    let em_len = em_bits.div_ceil(8);
    let s_len: usize = params
        .sLen
        .try_into()
        .map_err(|_| error_here!(ErrorType::LibraryFailure))?;

    
    
    
    

    

    
    if em_len < m_hash.len() + s_len + 2 {
        return Err(error_here!(ErrorType::LibraryFailure));
    }

    
    
    let salt = {
        let mut salt = vec![0u8; s_len];
        OsRng.fill_bytes(&mut salt);
        salt
    };

    
    
    
    
    let mut hasher = make_hasher(params)?;
    let h_len = hasher.output_size();
    hasher.update(&[0, 0, 0, 0, 0, 0, 0, 0]);
    hasher.update(m_hash);
    hasher.update(&salt);
    let h = hasher.finalize().to_vec();

    
    
    
    
    

    
    let mut db_mask = mgf(&h, em_len - h_len - 1, h_len, params)?;

    
    
    
    let salt_index = db_mask.len() - s_len;
    db_mask[salt_index - 1] ^= 1;
    for (db_mask_byte, salt_byte) in zip(&mut db_mask[salt_index..], &salt) {
        *db_mask_byte ^= salt_byte;
    }
    let mut masked_db = db_mask;

    
    
    
    let bit_diff: u32 = ((8 * em_len) - em_bits).try_into().unwrap();
    
    masked_db[0] &= 0xffu8.checked_shr(bit_diff).unwrap();

    
    let mut em = masked_db;
    em.extend_from_slice(&h);
    em.push(0xbc);

    Ok(em)
}



#[derive(Clone)]
pub struct CryptokiCert {
    
    class: Vec<u8>,
    
    token: Vec<u8>,
    
    
    id: Vec<u8>,
    
    label: Vec<u8>,
    
    value: Vec<u8>,
    
    issuer: Vec<u8>,
    
    serial_number: Vec<u8>,
    
    subject: Vec<u8>,
}

impl CryptokiCert {
    pub fn new(der: Vec<u8>, label: Vec<u8>) -> Result<CryptokiCert, Error> {
        let id = sha2::Sha256::digest(&der).to_vec();
        let (serial_number, issuer, subject) = read_encoded_certificate_identifiers(&der)?;
        Ok(CryptokiCert {
            class: serialize_uint(CKO_CERTIFICATE)?,
            token: serialize_uint(CK_TRUE)?,
            id,
            label,
            value: der,
            issuer,
            serial_number,
            subject,
        })
    }
}

impl CryptokiObject for CryptokiCert {
    fn matches(&self, attrs: &[(CK_ATTRIBUTE_TYPE, Vec<u8>)]) -> bool {
        for (attr_type, attr_value) in attrs {
            let comparison = match *attr_type {
                CKA_CLASS => &self.class,
                CKA_TOKEN => &self.token,
                CKA_LABEL => &self.label,
                CKA_ID => &self.id,
                CKA_VALUE => &self.value,
                CKA_ISSUER => &self.issuer,
                CKA_SERIAL_NUMBER => &self.serial_number,
                CKA_SUBJECT => &self.subject,
                _ => return false,
            };
            if attr_value.as_slice() != comparison {
                return false;
            }
        }
        true
    }

    fn get_attribute(&self, attribute: CK_ATTRIBUTE_TYPE) -> Option<&[u8]> {
        let result = match attribute {
            CKA_CLASS => &self.class,
            CKA_TOKEN => &self.token,
            CKA_LABEL => &self.label,
            CKA_ID => &self.id,
            CKA_VALUE => &self.value,
            CKA_ISSUER => &self.issuer,
            CKA_SERIAL_NUMBER => &self.serial_number,
            CKA_SUBJECT => &self.subject,
            _ => return None,
        };
        Some(result)
    }
}

#[allow(clippy::upper_case_acronyms)]
#[derive(Clone, Copy, Debug)]
pub enum KeyType {
    EC(usize),
    RSA,
}



#[derive(Clone)]
pub struct CryptokiKey {
    
    class: Vec<u8>,
    
    token: Vec<u8>,
    
    
    
    id: Vec<u8>,
    
    
    private: Vec<u8>,
    
    key_type_attribute: Vec<u8>,
    
    modulus: Option<Vec<u8>>,
    
    ec_params: Option<Vec<u8>>,
    
    key_type: KeyType,
}

impl CryptokiKey {
    pub fn new(
        modulus: Option<Vec<u8>>,
        ec_params: Option<Vec<u8>>,
        cert: &[u8],
    ) -> Result<CryptokiKey, Error> {
        let (key_type, key_type_attribute) = if modulus.is_some() {
            (KeyType::RSA, CKK_RSA)
        } else if let Some(ec_params) = ec_params.as_ref() {
            
            let coordinate_width = match ec_params.as_slice() {
                ENCODED_OID_BYTES_SECP256R1 => 32,
                ENCODED_OID_BYTES_SECP384R1 => 48,
                ENCODED_OID_BYTES_SECP521R1 => 66,
                _ => return Err(error_here!(ErrorType::UnsupportedInput)),
            };
            (KeyType::EC(coordinate_width), CKK_EC)
        } else {
            return Err(error_here!(ErrorType::LibraryFailure));
        };
        let id = sha2::Sha256::digest(cert).to_vec();
        Ok(CryptokiKey {
            class: serialize_uint(CKO_PRIVATE_KEY)?,
            token: serialize_uint(CK_TRUE)?,
            id,
            private: serialize_uint(CK_TRUE)?,
            key_type_attribute: serialize_uint(key_type_attribute)?,
            modulus,
            ec_params,
            key_type,
        })
    }

    pub fn modulus(&self) -> &Option<Vec<u8>> {
        &self.modulus
    }

    pub fn ec_params(&self) -> &Option<Vec<u8>> {
        &self.ec_params
    }

    pub fn key_type(&self) -> KeyType {
        self.key_type
    }
}

impl CryptokiObject for CryptokiKey {
    fn matches(&self, attrs: &[(CK_ATTRIBUTE_TYPE, Vec<u8>)]) -> bool {
        for (attr_type, attr_value) in attrs {
            let comparison = match *attr_type {
                CKA_CLASS => &self.class,
                CKA_TOKEN => &self.token,
                CKA_ID => &self.id,
                CKA_PRIVATE => &self.private,
                CKA_KEY_TYPE => &self.key_type_attribute,
                CKA_MODULUS => {
                    if let Some(modulus) = &self.modulus {
                        modulus
                    } else {
                        return false;
                    }
                }
                CKA_EC_PARAMS => {
                    if let Some(ec_params) = &self.ec_params {
                        ec_params
                    } else {
                        return false;
                    }
                }
                _ => return false,
            };
            if attr_value.as_slice() != comparison {
                return false;
            }
        }
        true
    }

    fn get_attribute(&self, attribute: CK_ATTRIBUTE_TYPE) -> Option<&[u8]> {
        match attribute {
            CKA_CLASS => Some(&self.class),
            CKA_TOKEN => Some(&self.token),
            CKA_ID => Some(&self.id),
            CKA_PRIVATE => Some(&self.private),
            CKA_KEY_TYPE => Some(&self.key_type_attribute),
            CKA_MODULUS => match &self.modulus {
                Some(modulus) => Some(modulus.as_slice()),
                None => None,
            },
            CKA_EC_PARAMS => match &self.ec_params {
                Some(ec_params) => Some(ec_params.as_slice()),
                None => None,
            },
            _ => None,
        }
    }
}
