




use std::io::{BufRead, BufReader, Error, IoSliceMut, Read, Seek, SeekFrom};

pub trait JxlBitstreamInput {
    
    
    
    fn available_bytes(&mut self) -> Result<usize, Error>;

    
    
    fn read(&mut self, bufs: &mut [IoSliceMut]) -> Result<usize, Error>;

    
    
    
    
    fn skip(&mut self, bytes: usize) -> Result<usize, Error> {
        let mut bytes = bytes;
        const BUF_SIZE: usize = 1024;
        let mut skip_buf = [0; BUF_SIZE];
        let mut skipped = 0;
        while bytes > 0 {
            let num = bytes.min(BUF_SIZE);
            self.read(&mut [IoSliceMut::new(&mut skip_buf[..num])])?;
            bytes -= num;
            skipped += num;
        }
        Ok(skipped)
    }

    
    
    
    
    fn unconsume(&mut self, _count: usize) -> Result<(), Error> {
        Ok(())
    }
}

impl JxlBitstreamInput for &[u8] {
    fn available_bytes(&mut self) -> Result<usize, Error> {
        Ok(self.len())
    }

    fn read(&mut self, bufs: &mut [IoSliceMut]) -> Result<usize, Error> {
        self.read_vectored(bufs)
    }

    fn skip(&mut self, bytes: usize) -> Result<usize, Error> {
        let num = bytes.min(self.len());
        self.consume(num);
        Ok(num)
    }
}

impl<R: Read + Seek> JxlBitstreamInput for BufReader<R> {
    fn available_bytes(&mut self) -> Result<usize, Error> {
        let pos = self.stream_position()?;
        let end = self.seek(SeekFrom::End(0))?;
        self.seek(SeekFrom::Start(pos))?;
        Ok(end.saturating_sub(pos) as usize)
    }

    fn read(&mut self, bufs: &mut [IoSliceMut]) -> Result<usize, Error> {
        self.read_vectored(bufs)
    }

    fn skip(&mut self, bytes: usize) -> Result<usize, Error> {
        let cur = self.stream_position()?;
        self.seek(SeekFrom::Current(bytes as i64))
            .map(|x| x.saturating_sub(cur) as usize)
    }

    fn unconsume(&mut self, count: usize) -> Result<(), Error> {
        self.seek_relative(-(count as i64))
    }
}
