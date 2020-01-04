


"use strict";

const { actions } = require("../constants");
const { refresh } = require("./refresh");

const toggleInverted = exports.toggleInverted = function () {
  return { type: actions.TOGGLE_INVERTED };
};

exports.toggleInvertedAndRefresh = function (heapWorker) {
  return function* (dispatch, getState) {
    dispatch(toggleInverted());
    yield dispatch(refresh(heapWorker));
  };
};
