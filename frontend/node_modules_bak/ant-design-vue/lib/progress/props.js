"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.progressStatuses = exports.progressProps = void 0;
var _type = require("../_util/type");
const progressStatuses = exports.progressStatuses = ['normal', 'exception', 'active', 'success'];
const ProgressType = ['line', 'circle', 'dashboard'];
const ProgressSize = ['default', 'small'];
const progressProps = () => ({
  prefixCls: String,
  type: (0, _type.stringType)(),
  percent: Number,
  format: (0, _type.functionType)(),
  status: (0, _type.stringType)(),
  showInfo: (0, _type.booleanType)(),
  strokeWidth: Number,
  strokeLinecap: (0, _type.stringType)(),
  strokeColor: (0, _type.anyType)(),
  trailColor: String,
  /** @deprecated Use `size` instead */
  width: Number,
  success: (0, _type.objectType)(),
  gapDegree: Number,
  gapPosition: (0, _type.stringType)(),
  size: (0, _type.someType)([String, Number, Array]),
  steps: Number,
  /** @deprecated Use `success` instead */
  successPercent: Number,
  title: String,
  progressStatus: (0, _type.stringType)()
});
exports.progressProps = progressProps;