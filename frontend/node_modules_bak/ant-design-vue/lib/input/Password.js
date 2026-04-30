"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var _vnode = require("../_util/vnode");
var _Input = _interopRequireDefault(require("./Input"));
var _EyeOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EyeOutlined"));
var _EyeInvisibleOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EyeInvisibleOutlined"));
var _inputProps = _interopRequireDefault(require("./inputProps"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ActionMap = {
  click: 'onClick',
  hover: 'onMouseover'
};
const defaultIconRender = visible => visible ? (0, _vue.createVNode)(_EyeOutlined.default, null, null) : (0, _vue.createVNode)(_EyeInvisibleOutlined.default, null, null);
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AInputPassword',
  inheritAttrs: false,
  props: (0, _extends2.default)((0, _extends2.default)({}, (0, _inputProps.default)()), {
    prefixCls: String,
    inputPrefixCls: String,
    action: {
      type: String,
      default: 'click'
    },
    visibilityToggle: {
      type: Boolean,
      default: true
    },
    visible: {
      type: Boolean,
      default: undefined
    },
    'onUpdate:visible': Function,
    iconRender: Function
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose,
      emit
    } = _ref;
    const visible = (0, _vue.shallowRef)(false);
    const onVisibleChange = () => {
      const {
        disabled
      } = props;
      if (disabled) {
        return;
      }
      visible.value = !visible.value;
      emit('update:visible', visible.value);
    };
    (0, _vue.watchEffect)(() => {
      if (props.visible !== undefined) {
        visible.value = !!props.visible;
      }
    });
    const inputRef = (0, _vue.shallowRef)();
    const focus = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = inputRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const getIcon = prefixCls => {
      const {
        action,
        iconRender = slots.iconRender || defaultIconRender
      } = props;
      const iconTrigger = ActionMap[action] || '';
      const icon = iconRender(visible.value);
      const iconProps = {
        [iconTrigger]: onVisibleChange,
        class: `${prefixCls}-icon`,
        key: 'passwordIcon',
        onMousedown: e => {
          // Prevent focused state lost
          // https://github.com/ant-design/ant-design/issues/15173
          e.preventDefault();
        },
        onMouseup: e => {
          // Prevent caret position change
          // https://github.com/ant-design/ant-design/issues/23524
          e.preventDefault();
        }
      };
      return (0, _vnode.cloneElement)((0, _propsUtil.isValidElement)(icon) ? icon : (0, _vue.createVNode)("span", null, [icon]), iconProps);
    };
    const {
      prefixCls,
      getPrefixCls
    } = (0, _useConfigInject.default)('input-password', props);
    const inputPrefixCls = (0, _vue.computed)(() => getPrefixCls('input', props.inputPrefixCls));
    const renderPassword = () => {
      const {
          size,
          visibilityToggle
        } = props,
        restProps = __rest(props, ["size", "visibilityToggle"]);
      const suffixIcon = visibilityToggle && getIcon(prefixCls.value);
      const inputClassName = (0, _classNames.default)(prefixCls.value, attrs.class, {
        [`${prefixCls.value}-${size}`]: !!size
      });
      const omittedProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)(restProps, ['suffix', 'iconRender', 'action'])), attrs), {
        type: visible.value ? 'text' : 'password',
        class: inputClassName,
        prefixCls: inputPrefixCls.value,
        suffix: suffixIcon
      });
      if (size) {
        omittedProps.size = size;
      }
      return (0, _vue.createVNode)(_Input.default, (0, _objectSpread2.default)({
        "ref": inputRef
      }, omittedProps), slots);
    };
    return () => {
      return renderPassword();
    };
  }
});