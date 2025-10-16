
















































































































































































































































































#![cfg_attr(feature = "nightly", feature(proc_macro_diagnostic))]
#![forbid(unsafe_code)]

extern crate proc_macro;

pub use crate::{
    diagnostic::{Diagnostic, DiagnosticExt, Level},
    dummy::{append_dummy, set_dummy},
};
pub use proc_macro_error_attr2::proc_macro_error;

use proc_macro2::Span;
use quote::{quote, ToTokens};

use std::cell::Cell;
use std::panic::{catch_unwind, resume_unwind, UnwindSafe};

pub mod dummy;

mod diagnostic;
mod macros;
mod sealed;

#[cfg(not(feature = "nightly"))]
#[path = "imp/fallback.rs"]
mod imp;

#[cfg(feature = "nightly")]
#[path = "imp/delegate.rs"]
mod imp;

#[derive(Debug, Clone, Copy)]
#[must_use = "A SpanRange does nothing unless used"]
pub struct SpanRange {
    pub first: Span,
    pub last: Span,
}

impl SpanRange {
    
    pub fn single_span(span: Span) -> Self {
        SpanRange {
            first: span,
            last: span,
        }
    }

    
    pub fn call_site() -> Self {
        SpanRange::single_span(Span::call_site())
    }

    
    
    
    
    
    
    
    
    pub fn from_tokens(ts: &dyn ToTokens) -> Self {
        let mut spans = ts.to_token_stream().into_iter().map(|tt| tt.span());
        let first = spans.next().unwrap_or_else(Span::call_site);
        let last = spans.last().unwrap_or(first);

        SpanRange { first, last }
    }

    
    
    pub fn join_range(self, other: SpanRange) -> Self {
        SpanRange {
            first: self.first,
            last: other.last,
        }
    }

    
    #[must_use]
    pub fn collapse(self) -> Span {
        self.first.join(self.last).unwrap_or(self.first)
    }
}


pub trait ResultExt {
    type Ok;

    
    
    fn unwrap_or_abort(self) -> Self::Ok;

    
    
    
    fn expect_or_abort(self, msg: &str) -> Self::Ok;
}


pub trait OptionExt {
    type Some;

    
    
    
    
    
    fn expect_or_abort(self, msg: &str) -> Self::Some;
}




pub fn abort_if_dirty() {
    imp::abort_if_dirty();
}

impl<T, E: Into<Diagnostic>> ResultExt for Result<T, E> {
    type Ok = T;

    fn unwrap_or_abort(self) -> T {
        match self {
            Ok(res) => res,
            Err(e) => e.into().abort(),
        }
    }

    fn expect_or_abort(self, message: &str) -> T {
        match self {
            Ok(res) => res,
            Err(e) => {
                let mut e = e.into();
                e.msg = format!("{}: {}", message, e.msg);
                e.abort()
            }
        }
    }
}

impl<T> OptionExt for Option<T> {
    type Some = T;

    fn expect_or_abort(self, message: &str) -> T {
        match self {
            Some(res) => res,
            None => abort_call_site!(message),
        }
    }
}




#[doc(hidden)]
pub fn entry_point<F>(f: F, proc_macro_hack: bool) -> proc_macro::TokenStream
where
    F: FnOnce() -> proc_macro::TokenStream + UnwindSafe,
{
    ENTERED_ENTRY_POINT.with(|flag| flag.set(flag.get() + 1));
    let caught = catch_unwind(f);
    let dummy = dummy::cleanup();
    let err_storage = imp::cleanup();
    ENTERED_ENTRY_POINT.with(|flag| flag.set(flag.get() - 1));

    let gen_error = || {
        if proc_macro_hack {
            quote! {{
                macro_rules! proc_macro_call {
                    () => ( unimplemented!() )
                }

                #(#err_storage)*
                #dummy

                unimplemented!()
            }}
        } else {
            quote!( #(#err_storage)* #dummy )
        }
    };

    match caught {
        Ok(ts) => {
            if err_storage.is_empty() {
                ts
            } else {
                gen_error().into()
            }
        }

        Err(boxed) => match boxed.downcast::<AbortNow>() {
            Ok(_) => gen_error().into(),
            Err(boxed) => resume_unwind(boxed),
        },
    }
}

fn abort_now() -> ! {
    check_correctness();
    std::panic::panic_any(AbortNow)
}

thread_local! {
    static ENTERED_ENTRY_POINT: Cell<usize> = const { Cell::new(0) };
}

struct AbortNow;

fn check_correctness() {
    assert!(
        ENTERED_ENTRY_POINT.with(Cell::get) != 0,
        "proc-macro-error2 API cannot be used outside of `entry_point` invocation, \
             perhaps you forgot to annotate your #[proc_macro] function with `#[proc_macro_error]"
    );
}


#[doc(hidden)]
pub mod __export {
    
    pub use proc_macro;
    pub use proc_macro2;

    use proc_macro2::Span;
    use quote::ToTokens;

    use crate::SpanRange;

    
    

    pub trait SpanAsSpanRange {
        #[allow(non_snake_case)]
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange;
    }

    pub trait Span2AsSpanRange {
        #[allow(non_snake_case)]
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange;
    }

    pub trait ToTokensAsSpanRange {
        #[allow(non_snake_case)]
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange;
    }

    pub trait SpanRangeAsSpanRange {
        #[allow(non_snake_case)]
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange;
    }

    impl<T: ToTokens> ToTokensAsSpanRange for &T {
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange {
            let mut ts = self.to_token_stream().into_iter();
            let first = match ts.next() {
                Some(t) => t.span(),
                None => Span::call_site(),
            };

            let last = match ts.last() {
                Some(t) => t.span(),
                None => first,
            };

            SpanRange { first, last }
        }
    }

    impl Span2AsSpanRange for Span {
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange {
            SpanRange {
                first: *self,
                last: *self,
            }
        }
    }

    impl SpanAsSpanRange for proc_macro::Span {
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange {
            SpanRange {
                first: (*self).into(),
                last: (*self).into(),
            }
        }
    }

    impl SpanRangeAsSpanRange for SpanRange {
        fn FIRST_ARG_MUST_EITHER_BE_Span_OR_IMPLEMENT_ToTokens_OR_BE_SpanRange(&self) -> SpanRange {
            *self
        }
    }
}
