"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _Cell = _interopRequireDefault(require("./Cell"));
var _propsUtil = require("../_util/props-util");
var _index = require("./index");
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
      const children = (0, _propsUtil.getSlot)(item);
      const className = (0, _propsUtil.getClass)(item);
      const style = (0, _propsUtil.getStyle)(item);
      const {
        key
      } = item;
      if (typeof component === 'string') {
        return (0, _vue.createVNode)(_Cell.default, {
          "key": `${type}-${String(key) || index}`,
          "class": className,
          "style": style,
          "labelStyle": (0, _extends2.default)((0, _extends2.default)({}, rootLabelStyle), labelStyle),
          "contentStyle": (0, _extends2.default)((0, _extends2.default)({}, rootContentStyle), contentStyle),
          "span": span,
          "colon": colon,
          "component": component,
          "itemPrefixCls": itemPrefixCls,
          "bordered": bordered,
          "label": showLabel ? label : null,
          "content": showContent ? children : null
        }, null);
      }
      return [(0, _vue.createVNode)(_Cell.default, {
        "key": `label-${String(key) || index}`,
        "class": className,
        "style": (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, rootLabelStyle), style), labelStyle),
        "span": 1,
        "colon": colon,
        "component": component[0],
        "itemPrefixCls": itemPrefixCls,
        "bordered": bordered,
        "label": label
      }, null), (0, _vue.createVNode)(_Cell.default, {
        "key": `content-${String(key) || index}`,
        "class": className,
        "style": (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, rootContentStyle), style), contentStyle),
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
  } = (0, _vue.inject)(_index.descriptionsContext, {
    labelStyle: (0, _vue.ref)({}),
    contentStyle: (0, _vue.ref)({})
  });
  if (vertical) {
    return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("tr", {
      "key": `label-${index}`,
      "class": `${prefixCls}-row`
    }, [renderCells(row, props, {
      component: 'th',
      type: 'label',
      showLabel: true,
      labelStyle: labelStyle.value,
      contentStyle: contentStyle.value
    })]), (0, _vue.createVNode)("tr", {
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
  return (0, _vue.createVNode)("tr", {
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
var _default = exports.default = Row;