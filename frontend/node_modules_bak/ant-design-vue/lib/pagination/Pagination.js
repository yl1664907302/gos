"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.paginationProps = exports.paginationConfig = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _LeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LeftOutlined"));
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _DoubleLeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DoubleLeftOutlined"));
var _DoubleRightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DoubleRightOutlined"));
var _Select = _interopRequireWildcard(require("./Select"));
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _vcPagination = _interopRequireDefault(require("../vc-pagination"));
var _en_US = _interopRequireDefault(require("../vc-pagination/locale/en_US"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useBreakpoint = _interopRequireDefault(require("../_util/hooks/useBreakpoint"));
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("./style"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const paginationProps = () => ({
  total: Number,
  defaultCurrent: Number,
  disabled: (0, _type.booleanType)(),
  current: Number,
  defaultPageSize: Number,
  pageSize: Number,
  hideOnSinglePage: (0, _type.booleanType)(),
  showSizeChanger: (0, _type.booleanType)(),
  pageSizeOptions: (0, _type.arrayType)(),
  buildOptionText: (0, _type.functionType)(),
  showQuickJumper: (0, _type.someType)([Boolean, Object]),
  showTotal: (0, _type.functionType)(),
  size: (0, _type.stringType)(),
  simple: (0, _type.booleanType)(),
  locale: Object,
  prefixCls: String,
  selectPrefixCls: String,
  totalBoundaryShowSizeChanger: Number,
  selectComponentClass: String,
  itemRender: (0, _type.functionType)(),
  role: String,
  responsive: Boolean,
  showLessItems: (0, _type.booleanType)(),
  onChange: (0, _type.functionType)(),
  onShowSizeChange: (0, _type.functionType)(),
  'onUpdate:current': (0, _type.functionType)(),
  'onUpdate:pageSize': (0, _type.functionType)()
});
exports.paginationProps = paginationProps;
const paginationConfig = () => (0, _extends2.default)((0, _extends2.default)({}, paginationProps()), {
  position: (0, _type.stringType)()
});
exports.paginationConfig = paginationConfig;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'APagination',
  inheritAttrs: false,
  props: paginationProps(),
  // emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      configProvider,
      direction,
      size
    } = (0, _useConfigInject.default)('pagination', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const selectPrefixCls = (0, _vue.computed)(() => configProvider.getPrefixCls('select', props.selectPrefixCls));
    const breakpoint = (0, _useBreakpoint.default)();
    const [locale] = (0, _LocaleReceiver.useLocaleReceiver)('Pagination', _en_US.default, (0, _vue.toRef)(props, 'locale'));
    const getIconsProps = pre => {
      const ellipsis = (0, _vue.createVNode)("span", {
        "class": `${pre}-item-ellipsis`
      }, [(0, _vue.createTextVNode)("\u2022\u2022\u2022")]);
      const prevIcon = (0, _vue.createVNode)("button", {
        "class": `${pre}-item-link`,
        "type": "button",
        "tabindex": -1
      }, [direction.value === 'rtl' ? (0, _vue.createVNode)(_RightOutlined.default, null, null) : (0, _vue.createVNode)(_LeftOutlined.default, null, null)]);
      const nextIcon = (0, _vue.createVNode)("button", {
        "class": `${pre}-item-link`,
        "type": "button",
        "tabindex": -1
      }, [direction.value === 'rtl' ? (0, _vue.createVNode)(_LeftOutlined.default, null, null) : (0, _vue.createVNode)(_RightOutlined.default, null, null)]);
      const jumpPrevIcon = (0, _vue.createVNode)("a", {
        "rel": "nofollow",
        "class": `${pre}-item-link`
      }, [(0, _vue.createVNode)("div", {
        "class": `${pre}-item-container`
      }, [direction.value === 'rtl' ? (0, _vue.createVNode)(_DoubleRightOutlined.default, {
        "class": `${pre}-item-link-icon`
      }, null) : (0, _vue.createVNode)(_DoubleLeftOutlined.default, {
        "class": `${pre}-item-link-icon`
      }, null), ellipsis])]);
      const jumpNextIcon = (0, _vue.createVNode)("a", {
        "rel": "nofollow",
        "class": `${pre}-item-link`
      }, [(0, _vue.createVNode)("div", {
        "class": `${pre}-item-container`
      }, [direction.value === 'rtl' ? (0, _vue.createVNode)(_DoubleLeftOutlined.default, {
        "class": `${pre}-item-link-icon`
      }, null) : (0, _vue.createVNode)(_DoubleRightOutlined.default, {
        "class": `${pre}-item-link-icon`
      }, null), ellipsis])]);
      return {
        prevIcon,
        nextIcon,
        jumpPrevIcon,
        jumpNextIcon
      };
    };
    return () => {
      var _a;
      const {
          itemRender = slots.itemRender,
          buildOptionText = slots.buildOptionText,
          selectComponentClass,
          responsive
        } = props,
        restProps = __rest(props, ["itemRender", "buildOptionText", "selectComponentClass", "responsive"]);
      const isSmall = size.value === 'small' || !!(((_a = breakpoint.value) === null || _a === void 0 ? void 0 : _a.xs) && !size.value && responsive);
      const paginationProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, restProps), getIconsProps(prefixCls.value)), {
        prefixCls: prefixCls.value,
        selectPrefixCls: selectPrefixCls.value,
        selectComponentClass: selectComponentClass || (isSmall ? _Select.default : _Select.MiddleSelect),
        locale: locale.value,
        buildOptionText
      }), attrs), {
        class: (0, _classNames.default)({
          [`${prefixCls.value}-mini`]: isSmall,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value),
        itemRender
      });
      return wrapSSR((0, _vue.createVNode)(_vcPagination.default, paginationProps, null));
    };
  }
});