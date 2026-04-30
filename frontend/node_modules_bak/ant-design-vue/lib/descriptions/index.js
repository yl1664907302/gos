"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.descriptionsProps = exports.descriptionsContext = exports.default = exports.DescriptionsItemProps = exports.DescriptionsItem = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _responsiveObserve = _interopRequireWildcard(require("../_util/responsiveObserve"));
var _Row = _interopRequireDefault(require("./Row"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vnode = require("../_util/vnode");
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DescriptionsItemProps = exports.DescriptionsItemProps = {
  prefixCls: String,
  label: _vueTypes.default.any,
  span: Number
};
const descriptionsItemProp = () => ({
  prefixCls: String,
  label: _vueTypes.default.any,
  labelStyle: {
    type: Object,
    default: undefined
  },
  contentStyle: {
    type: Object,
    default: undefined
  },
  span: {
    type: Number,
    default: 1
  }
});
const DescriptionsItem = exports.DescriptionsItem = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ADescriptionsItem',
  props: descriptionsItemProp(),
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const DEFAULT_COLUMN_MAP = {
  xxxl: 3,
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
function getColumn(column, screens) {
  if (typeof column === 'number') {
    return column;
  }
  if (typeof column === 'object') {
    for (let i = 0; i < _responsiveObserve.responsiveArray.length; i++) {
      const breakpoint = _responsiveObserve.responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }
  return 3;
}
function getFilledItem(node, rowRestCol, span) {
  let clone = node;
  if (span === undefined || span > rowRestCol) {
    clone = (0, _vnode.cloneElement)(node, {
      span: rowRestCol
    });
    (0, _warning.default)(span === undefined, 'Descriptions', 'Sum of column `span` in a line not match `column` of Descriptions.');
  }
  return clone;
}
function getRows(children, column) {
  const childNodes = (0, _propsUtil.flattenChildren)(children);
  const rows = [];
  let tmpRow = [];
  let rowRestCol = column;
  childNodes.forEach((node, index) => {
    var _a;
    const span = (_a = node.props) === null || _a === void 0 ? void 0 : _a.span;
    const mergedSpan = span || 1;
    // Additional handle last one
    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(node, rowRestCol, span));
      rows.push(tmpRow);
      return;
    }
    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(node);
    } else {
      tmpRow.push(getFilledItem(node, rowRestCol, mergedSpan));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });
  return rows;
}
const descriptionsProps = () => ({
  prefixCls: String,
  bordered: {
    type: Boolean,
    default: undefined
  },
  size: {
    type: String,
    default: 'default'
  },
  title: _vueTypes.default.any,
  extra: _vueTypes.default.any,
  column: {
    type: [Number, Object],
    default: () => DEFAULT_COLUMN_MAP
  },
  layout: String,
  colon: {
    type: Boolean,
    default: undefined
  },
  labelStyle: {
    type: Object,
    default: undefined
  },
  contentStyle: {
    type: Object,
    default: undefined
  }
});
exports.descriptionsProps = descriptionsProps;
const descriptionsContext = exports.descriptionsContext = Symbol('descriptionsContext');
const Descriptions = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ADescriptions',
  inheritAttrs: false,
  props: descriptionsProps(),
  slots: Object,
  Item: DescriptionsItem,
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('descriptions', props);
    let token;
    const screens = (0, _vue.ref)({});
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const responsiveObserve = (0, _responsiveObserve.default)();
    (0, _vue.onBeforeMount)(() => {
      token = responsiveObserve.value.subscribe(screen => {
        if (typeof props.column !== 'object') {
          return;
        }
        screens.value = screen;
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      responsiveObserve.value.unsubscribe(token);
    });
    (0, _vue.provide)(descriptionsContext, {
      labelStyle: (0, _vue.toRef)(props, 'labelStyle'),
      contentStyle: (0, _vue.toRef)(props, 'contentStyle')
    });
    const mergeColumn = (0, _vue.computed)(() => getColumn(props.column, screens.value));
    return () => {
      var _a, _b, _c;
      const {
        size,
        bordered = false,
        layout = 'horizontal',
        colon = true,
        title = (_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots),
        extra = (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots)
      } = props;
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      const rows = getRows(children, mergeColumn.value);
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [prefixCls.value, {
          [`${prefixCls.value}-${size}`]: size !== 'default',
          [`${prefixCls.value}-bordered`]: !!bordered,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [(title || extra) && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-header`
      }, [title && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-title`
      }, [title]), extra && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-extra`
      }, [extra])]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-view`
      }, [(0, _vue.createVNode)("table", null, [(0, _vue.createVNode)("tbody", null, [rows.map((row, index) => (0, _vue.createVNode)(_Row.default, {
        "key": index,
        "index": index,
        "colon": colon,
        "prefixCls": prefixCls.value,
        "vertical": layout === 'vertical',
        "bordered": bordered,
        "row": row
      }, null))])])])]));
    };
  }
});
Descriptions.install = function (app) {
  app.component(Descriptions.name, Descriptions);
  app.component(Descriptions.Item.name, Descriptions.Item);
  return app;
};
var _default = exports.default = Descriptions;