














use super::{
    BinaryReader, BinaryReaderError, InitExpr, Result, SectionIteratorLimited, SectionReader,
    SectionWithLimitedItems, Type,
};

#[derive(Debug, Copy, Clone)]
pub struct Element<'a> {
    pub kind: ElementKind<'a>,
    pub items: ElementItems<'a>,
}

#[derive(Debug, Copy, Clone)]
pub enum ElementKind<'a> {
    Passive(Type),
    Active {
        table_index: u32,
        init_expr: InitExpr<'a>,
    },
}

#[derive(Debug, Copy, Clone)]
pub struct ElementItems<'a> {
    offset: usize,
    data: &'a [u8],
}

impl<'a> ElementItems<'a> {
    pub fn get_items_reader<'b>(&self) -> Result<ElementItemsReader<'b>>
    where
        'a: 'b,
    {
        ElementItemsReader::new(self.data, self.offset)
    }
}

pub struct ElementItemsReader<'a> {
    reader: BinaryReader<'a>,
    count: u32,
}

impl<'a> ElementItemsReader<'a> {
    pub fn new(data: &[u8], offset: usize) -> Result<ElementItemsReader> {
        let mut reader = BinaryReader::new_with_offset(data, offset);
        let count = reader.read_var_u32()?;
        Ok(ElementItemsReader { reader, count })
    }

    pub fn original_position(&self) -> usize {
        self.reader.original_position()
    }

    pub fn get_count(&self) -> u32 {
        self.count
    }

    pub fn read(&mut self) -> Result<u32> {
        self.reader.read_var_u32()
    }
}

impl<'a> IntoIterator for ElementItemsReader<'a> {
    type Item = Result<u32>;
    type IntoIter = ElementItemsIterator<'a>;
    fn into_iter(self) -> Self::IntoIter {
        let count = self.count;
        ElementItemsIterator {
            reader: self,
            left: count,
            err: false,
        }
    }
}

pub struct ElementItemsIterator<'a> {
    reader: ElementItemsReader<'a>,
    left: u32,
    err: bool,
}

impl<'a> Iterator for ElementItemsIterator<'a> {
    type Item = Result<u32>;
    fn next(&mut self) -> Option<Self::Item> {
        if self.err || self.left == 0 {
            return None;
        }
        let result = self.reader.read();
        self.err = result.is_err();
        self.left -= 1;
        Some(result)
    }
    fn size_hint(&self) -> (usize, Option<usize>) {
        let count = self.reader.get_count() as usize;
        (count, Some(count))
    }
}

pub struct ElementSectionReader<'a> {
    reader: BinaryReader<'a>,
    count: u32,
}

impl<'a> ElementSectionReader<'a> {
    pub fn new(data: &'a [u8], offset: usize) -> Result<ElementSectionReader<'a>> {
        let mut reader = BinaryReader::new_with_offset(data, offset);
        let count = reader.read_var_u32()?;
        Ok(ElementSectionReader { reader, count })
    }

    pub fn original_position(&self) -> usize {
        self.reader.original_position()
    }

    pub fn get_count(&self) -> u32 {
        self.count
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    pub fn read<'b>(&mut self) -> Result<Element<'b>>
    where
        'a: 'b,
    {
        let flags = self.reader.read_var_u32()?;
        let kind = if flags == 1 {
            let ty = self.reader.read_type()?;
            ElementKind::Passive(ty)
        } else {
            let table_index = match flags {
                0 => 0,
                2 => self.reader.read_var_u32()?,
                _ => {
                    return Err(BinaryReaderError {
                        message: "invalid flags byte in element segment",
                        offset: self.reader.original_position() - 1,
                    });
                }
            };
            let init_expr = {
                let expr_offset = self.reader.position;
                self.reader.skip_init_expr()?;
                let data = &self.reader.buffer[expr_offset..self.reader.position];
                InitExpr::new(data, self.reader.original_offset + expr_offset)
            };
            ElementKind::Active {
                table_index,
                init_expr,
            }
        };
        let data_start = self.reader.position;
        let items_count = self.reader.read_var_u32()?;
        for _ in 0..items_count {
            self.reader.skip_var_32()?;
        }
        let data_end = self.reader.position;
        let items = ElementItems {
            offset: self.reader.original_offset + data_start,
            data: &self.reader.buffer[data_start..data_end],
        };
        Ok(Element { kind, items })
    }
}

impl<'a> SectionReader for ElementSectionReader<'a> {
    type Item = Element<'a>;
    fn read(&mut self) -> Result<Self::Item> {
        ElementSectionReader::read(self)
    }
    fn eof(&self) -> bool {
        self.reader.eof()
    }
    fn original_position(&self) -> usize {
        ElementSectionReader::original_position(self)
    }
}

impl<'a> SectionWithLimitedItems for ElementSectionReader<'a> {
    fn get_count(&self) -> u32 {
        ElementSectionReader::get_count(self)
    }
}

impl<'a> IntoIterator for ElementSectionReader<'a> {
    type Item = Result<Element<'a>>;
    type IntoIter = SectionIteratorLimited<ElementSectionReader<'a>>;

    fn into_iter(self) -> Self::IntoIter {
        SectionIteratorLimited::new(self)
    }
}
