import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import Cell from './Cell';
import { getSlot, getClass, getStyle } from '../_util/props-util';
import { inject, ref } from 'vue';
import { descriptionsContext } from './index';
const Row = props => {
  const renderCells = (items, _ref, _ref2) => {
    let {
      colon,
      prefixCls,
      bordered
    } = _ref;
    let {
      component,
      type,
      showLabel,
      showContent,
      labelStyle: rootLabelStyle,
      contentStyle: rootContentStyle
    } = _ref2;
    return items.map((item, index) => {
      var _a, _b;
      const itemProps = item.props || {};
      const {
        prefixCls: itemPrefixCls = prefixCls,
        span = 1,
        labelStyle = itemProps['label-style'],
        contentStyle = itemProps['content-style'],
        label = (_b = (_a = item.children) === null || _a === void 0 ? void 0 : _a.label) === null || _b === void 0 ? void 0 : _b.call(_a)
      } = itemProps;
      const children = getSlot(item);
      const className = getClass(item);
      const style = getStyle(item);
      const {
        key
      } = item;
      if (typeof component === 'string') {
        return _createVNode(Cell, {
          "key": `${type}-${String(key) || index}`,
          "class": className,
          "style": style,
          "labelStyle": _extends(_extends({}, rootLabelStyle), labelStyle),
          "contentStyle": _extends(_extends({}, rootContentStyle), contentStyle),
          "span": span,
          "colon": colon,
          "component": component,
          "itemPrefixCls": itemPrefixCls,
          "bordered": bordered,
          "label": showLabel ? label : null,
          "content": showContent ? children : null
        }, null);
      }
      return [_createVNode(Cell, {
        "key": `label-${String(key) || index}`,
        "class": className,
        "style": _extends(_extends(_extends({}, rootLabelStyle), style), labelStyle),
        "span": 1,
        "colon": colon,
        "component": component[0],
        "itemPrefixCls": itemPrefixCls,
        "bordered": bordered,
        "label": label
      }, null), _createVNode(Cell, {
        "key": `content-${String(key) || index}`,
        "class": className,
        "style": _extends(_extends(_extends({}, rootContentStyle), style), contentStyle),
        "span": span * 2 - 1,
        "component": component[1],
        "itemPrefixCls": itemPrefixCls,
        "bordered": bordered,
        "content": children
      }, null)];
    });
  };
  const {
    prefixCls,
    vertical,
    row,
    index,
    bordered
  } = props;
  const {
    labelStyle,
    contentStyle
  } = inject(descriptionsContext, {
    labelStyle: ref({}),
    contentStyle: ref({})
  });
  if (vertical) {
    return _createVNode(_Fragment, null, [_createVNode("tr", {
      "key": `label-${index}`,
      "class": `${prefixCls}-row`
    }, [renderCells(row, props, {
      component: 'th',
      type: 'label',
      showLabel: true,
      labelStyle: labelStyle.value,
      contentStyle: contentStyle.value
    })]), _createVNode("tr", {
      "key": `content-${index}`,
      "class": `${prefixCls}-row`
    }, [renderCells(row, props, {
      component: 'td',
      type: 'content',
      showContent: true,
      labelStyle: labelStyle.value,
      contentStyle: contentStyle.value
    })])]);
  }
  return _createVNode("tr", {
    "key": index,
    "class": `${prefixCls}-row`
  }, [renderCells(row, props, {
    component: bordered ? ['th', 'td'] : 'td',
    type: 'item',
    showLabel: true,
    showContent: true,
    labelStyle: labelStyle.value,
    contentStyle: contentStyle.value
  })]);
};
export default Row;