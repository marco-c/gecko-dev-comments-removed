




#include "ScaledFontCairo.h"
#include "Logging.h"

#if defined(USE_SKIA) && defined(MOZ_ENABLE_FREETYPE)
#include "skia/include/ports/SkTypeface_cairo.h"
#endif

namespace mozilla {
namespace gfx {





ScaledFontCairo::ScaledFontCairo(cairo_scaled_font_t* aScaledFont, Float aSize)
  : ScaledFontBase(aSize)
{ 
  SetCairoScaledFont(aScaledFont);
}

#if defined(USE_SKIA) && defined(MOZ_ENABLE_FREETYPE)
SkTypeface* ScaledFontCairo::GetSkTypeface()
{
  if (!mTypeface) {
    mTypeface = SkCreateTypefaceFromCairoFTFont(mScaledFont);
  }

  return mTypeface;
}
#endif

} 
} 
