"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tourStepProps = exports.tourProps = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTour = require("../vc-tour");
const tourProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _vcTour.tourProps)()), {
  steps: {
    type: Array
  },
  prefixCls: {
    type: String
  },
  current: {
    type: Number
  },
  type: {
    type: String
  },
  'onUpdate:current': Function
});
exports.tourProps = tourProps;
const tourStepProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _vcTour.tourStepProps)()), {
  cover: {
    type: Object
  },
  nextButtonProps: {
    type: Object
  },
  prevButtonProps: {
    type: Object
  },
  current: {
    type: Number
  },
  type: {
    type: String
  }
});
exports.tourStepProps = tourStepProps;