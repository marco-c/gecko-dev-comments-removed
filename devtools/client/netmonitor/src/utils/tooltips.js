



"use strict";







function limitTooltipLength(object) {
  return object.length > 128 ? object.substring(0, 128) + "…" : object;
}

module.exports = {
  limitTooltipLength,
};
