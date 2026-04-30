"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAllChildrenKeys = findAllChildrenKeys;
exports.renderExpandIcon = renderExpandIcon;
var _vue = require("vue");
function renderExpandIcon(_ref) {
  let {
    prefixCls,
    record,
    onExpand,
    expanded,
    expandable
  } = _ref;
  const expandClassName = `${prefixCls}-row-expand-icon`;
  if (!expandable) {
    return (0, _vue.createVNode)("span", {
      "class": [expandClassName, `${prefixCls}-row-spaced`]
    }, null);
  }
  const onClick = event => {
    onExpand(record, event);
    event.stopPropagation();
  };
  return (0, _vue.createVNode)("span", {
    "class": {
      [expandClassName]: true,
      [`${prefixCls}-row-expanded`]: expanded,
      [`${prefixCls}-row-collapsed`]: !expanded
    },
    "onClick": onClick
  }, null);
}
function findAllChildrenKeys(data, getRowKey, childrenColumnName) {
  const keys = [];
  function dig(list) {
    (list || []).forEach((item, index) => {
      keys.push(getRowKey(item, index));
      dig(item[childrenColumnName]);
    });
  }
  dig(data);
  return keys;
}