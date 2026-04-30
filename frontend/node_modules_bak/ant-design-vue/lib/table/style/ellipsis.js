"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _style = require("../../style");
const genEllipsisStyle = token => {
  const {
    componentCls
  } = token;
  return {
    [`${componentCls}-wrapper`]: {
      [`${componentCls}-cell-ellipsis`]: (0, _extends2.default)((0, _extends2.default)({}, _style.textEllipsis), {
        wordBreak: 'keep-all',
        // Fixed first or last should special process
        [`
          &${componentCls}-cell-fix-left-last,
          &${componentCls}-cell-fix-right-first
        `]: {
          overflow: 'visible',
          [`${componentCls}-cell-content`]: {
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        },
        [`${componentCls}-column-title`]: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all'
        }
      })
    }
  };
};
var _default = exports.default = genEllipsisStyle;