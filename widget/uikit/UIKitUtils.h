




#ifndef mozilla_widget_UIKitUtils_h__
#define mozilla_widget_UIKitUtils_h__

#import <UIKit/UIKit.h>

#include "IMEData.h"

namespace mozilla::widget {

class UIKitUtils final {
 public:
  UIKitUtils() = delete;
  ~UIKitUtils() = delete;

  static UIKeyboardType GetUIKeyboardType(const InputContext& aContext);
  static UIReturnKeyType GetUIReturnKeyType(const InputContext& aContext);
  static UITextAutocapitalizationType GetUITextAutocapitalizationType(
      const InputContext& aContext);
  static UITextAutocorrectionType GetUITextAutocorrectionType(
      const InputContext& aContext);
};

}  

#endif
