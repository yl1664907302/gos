import { createVNode as _createVNode } from "vue";
import classNames from '../_util/classNames';
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
    return _createVNode("button", {
      "type": "button",
      "onClick": e => {
        onExpand(record, e);
        e.stopPropagation();
      },
      "class": classNames(iconPrefix, {
        [`${iconPrefix}-spaced`]: !expandable,
        [`${iconPrefix}-expanded`]: expandable && expanded,
        [`${iconPrefix}-collapsed`]: expandable && !expanded
      }),
      "aria-label": expanded ? locale.collapse : locale.expand,
      "aria-expanded": expanded
    }, null);
  };
}
export default renderExpandIcon;