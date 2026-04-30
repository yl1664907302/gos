"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
function renderExpandIcon(locale) {
  return function expandIcon(_ref) {
    let {
      prefixCls,
      onExpand,
      record,
      expanded,
      expandable
    } = _ref;
    const iconPrefix = `${prefixCls}-row-expand-icon`;
    return (0, _vue.createVNode)("button", {
      "type": "button",
      "onClick": e => {
        onExpand(record, e);
        e.stopPropagation();
      },
      "class": (0, _classNames.default)(iconPrefix, {
        [`${iconPrefix}-spaced`]: !expandable,
        [`${iconPrefix}-expanded`]: expandable && expanded,
        [`${iconPrefix}-collapsed`]: expandable && !expanded
      }),
      "aria-label": expanded ? locale.collapse : locale.expand,
      "aria-expanded": expanded
    }, null);
  };
}
var _default = exports.default = renderExpandIcon;