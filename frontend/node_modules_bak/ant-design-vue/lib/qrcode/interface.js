"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.qrcodeProps = exports.qrProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _type = require("../_util/type");
const qrProps = () => {
  return {
    size: {
      type: Number,
      default: 160
    },
    value: {
      type: String,
      required: true
    },
    type: (0, _type.stringType)('canvas'),
    color: String,
    bgColor: String,
    includeMargin: Boolean,
    imageSettings: (0, _type.objectType)()
  };
};
exports.qrProps = qrProps;
const qrcodeProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, qrProps()), {
    errorLevel: (0, _type.stringType)('M'),
    icon: String,
    iconSize: {
      type: Number,
      default: 40
    },
    status: (0, _type.stringType)('active'),
    bordered: {
      type: Boolean,
      default: true
    }
  });
};
exports.qrcodeProps = qrcodeProps;