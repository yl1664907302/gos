"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMergedStatus = void 0;
exports.getStatusClassNames = getStatusClassNames;
var _classNames = _interopRequireDefault(require("./classNames"));
const InputStatuses = ['warning', 'error', ''];
function getStatusClassNames(prefixCls, status, hasFeedback) {
  return (0, _classNames.default)({
    [`${prefixCls}-status-success`]: status === 'success',
    [`${prefixCls}-status-warning`]: status === 'warning',
    [`${prefixCls}-status-error`]: status === 'error',
    [`${prefixCls}-status-validating`]: status === 'validating',
    [`${prefixCls}-has-feedback`]: hasFeedback
  });
}
const getMergedStatus = (contextStatus, customStatus) => customStatus || contextStatus;
exports.getMergedStatus = getMergedStatus;