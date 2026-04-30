"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _button = _interopRequireDefault(require("../button"));
var _dropdown = _interopRequireDefault(require("./dropdown"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var _props = require("./props");
var _EllipsisOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EllipsisOutlined"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ButtonGroup = _button.default.Group;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ADropdownButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: (0, _propsUtil.initDefaultProps)((0, _props.dropdownButtonProps)(), {
    trigger: 'hover',
    placement: 'bottomRight',
    type: 'default'
  }),
  // emits: ['click', 'visibleChange', 'update:visible'],s
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const handleVisibleChange = val => {
      emit('update:visible', val);
      emit('visibleChange', val);
      emit('update:open', val);
      emit('openChange', val);
    };
    const {
      prefixCls,
      direction,
      getPopupContainer
    } = (0, _useConfigInject.default)('dropdown', props);
    const buttonPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-button`);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a, _b;
      const _c = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          type = 'default',
          disabled,
          danger,
          loading,
          htmlType,
          class: className = '',
          overlay = (_a = slots.overlay) === null || _a === void 0 ? void 0 : _a.call(slots),
          trigger,
          align,
          open,
          visible,
          onVisibleChange: _onVisibleChange,
          placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
          href,
          title,
          icon = ((_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots)) || (0, _vue.createVNode)(_EllipsisOutlined.default, null, null),
          mouseEnterDelay,
          mouseLeaveDelay,
          overlayClassName,
          overlayStyle,
          destroyPopupOnHide,
          onClick,
          'onUpdate:open': _updateVisible
        } = _c,
        restProps = __rest(_c, ["type", "disabled", "danger", "loading", "htmlType", "class", "overlay", "trigger", "align", "open", "visible", "onVisibleChange", "placement", "href", "title", "icon", "mouseEnterDelay", "mouseLeaveDelay", "overlayClassName", "overlayStyle", "destroyPopupOnHide", "onClick", 'onUpdate:open']);
      const dropdownProps = {
        align,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        onOpenChange: handleVisibleChange,
        mouseEnterDelay,
        mouseLeaveDelay,
        open: open !== null && open !== void 0 ? open : visible,
        overlayClassName,
        overlayStyle,
        destroyPopupOnHide
      };
      const leftButton = (0, _vue.createVNode)(_button.default, {
        "danger": danger,
        "type": type,
        "disabled": disabled,
        "loading": loading,
        "onClick": onClick,
        "htmlType": htmlType,
        "href": href,
        "title": title
      }, {
        default: slots.default
      });
      const rightButton = (0, _vue.createVNode)(_button.default, {
        "danger": danger,
        "type": type,
        "icon": icon
      }, null);
      return wrapSSR((0, _vue.createVNode)(ButtonGroup, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
        "class": (0, _classNames.default)(buttonPrefixCls.value, className, hashId.value)
      }), {
        default: () => [slots.leftButton ? slots.leftButton({
          button: leftButton
        }) : leftButton, (0, _vue.createVNode)(_dropdown.default, dropdownProps, {
          default: () => [slots.rightButton ? slots.rightButton({
            button: rightButton
          }) : rightButton],
          overlay: () => overlay
        })]
      }));
    };
  }
});