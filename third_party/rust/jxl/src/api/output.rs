




#![allow(unsafe_code)]

use core::slice;
use std::{marker::PhantomData, mem::MaybeUninit, ops::Range};

use num_traits::ToBytes;

use crate::image::Image;

pub struct JxlOutputBuffer<'a> {
    
    
    
    
    
    
    
    
    
    
    buf: *mut MaybeUninit<u8>,
    bytes_per_row: usize,
    num_rows: usize,
    bytes_between_rows: usize,
    _ph: PhantomData<&'a mut u8>,
}

impl<'a> JxlOutputBuffer<'a> {
    fn check_vals(num_rows: usize, bytes_per_row: usize, bytes_between_rows: usize) {
        assert!(num_rows > 0);
        assert!(bytes_per_row > 0);
        assert!(bytes_between_rows >= bytes_per_row);
        assert!(
            bytes_between_rows
                .checked_mul(num_rows - 1)
                .unwrap()
                .checked_add(bytes_per_row)
                .unwrap()
                <= isize::MAX as usize
        );
    }

    
    
    
    
    
    
    
    
    
    pub unsafe fn new_from_ptr(
        buf: *mut MaybeUninit<u8>,
        num_rows: usize,
        bytes_per_row: usize,
        bytes_between_rows: usize,
    ) -> Self {
        Self::check_vals(num_rows, bytes_per_row, bytes_between_rows);
        
        
        Self {
            buf,
            bytes_per_row,
            bytes_between_rows,
            num_rows,
            _ph: PhantomData,
        }
    }

    pub fn new(buf: &'a mut [u8], num_rows: usize, bytes_per_row: usize) -> Self {
        Self::new_uninit(
            
            
            unsafe { slice::from_raw_parts_mut(buf.as_mut_ptr().cast(), buf.len()) },
            num_rows,
            bytes_per_row,
        )
    }

    
    
    pub fn new_uninit(
        buf: &'a mut [MaybeUninit<u8>],
        num_rows: usize,
        bytes_per_row: usize,
    ) -> Self {
        Self::check_vals(num_rows, bytes_per_row, bytes_per_row);
        assert!(buf.len() >= bytes_per_row * num_rows);
        
        
        Self {
            buf: buf.as_mut_ptr(),
            bytes_per_row,
            bytes_between_rows: bytes_per_row,
            num_rows,
            _ph: PhantomData,
        }
    }

    
    
    pub unsafe fn get(&mut self, row: usize, cols: Range<usize>) -> &mut [MaybeUninit<u8>] {
        assert!(row < self.num_rows);
        assert!(cols.start <= cols.end);
        assert!(cols.end <= self.bytes_per_row);
        let start = row * self.bytes_between_rows + cols.start;
        
        
        
        
        let start = unsafe { self.buf.add(start) };
        
        
        
        
        
        unsafe { slice::from_raw_parts_mut(start, cols.len()) }
    }

    
    
    pub(super) fn write_from_rgb_f32(&mut self, r: &Image<f32>, g: &Image<f32>, b: &Image<f32>) {
        assert_eq!(r.size(), g.size());
        assert_eq!(r.size(), b.size());
        assert_eq!(self.bytes_per_row, r.size().0 * 12);
        let (xsize, ysize) = r.size();
        assert_eq!(ysize, self.num_rows);
        for y in 0..ysize {
            let rrow = r.as_rect().row(y);
            let grow = g.as_rect().row(y);
            let brow = b.as_rect().row(y);
            
            let row = unsafe { self.get(y, 0..12 * xsize) };
            let rgb = rrow
                .iter()
                .zip(grow.iter().zip(brow.iter()))
                .map(|(r, (g, b))| {
                    let mut arr = [0; 12];
                    arr[0..4].copy_from_slice(&r.to_ne_bytes());
                    arr[4..8].copy_from_slice(&g.to_ne_bytes());
                    arr[8..12].copy_from_slice(&b.to_ne_bytes());
                    arr
                });
            for (out, rgb) in row.chunks_exact_mut(12).zip(rgb) {
                for i in 0..12 {
                    out[i].write(rgb[i]);
                }
            }
        }
    }

    pub(super) fn write_from_f32(&mut self, c: &Image<f32>) {
        assert_eq!(self.bytes_per_row, c.size().0 * 4);
        let (xsize, ysize) = c.size();
        assert_eq!(ysize, self.num_rows);
        for y in 0..ysize {
            let crow = c.as_rect().row(y);
            
            let row = unsafe { self.get(y, 0..4 * xsize) };
            for (out, v) in row.chunks_exact_mut(4).zip(crow) {
                let v = v.to_ne_bytes();
                for i in 0..4 {
                    out[i].write(v[i]);
                }
            }
        }
    }
}
