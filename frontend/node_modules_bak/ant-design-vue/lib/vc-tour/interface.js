"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tourStepProps = exports.tourStepInfo = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _type = require("../_util/type");
const tourStepInfo = () => ({
  arrow: (0, _type.someType)([Boolean, Object]),
  target: (0, _type.someType)([String, Function, Object]),
  title: (0, _type.someType)([String, Object]),
  description: (0, _type.someType)([String, Object]),
  placement: (0, _type.stringType)(),
  mask: (0, _type.someType)([Object, Boolean], true),
  className: {
    type: String
  },
  style: (0, _type.objectType)(),
  scrollIntoViewOptions: (0, _type.someType)([Boolean, Object])
});
exports.tourStepInfo = tourStepInfo;
const tourStepProps = () => (0, _extends2.default)((0, _extends2.default)({}, tourStepInfo()), {
  prefixCls: {
    type: String
  },
  total: {
    type: Number
  },
  current: {
    type: Number
  },
  onClose: (0, _type.functionType)(),
  onFinish: (0, _type.functionType)(),
  renderPanel: (0, _type.functionType)(),
  onPrev: (0, _type.functionType)(),
  onNext: (0, _type.functionType)()
});
exports.tourStepProps = tourStepProps;