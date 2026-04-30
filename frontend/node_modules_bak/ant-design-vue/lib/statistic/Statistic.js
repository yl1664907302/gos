"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.statisticProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _Number = _interopRequireDefault(require("./Number"));
var _Skeleton = _interopRequireDefault(require("../skeleton/Skeleton"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var _type = require("../_util/type");
// CSSINJS

const statisticProps = () => ({
  prefixCls: String,
  decimalSeparator: String,
  groupSeparator: String,
  format: String,
  value: (0, _type.someType)([Number, String, Object]),
  valueStyle: {
    type: Object,
    default: undefined
  },
  valueRender: (0, _type.functionType)(),
  formatter: (0, _type.anyType)(),
  precision: Number,
  prefix: (0, _type.vNodeType)(),
  suffix: (0, _type.vNodeType)(),
  title: (0, _type.vNodeType)(),
  loading: (0, _type.booleanType)()
});
exports.statisticProps = statisticProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AStatistic',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(statisticProps(), {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('statistic', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a, _b, _c, _d, _e, _f, _g;
      const {
        value = 0,
        valueStyle,
        valueRender
      } = props;
      const pre = prefixCls.value;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const prefix = (_c = props.prefix) !== null && _c !== void 0 ? _c : (_d = slots.prefix) === null || _d === void 0 ? void 0 : _d.call(slots);
      const suffix = (_e = props.suffix) !== null && _e !== void 0 ? _e : (_f = slots.suffix) === null || _f === void 0 ? void 0 : _f.call(slots);
      const formatter = (_g = props.formatter) !== null && _g !== void 0 ? _g : slots.formatter;
      // data-for-update just for update component
      // https://github.com/vueComponent/ant-design-vue/pull/3170
      let valueNode = (0, _vue.createVNode)(_Number.default, (0, _objectSpread2.default)({
        "data-for-update": Date.now()
      }, (0, _extends2.default)((0, _extends2.default)({}, props), {
        prefixCls: pre,
        value,
        formatter
      })), null);
      if (valueRender) {
        valueNode = valueRender(valueNode);
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [pre, {
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [title && (0, _vue.createVNode)("div", {
        "class": `${pre}-title`
      }, [title]), (0, _vue.createVNode)(_Skeleton.default, {
        "paragraph": false,
        "loading": props.loading
      }, {
        default: () => [(0, _vue.createVNode)("div", {
          "style": valueStyle,
          "class": `${pre}-content`
        }, [prefix && (0, _vue.createVNode)("span", {
          "class": `${pre}-content-prefix`
        }, [prefix]), valueNode, suffix && (0, _vue.createVNode)("span", {
          "class": `${pre}-content-suffix`
        }, [suffix])])]
      })]));
    };
  }
});