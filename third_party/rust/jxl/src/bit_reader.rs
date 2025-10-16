




use std::fmt::Debug;

use crate::{error::Error, util::tracing_wrappers::*};
use byteorder::{ByteOrder, LittleEndian};


#[derive(Clone)]
pub struct BitReader<'a> {
    data: &'a [u8],
    bit_buf: u64,
    bits_in_buf: usize,
    total_bits_read: usize,
}

impl Debug for BitReader<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "BitReader{{ data: [{} bytes], bit_buf: {:0width$b}, total_bits_read: {} }}",
            self.data.len(),
            self.bit_buf,
            self.total_bits_read,
            width = self.bits_in_buf
        )
    }
}

pub const MAX_BITS_PER_CALL: usize = 56;

impl<'a> BitReader<'a> {
    
    pub fn new(data: &[u8]) -> BitReader<'_> {
        BitReader {
            data,
            bit_buf: 0,
            bits_in_buf: 0,
            total_bits_read: 0,
        }
    }

    
    pub fn peek(&mut self, num: usize) -> u64 {
        debug_assert!(num <= MAX_BITS_PER_CALL);
        self.refill();
        self.bit_buf & ((1u64 << num) - 1)
    }

    
    pub fn consume(&mut self, num: usize) -> Result<(), Error> {
        if self.bits_in_buf < num {
            return Err(Error::OutOfBounds((num - self.bits_in_buf).div_ceil(8)));
        }
        self.bit_buf >>= num;
        self.bits_in_buf -= num;
        self.total_bits_read = self.total_bits_read.wrapping_add(num);
        Ok(())
    }

    
    
    
    
    
    
    
    
    
    
    
    pub fn read(&mut self, num: usize) -> Result<u64, Error> {
        let ret = self.peek(num);
        self.consume(num)?;
        Ok(ret)
    }

    
    pub fn total_bits_read(&self) -> usize {
        self.total_bits_read
    }

    
    pub fn total_bits_available(&self) -> usize {
        self.data.len() * 8 + self.bits_in_buf
    }

    
    
    
    
    
    
    
    
    
    #[inline(never)]
    pub fn skip_bits(&mut self, mut n: usize) -> Result<(), Error> {
        
        if let Some(next_remaining_bits) = self.bits_in_buf.checked_sub(n) {
            self.total_bits_read += n;
            self.bits_in_buf = next_remaining_bits;
            self.bit_buf >>= n;
            return Ok(());
        }

        
        n -= self.bits_in_buf;
        self.total_bits_read += self.bits_in_buf;
        self.bit_buf = 0;
        self.bits_in_buf = 0;

        
        let bits_available = self.data.len() * 8;
        if n > bits_available {
            self.total_bits_read += bits_available;
            return Err(Error::OutOfBounds(n - bits_available));
        }

        
        self.total_bits_read += n / 8 * 8;
        self.data = &self.data[n / 8..];
        n %= 8;

        
        self.refill();
        let to_consume = self.bits_in_buf.min(n);
        
        
        
        
        self.total_bits_read += to_consume;
        n -= to_consume;
        self.bit_buf >>= to_consume;
        self.bits_in_buf -= to_consume;
        if n > 0 {
            Err(Error::OutOfBounds(n))
        } else {
            Ok(())
        }
    }

    
    pub fn bits_to_next_byte(&self) -> usize {
        let byte_boundary = self.total_bits_read.div_ceil(8) * 8;
        byte_boundary - self.total_bits_read
    }

    
    
    
    
    
    
    
    
    
    
    #[inline(never)]
    pub fn jump_to_byte_boundary(&mut self) -> Result<(), Error> {
        if self.read(self.bits_to_next_byte())? != 0 {
            return Err(Error::NonZeroPadding);
        }
        Ok(())
    }

    fn refill(&mut self) {
        
        if self.data.len() >= 8 {
            let bits = LittleEndian::read_u64(self.data);
            self.bit_buf |= bits << self.bits_in_buf;
            let read_bytes = (63 - self.bits_in_buf) >> 3;
            self.bits_in_buf |= 56;
            self.data = &self.data[read_bytes..];
            debug_assert!(56 <= self.bits_in_buf && self.bits_in_buf < 64);
        } else {
            self.refill_slow()
        }
    }

    #[inline(never)]
    fn refill_slow(&mut self) {
        while self.bits_in_buf < 56 {
            if self.data.is_empty() {
                return;
            }
            self.bit_buf |= (self.data[0] as u64) << self.bits_in_buf;
            self.bits_in_buf += 8;
            self.data = &self.data[1..];
        }
    }

    
    
    
    pub fn split_at(&mut self, n: usize) -> Result<BitReader<'a>, Error> {
        self.jump_to_byte_boundary()?;
        let mut ret = Self { ..*self };
        self.skip_bits(n * 8)?;
        let bytes_in_buf = ret.bits_in_buf / 8;
        if n > bytes_in_buf {
            
            ret.data = &ret.data[..n - bytes_in_buf];
        } else {
            ret.bits_in_buf = n * 8;
            ret.bit_buf &= (1u64 << (n * 8)) - 1;
            ret.data = &[];
        }
        debug!(?n, ret=?ret);
        Ok(ret)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_skip_bits_on_fresh_reader() {
        
        let data = [0x12, 0x34, 0x56, 0x78];
        let mut br = BitReader::new(&data);

        
        br.skip_bits(1)
            .expect("skip_bits should work on fresh reader");
        assert_eq!(br.total_bits_read(), 1);

        
        let val = br.read(7).expect("read should work");
        assert_eq!(val, 0x12 >> 1); 
    }
}
