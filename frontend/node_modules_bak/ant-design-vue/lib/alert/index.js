"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.alertProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _CheckCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleOutlined"));
var _ExclamationCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleOutlined"));
var _InfoCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleOutlined"));
var _CloseCircleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleOutlined"));
var _CheckCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CheckCircleFilled"));
var _ExclamationCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ExclamationCircleFilled"));
var _InfoCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/InfoCircleFilled"));
var _CloseCircleFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseCircleFilled"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _transition = require("../_util/transition");
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _vnode = require("../_util/vnode");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
const iconMapFilled = {
  success: _CheckCircleFilled.default,
  info: _InfoCircleFilled.default,
  error: _CloseCircleFilled.default,
  warning: _ExclamationCircleFilled.default
};
const iconMapOutlined = {
  success: _CheckCircleOutlined.default,
  info: _InfoCircleOutlined.default,
  error: _CloseCircleOutlined.default,
  warning: _ExclamationCircleOutlined.default
};
const AlertTypes = (0, _type.tuple)('success', 'info', 'warning', 'error');
const alertProps = () => ({
  /**
   * Type of Alert styles, options: `success`, `info`, `warning`, `error`
   */
  type: _vueTypes.default.oneOf(AlertTypes),
  /** Whether Alert can be closed */
  closable: {
    type: Boolean,
    default: undefined
  },
  /** Close text to show */
  closeText: _vueTypes.default.any,
  /** Content of Alert */
  message: _vueTypes.default.any,
  /** Additional content of Alert */
  description: _vueTypes.default.any,
  /** Trigger when animation ending of Alert */
  afterClose: Function,
  /** Whether to show icon */
  showIcon: {
    type: Boolean,
    default: undefined
  },
  prefixCls: String,
  banner: {
    type: Boolean,
    default: undefined
  },
  icon: _vueTypes.default.any,
  closeIcon: _vueTypes.default.any,
  onClose: Function
});
exports.alertProps = alertProps;
const Alert = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AAlert',
  inheritAttrs: false,
  props: alertProps(),
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs,
      expose
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('alert', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const closing = (0, _vue.shallowRef)(false);
    const closed = (0, _vue.shallowRef)(false);
    const alertNode = (0, _vue.shallowRef)();
    const handleClose = e => {
      e.preventDefault();
      const dom = alertNode.value;
      dom.style.height = `${dom.offsetHeight}px`;
      // Magic code
      // 重复一次后才能正确设置 height
      dom.style.height = `${dom.offsetHeight}px`;
      closing.value = true;
      emit('close', e);
    };
    const animationEnd = () => {
      var _a;
      closing.value = false;
      closed.value = true;
      (_a = props.afterClose) === null || _a === void 0 ? void 0 : _a.call(props);
    };
    const mergedType = (0, _vue.computed)(() => {
      const {
        type
      } = props;
      if (type !== undefined) {
        return type;
      }
      // banner 模式默认为警告
      return props.banner ? 'warning' : 'info';
    });
    expose({
      animationEnd
    });
    const motionStyle = (0, _vue.shallowRef)({});
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
      const {
        banner,
        closeIcon: customCloseIcon = (_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = props;
      let {
        closable,
        showIcon
      } = props;
      const closeText = (_b = props.closeText) !== null && _b !== void 0 ? _b : (_c = slots.closeText) === null || _c === void 0 ? void 0 : _c.call(slots);
      const description = (_d = props.description) !== null && _d !== void 0 ? _d : (_e = slots.description) === null || _e === void 0 ? void 0 : _e.call(slots);
      const message = (_f = props.message) !== null && _f !== void 0 ? _f : (_g = slots.message) === null || _g === void 0 ? void 0 : _g.call(slots);
      const icon = (_h = props.icon) !== null && _h !== void 0 ? _h : (_j = slots.icon) === null || _j === void 0 ? void 0 : _j.call(slots);
      const action = (_k = slots.action) === null || _k === void 0 ? void 0 : _k.call(slots);
      // banner模式默认有 Icon
      showIcon = banner && showIcon === undefined ? true : showIcon;
      const IconType = (description ? iconMapOutlined : iconMapFilled)[mergedType.value] || null;
      // closeable when closeText is assigned
      if (closeText) {
        closable = true;
      }
      const prefixClsValue = prefixCls.value;
      const alertCls = (0, _classNames.default)(prefixClsValue, {
        [`${prefixClsValue}-${mergedType.value}`]: true,
        [`${prefixClsValue}-closing`]: closing.value,
        [`${prefixClsValue}-with-description`]: !!description,
        [`${prefixClsValue}-no-icon`]: !showIcon,
        [`${prefixClsValue}-banner`]: !!banner,
        [`${prefixClsValue}-closable`]: closable,
        [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      });
      const closeIcon = closable ? (0, _vue.createVNode)("button", {
        "type": "button",
        "onClick": handleClose,
        "class": `${prefixClsValue}-close-icon`,
        "tabindex": 0
      }, [closeText ? (0, _vue.createVNode)("span", {
        "class": `${prefixClsValue}-close-text`
      }, [closeText]) : customCloseIcon === undefined ? (0, _vue.createVNode)(_CloseOutlined.default, null, null) : customCloseIcon]) : null;
      const iconNode = icon && ((0, _propsUtil.isValidElement)(icon) ? (0, _vnode.cloneElement)(icon, {
        class: `${prefixClsValue}-icon`
      }) : (0, _vue.createVNode)("span", {
        "class": `${prefixClsValue}-icon`
      }, [icon])) || (0, _vue.createVNode)(IconType, {
        "class": `${prefixClsValue}-icon`
      }, null);
      const transitionProps = (0, _transition.getTransitionProps)(`${prefixClsValue}-motion`, {
        appear: false,
        css: true,
        onAfterLeave: animationEnd,
        onBeforeLeave: node => {
          node.style.maxHeight = `${node.offsetHeight}px`;
        },
        onLeave: node => {
          node.style.maxHeight = '0px';
        }
      });
      return wrapSSR(closed.value ? null : (0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
          "role": "alert"
        }, attrs), {}, {
          "style": [attrs.style, motionStyle.value],
          "class": [attrs.class, alertCls],
          "data-show": !closing.value,
          "ref": alertNode
        }), [showIcon ? iconNode : null, (0, _vue.createVNode)("div", {
          "class": `${prefixClsValue}-content`
        }, [message ? (0, _vue.createVNode)("div", {
          "class": `${prefixClsValue}-message`
        }, [message]) : null, description ? (0, _vue.createVNode)("div", {
          "class": `${prefixClsValue}-description`
        }, [description]) : null]), action ? (0, _vue.createVNode)("div", {
          "class": `${prefixClsValue}-action`
        }, [action]) : null, closeIcon]), [[_vue.vShow, !closing.value]])]
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Alert);