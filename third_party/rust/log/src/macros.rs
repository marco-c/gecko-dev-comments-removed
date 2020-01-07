






























#[macro_export]
macro_rules! log {
    (target: $target:expr, $lvl:expr, $($arg:tt)+) => ({
        let lvl = $lvl;
        if lvl <= $crate::STATIC_MAX_LEVEL && lvl <= $crate::max_level() {
            $crate::Log::log(
                $crate::logger(),
                &$crate::RecordBuilder::new()
                    .args(format_args!($($arg)+))
                    .level(lvl)
                    .target($target)
                    .module_path(Some(module_path!()))
                    .file(Some(file!()))
                    .line(Some(line!()))
                    .build()
            )
        }
    });
    ($lvl:expr, $($arg:tt)+) => (log!(target: module_path!(), $lvl, $($arg)+))
}















#[macro_export]
macro_rules! error {
    (target: $target:expr, $($arg:tt)*) => (
        log!(target: $target, $crate::Level::Error, $($arg)*);
    );
    ($($arg:tt)*) => (
        log!($crate::Level::Error, $($arg)*);
    )
}















#[macro_export]
macro_rules! warn {
    (target: $target:expr, $($arg:tt)*) => (
        log!(target: $target, $crate::Level::Warn, $($arg)*);
    );
    ($($arg:tt)*) => (
        log!($crate::Level::Warn, $($arg)*);
    )
}

















#[macro_export]
macro_rules! info {
    (target: $target:expr, $($arg:tt)*) => (
        log!(target: $target, $crate::Level::Info, $($arg)*);
    );
    ($($arg:tt)*) => (
        log!($crate::Level::Info, $($arg)*);
    )
}
















#[macro_export]
macro_rules! debug {
    (target: $target:expr, $($arg:tt)*) => (
        log!(target: $target, $crate::Level::Debug, $($arg)*);
    );
    ($($arg:tt)*) => (
        log!($crate::Level::Debug, $($arg)*);
    )
}


















#[macro_export]
macro_rules! trace {
    (target: $target:expr, $($arg:tt)*) => (
        log!(target: $target, $crate::Level::Trace, $($arg)*);
    );
    ($($arg:tt)*) => (
        log!($crate::Level::Trace, $($arg)*);
    )
}




























#[macro_export]
macro_rules! log_enabled {
    (target: $target:expr, $lvl:expr) => ({
        let lvl = $lvl;
        lvl <= $crate::STATIC_MAX_LEVEL && lvl <= $crate::max_level() &&
            $crate::Log::enabled(
                $crate::logger(),
                &$crate::MetadataBuilder::new()
                    .level(lvl)
                    .target($target)
                    .build(),
            )
    });
    ($lvl:expr) => (log_enabled!(target: module_path!(), $lvl))
}
