




#![allow(unused_imports)]

#[cfg(feature = "tracing")]
mod private {
    pub use tracing::{debug, error, info, instrument, trace, warn};
}

#[cfg(not(feature = "tracing"))]
mod private {
    macro_rules! fake_log {
        ($($_: tt)*) => {};
    }
    pub(crate) use fake_log as debug;
    pub(crate) use fake_log as error;
    pub(crate) use fake_log as info;
    pub(crate) use fake_log as trace;
    pub(crate) use fake_log as warn;
    pub use jxl_macros::noop as instrument;
}

pub use private::*;
