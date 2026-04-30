"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
function notEmpty(val) {
  return val !== undefined && val !== null;
}
const Cell = props => {
  const {
    itemPrefixCls,
    component,
    span,
    labelStyle,
    contentStyle,
    bordered,
    label,
    content,
    colon
  } = props;
  const Component = component;
  if (bordered) {
    return (0, _vue.createVNode)(Component, {
      "class": [{
        [`${itemPrefixCls}-item-label`]: notEmpty(label),
        [`${itemPrefixCls}-item-content`]: notEmpty(content)
      }],
      "colSpan": span
    }, {
      default: () => [notEmpty(label) && (0, _vue.createVNode)("span", {
        "style": labelStyle
      }, [label]), notEmpty(content) && (0, _vue.createVNode)("span", {
        "style": contentStyle
      }, [content])]
    });
  }
  return (0, _vue.createVNode)(Component, {
    "class": [`${itemPrefixCls}-item`],
    "colSpan": span
  }, {
    default: () => [(0, _vue.createVNode)("div", {
      "class": `${itemPrefixCls}-item-container`
    }, [(label || label === 0) && (0, _vue.createVNode)("span", {
      "class": [`${itemPrefixCls}-item-label`, {
        [`${itemPrefixCls}-item-no-colon`]: !colon
      }],
      "style": labelStyle
    }, [label]), (content || content === 0) && (0, _vue.createVNode)("span", {
      "class": `${itemPrefixCls}-item-content`,
      "style": contentStyle
    }, [content])])]
  });
};
var _default = exports.default = Cell;