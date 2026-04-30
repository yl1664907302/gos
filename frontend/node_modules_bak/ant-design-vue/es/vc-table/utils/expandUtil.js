import { createVNode as _createVNode } from "vue";
export function renderExpandIcon(_ref) {
  let {
    prefixCls,
    record,
    onExpand,
    expanded,
    expandable
  } = _ref;
  const expandClassName = `${prefixCls}-row-expand-icon`;
  if (!expandable) {
    return _createVNode("span", {
      "class": [expandClassName, `${prefixCls}-row-spaced`]
    }, null);
  }
  const onClick = event => {
    onExpand(record, event);
    event.stopPropagation();
  };
  return _createVNode("span", {
    "class": {
      [expandClassName]: true,
      [`${prefixCls}-row-expanded`]: expanded,
      [`${prefixCls}-row-collapsed`]: !expanded
    },
    "onClick": onClick
  }, null);
}
export function findAllChildrenKeys(data, getRowKey, childrenColumnName) {
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