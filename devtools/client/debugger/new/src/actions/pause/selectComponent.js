"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectComponent = selectComponent;




function selectComponent(componentIndex) {
  return async ({
    dispatch
  }) => {
    dispatch({
      type: "SELECT_COMPONENT",
      componentIndex
    });
  };
}