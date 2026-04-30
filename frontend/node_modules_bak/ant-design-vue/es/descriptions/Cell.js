import { createVNode as _createVNode } from "vue";
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
    return _createVNode(Component, {
      "class": [{
        [`${itemPrefixCls}-item-label`]: notEmpty(label),
        [`${itemPrefixCls}-item-content`]: notEmpty(content)
      }],
      "colSpan": span
    }, {
      default: () => [notEmpty(label) && _createVNode("span", {
        "style": labelStyle
      }, [label]), notEmpty(content) && _createVNode("span", {
        "style": contentStyle
      }, [content])]
    });
  }
  return _createVNode(Component, {
    "class": [`${itemPrefixCls}-item`],
    "colSpan": span
  }, {
    default: () => [_createVNode("div", {
      "class": `${itemPrefixCls}-item-container`
    }, [(label || label === 0) && _createVNode("span", {
      "class": [`${itemPrefixCls}-item-label`, {
        [`${itemPrefixCls}-item-no-colon`]: !colon
      }],
      "style": labelStyle
    }, [label]), (content || content === 0) && _createVNode("span", {
      "class": `${itemPrefixCls}-item-content`,
      "style": contentStyle
    }, [content])])]
  });
};
export default Cell;