"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "collapsePanelProps", {
  enumerable: true,
  get: function () {
    return _commonProps.collapsePanelProps;
  }
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PanelContent = _interopRequireDefault(require("./PanelContent"));
var _propsUtil = require("../_util/props-util");
var _commonProps = require("./commonProps");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACollapsePanel',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _commonProps.collapsePanelProps)(), {
    showArrow: true,
    isActive: false,
    onItemClick() {},
    headerClass: '',
    forceRender: false
  }),
  slots: Object,
  // emits: ['itemClick'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    (0, _devWarning.default)(props.disabled === undefined, 'Collapse.Panel', '`disabled` is deprecated. Please use `collapsible="disabled"` instead.');
    const {
      prefixCls
    } = (0, _useConfigInject.default)('collapse', props);
    const handleItemClick = () => {
      emit('itemClick', props.panelKey);
    };
    const handleKeyPress = e => {
      if (e.key === 'Enter' || e.keyCode === 13 || e.which === 13) {
        handleItemClick();
      }
    };
    return () => {
      var _a, _b;
      const {
        header = (_a = slots.header) === null || _a === void 0 ? void 0 : _a.call(slots),
        headerClass,
        isActive,
        showArrow,
        destroyInactivePanel,
        accordion,
        forceRender,
        openAnimation,
        expandIcon = slots.expandIcon,
        extra = (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots),
        collapsible
      } = props;
      const disabled = collapsible === 'disabled';
      const prefixClsValue = prefixCls.value;
      const headerCls = (0, _classNames.default)(`${prefixClsValue}-header`, {
        [headerClass]: headerClass,
        [`${prefixClsValue}-header-collapsible-only`]: collapsible === 'header',
        [`${prefixClsValue}-icon-collapsible-only`]: collapsible === 'icon'
      });
      const itemCls = (0, _classNames.default)({
        [`${prefixClsValue}-item`]: true,
        [`${prefixClsValue}-item-active`]: isActive,
        [`${prefixClsValue}-item-disabled`]: disabled,
        [`${prefixClsValue}-no-arrow`]: !showArrow,
        [`${attrs.class}`]: !!attrs.class
      });
      let icon = (0, _vue.createVNode)("i", {
        "class": "arrow"
      }, null);
      if (showArrow && typeof expandIcon === 'function') {
        icon = expandIcon(props);
      }
      const panelContent = (0, _vue.withDirectives)((0, _vue.createVNode)(_PanelContent.default, {
        "prefixCls": prefixClsValue,
        "isActive": isActive,
        "forceRender": forceRender,
        "role": accordion ? 'tabpanel' : null
      }, {
        default: slots.default
      }), [[_vue.vShow, isActive]]);
      const transitionProps = (0, _extends2.default)({
        appear: false,
        css: false
      }, openAnimation);
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": itemCls
      }), [(0, _vue.createVNode)("div", {
        "class": headerCls,
        "onClick": () => !['header', 'icon'].includes(collapsible) && handleItemClick(),
        "role": accordion ? 'tab' : 'button',
        "tabindex": disabled ? -1 : 0,
        "aria-expanded": isActive,
        "onKeypress": handleKeyPress
      }, [showArrow && icon, (0, _vue.createVNode)("span", {
        "onClick": () => collapsible === 'header' && handleItemClick(),
        "class": `${prefixClsValue}-header-text`
      }, [header]), extra && (0, _vue.createVNode)("div", {
        "class": `${prefixClsValue}-extra`
      }, [extra])]), (0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [!destroyInactivePanel || isActive ? panelContent : null]
      })]);
    };
  }
});