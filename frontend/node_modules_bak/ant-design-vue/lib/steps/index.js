"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stepsProps = exports.stepProps = exports.default = exports.Step = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _CheckOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckOutlined"));
var _type = require("../_util/type");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _vcSteps = _interopRequireWildcard(require("../vc-steps"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useBreakpoint = _interopRequireDefault(require("../_util/hooks/useBreakpoint"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _progress = _interopRequireDefault(require("../progress"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _Step = require("../vc-steps/Step");
var _internal = require("../theme/internal");
var _style = _interopRequireDefault(require("./style"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// CSSINJS

const stepsProps = () => ({
  prefixCls: String,
  iconPrefix: String,
  current: Number,
  initial: Number,
  percent: Number,
  responsive: (0, _type.booleanType)(),
  items: (0, _type.arrayType)(),
  labelPlacement: (0, _type.stringType)(),
  status: (0, _type.stringType)(),
  size: (0, _type.stringType)(),
  direction: (0, _type.stringType)(),
  progressDot: (0, _type.someType)([Boolean, Function]),
  type: (0, _type.stringType)(),
  onChange: (0, _type.functionType)(),
  'onUpdate:current': (0, _type.functionType)()
});
exports.stepsProps = stepsProps;
const stepProps = () => ({
  description: (0, _type.anyType)(),
  icon: (0, _type.anyType)(),
  status: (0, _type.stringType)(),
  disabled: (0, _type.booleanType)(),
  title: (0, _type.anyType)(),
  subTitle: (0, _type.anyType)(),
  onClick: (0, _type.functionType)()
});
exports.stepProps = stepProps;
const Steps = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASteps',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(stepsProps(), {
    current: 0,
    responsive: true,
    labelPlacement: 'horizontal'
  }),
  slots: Object,
  // emits: ['update:current', 'change'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const {
      prefixCls,
      direction: rtlDirection,
      configProvider
    } = (0, _useConfigInject.default)('steps', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const [, token] = (0, _internal.useToken)();
    const screens = (0, _useBreakpoint.default)();
    const direction = (0, _vue.computed)(() => props.responsive && screens.value.xs ? 'vertical' : props.direction);
    const iconPrefix = (0, _vue.computed)(() => configProvider.getPrefixCls('', props.iconPrefix));
    const handleChange = current => {
      emit('update:current', current);
      emit('change', current);
    };
    const isInline = (0, _vue.computed)(() => props.type === 'inline');
    const mergedPercent = (0, _vue.computed)(() => isInline.value ? undefined : props.percent);
    const stepIconRender = _ref2 => {
      let {
        node,
        status
      } = _ref2;
      if (status === 'process' && props.percent !== undefined) {
        // currently it's hard-coded, since we can't easily read the actually width of icon
        const progressWidth = props.size === 'small' ? token.value.controlHeight : token.value.controlHeightLG;
        const iconWithProgress = (0, _vue.createVNode)("div", {
          "class": `${prefixCls.value}-progress-icon`
        }, [(0, _vue.createVNode)(_progress.default, {
          "type": "circle",
          "percent": mergedPercent.value,
          "size": progressWidth,
          "strokeWidth": 4,
          "format": () => null
        }, null), node]);
        return iconWithProgress;
      }
      return node;
    };
    const icons = (0, _vue.computed)(() => ({
      finish: (0, _vue.createVNode)(_CheckOutlined.default, {
        "class": `${prefixCls.value}-finish-icon`
      }, null),
      error: (0, _vue.createVNode)(_CloseOutlined.default, {
        "class": `${prefixCls.value}-error-icon`
      }, null)
    }));
    return () => {
      const stepsClassName = (0, _classNames.default)({
        [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
        [`${prefixCls.value}-with-progress`]: mergedPercent.value !== undefined
      }, attrs.class, hashId.value);
      const itemRender = (item, stepItem) => item.description ? (0, _vue.createVNode)(_tooltip.default, {
        "title": item.description
      }, {
        default: () => [stepItem]
      }) : stepItem;
      return wrapSSR((0, _vue.createVNode)(_vcSteps.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "icons": icons.value
      }, attrs), (0, _omit.default)(props, ['percent', 'responsive'])), {}, {
        "items": props.items,
        "direction": direction.value,
        "prefixCls": prefixCls.value,
        "iconPrefix": iconPrefix.value,
        "class": stepsClassName,
        "onChange": handleChange,
        "isInline": isInline.value,
        "itemRender": isInline.value ? itemRender : undefined
      }), (0, _extends2.default)({
        stepIcon: stepIconRender
      }, slots)));
    };
  }
});
/* istanbul ignore next */
const Step = exports.Step = (0, _vue.defineComponent)((0, _extends2.default)((0, _extends2.default)({
  compatConfig: {
    MODE: 3
  }
}, _vcSteps.Step), {
  name: 'AStep',
  props: (0, _Step.VcStepProps)()
}));
var _default = exports.default = (0, _extends2.default)(Steps, {
  Step,
  install: app => {
    app.component(Steps.name, Steps);
    app.component(Step.name, Step);
    return app;
  }
});