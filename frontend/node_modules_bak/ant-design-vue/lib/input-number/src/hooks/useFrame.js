"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _raf = _interopRequireDefault(require("../../../_util/raf"));
var _vue = require("vue");
/**
 * Always trigger latest once when call multiple time
 */
var _default = () => {
  const idRef = (0, _vue.shallowRef)(0);
  const cleanUp = () => {
    _raf.default.cancel(idRef.value);
  };
  (0, _vue.onBeforeUnmount)(() => {
    cleanUp();
  });
  return callback => {
    cleanUp();
    idRef.value = (0, _raf.default)(() => {
      callback();
    });
  };
};
exports.default = _default;