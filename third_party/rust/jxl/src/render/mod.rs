




use internal::RenderPipelineStageInfo;
use std::{any::Any, marker::PhantomData};

use crate::{
    api::JxlOutputBuffer,
    error::Result,
    image::{Image, ImageDataType},
};

mod internal;
mod simple_pipeline;
pub mod stages;
#[cfg(test)]
mod test;

pub use simple_pipeline::{
    SimpleRenderPipeline, SimpleRenderPipelineBuilder,
    save::{SaveStage, SaveStageType},
};




pub struct RenderPipelineInPlaceStage<T: ImageDataType> {
    _phantom: PhantomData<T>,
}















pub struct RenderPipelineInOutStage<
    InputT: ImageDataType,
    OutputT: ImageDataType,
    const BORDER_X: u8,
    const BORDER_Y: u8,
    const SHIFT_X: u8,
    const SHIFT_Y: u8,
> {
    _phantom: PhantomData<(InputT, OutputT)>,
}









pub struct RenderPipelineExtendStage<T: ImageDataType> {
    _phantom: PhantomData<T>,
}


pub trait RenderPipelineStage: Any + std::fmt::Display {
    type Type: RenderPipelineStageInfo;

    
    
    fn uses_channel(&self, c: usize) -> bool;

    
    
    fn process_row_chunk(
        &self,
        position: (usize, usize),
        xsize: usize,
        
        row: &mut [<Self::Type as RenderPipelineStageInfo>::RowType<'_>],
        state: Option<&mut dyn Any>,
    );

    
    
    fn new_size(&self, current_size: (usize, usize)) -> (usize, usize) {
        current_size
    }

    
    
    fn original_data_origin(&self) -> (isize, isize) {
        (0, 0)
    }

    
    
    
    
    fn init_local_state(&self) -> Result<Option<Box<dyn Any>>> {
        Ok(None)
    }
}

pub trait RenderPipelineBuilder: Sized {
    type RenderPipeline: RenderPipeline;
    fn new(
        num_channels: usize,
        size: (usize, usize),
        downsampling_shift: usize,
        log_group_size: usize,
    ) -> Self;
    fn add_stage<Stage: RenderPipelineStage>(self, stage: Stage) -> Result<Self>;
    fn add_save_stage<T: ImageDataType>(self, stage: SaveStage<T>) -> Result<Self>;
    fn build(self) -> Result<Self::RenderPipeline>;
}

pub trait RenderPipeline {
    type Builder: RenderPipelineBuilder<RenderPipeline = Self>;

    
    
    
    fn get_buffer_for_group<T: ImageDataType>(
        &mut self,
        channel: usize,
        group_id: usize,
    ) -> Result<Image<T>>;

    
    
    
    fn set_buffer_for_group<T: ImageDataType>(
        &mut self,
        channel: usize,
        group_id: usize,
        num_passes: usize,
        buf: Image<T>,
    );

    
    fn do_render(&mut self, buffers: &mut [Option<JxlOutputBuffer>]) -> Result<()>;

    fn into_stages(self) -> Vec<Box<dyn Any>>;
    fn num_groups(&self) -> usize;
}
