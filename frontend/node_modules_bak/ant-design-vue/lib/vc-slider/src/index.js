"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Handle", {
  enumerable: true,
  get: function () {
    return _Handle.default;
  }
});
Object.defineProperty(exports, "Range", {
  enumerable: true,
  get: function () {
    return _Range.default;
  }
});
exports.default = void 0;
var _Slider = _interopRequireDefault(require("./Slider"));
var _Range = _interopRequireDefault(require("./Range"));
var _Handle = _interopRequireDefault(require("./Handle"));
_Slider.default.Range = _Range.default;
_Slider.default.Handle = _Handle.default;
var _default = exports.default = _Slider.default;