








use crate::Error;
use core::{mem::MaybeUninit, num::NonZeroU32};

extern "C" {
    pub fn SOLID_RNG_SampleRandomBytes(buffer: *mut u8, length: usize) -> i32;
}

pub fn getrandom_inner(dest: &mut [MaybeUninit<u8>]) -> Result<(), Error> {
    let ret = unsafe { SOLID_RNG_SampleRandomBytes(dest.as_mut_ptr() as *mut u8, dest.len()) };
    if ret >= 0 {
        Ok(())
    } else {
        
        
        Err(NonZeroU32::new((-ret) as u32).unwrap().into())
    }
}
