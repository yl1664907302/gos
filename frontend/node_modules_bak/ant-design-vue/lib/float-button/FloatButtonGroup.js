"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _FileTextOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FileTextOutlined"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _transition = require("../_util/transition");
var _FloatButton = _interopRequireWildcard(require("./FloatButton"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = require("./context");
var _propsUtil = require("../_util/props-util");
var _interface = require("./interface");
var _canUseDom = _interopRequireDefault(require("../_util/canUseDom"));
var _style = _interopRequireDefault(require("./style"));
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// CSSINJS

const FloatButtonGroup = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButtonGroup',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _interface.floatButtonGroupProps)(), {
    type: 'default',
    shape: 'circle'
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)(_FloatButton.floatButtonPrefixCls, props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const [open, setOpen] = (0, _useMergedState.default)(false, {
      value: (0, _vue.computed)(() => props.open)
    });
    const floatButtonGroupRef = (0, _vue.ref)(null);
    const floatButtonRef = (0, _vue.ref)(null);
    (0, _context.useProvideFloatButtonGroupContext)({
      shape: (0, _vue.computed)(() => props.shape)
    });
    const hoverTypeAction = {
      onMouseenter() {
        var _a;
        setOpen(true);
        emit('update:open', true);
        (_a = props.onOpenChange) === null || _a === void 0 ? void 0 : _a.call(props, true);
      },
      onMouseleave() {
        var _a;
        setOpen(false);
        emit('update:open', false);
        (_a = props.onOpenChange) === null || _a === void 0 ? void 0 : _a.call(props, false);
      }
    };
    const hoverAction = (0, _vue.computed)(() => {
      return props.trigger === 'hover' ? hoverTypeAction : {};
    });
    const handleOpenChange = () => {
      var _a;
      const nextOpen = !open.value;
      emit('update:open', nextOpen);
      (_a = props.onOpenChange) === null || _a === void 0 ? void 0 : _a.call(props, nextOpen);
      setOpen(nextOpen);
    };
    const onClick = e => {
      var _a, _b, _c;
      if ((_a = floatButtonGroupRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.target)) {
        if ((_b = (0, _propsUtil.findDOMNode)(floatButtonRef.value)) === null || _b === void 0 ? void 0 : _b.contains(e.target)) {
          handleOpenChange();
        }
        return;
      }
      setOpen(false);
      emit('update:open', false);
      (_c = props.onOpenChange) === null || _c === void 0 ? void 0 : _c.call(props, false);
    };
    (0, _vue.watch)((0, _vue.computed)(() => props.trigger), value => {
      if (!(0, _canUseDom.default)()) {
        return;
      }
      document.removeEventListener('click', onClick);
      if (value === 'click') {
        document.addEventListener('click', onClick);
      }
    }, {
      immediate: true
    });
    (0, _vue.onBeforeUnmount)(() => {
      document.removeEventListener('click', onClick);
    });
    return () => {
      var _a;
      const {
        shape = 'circle',
        type = 'default',
        tooltip,
        description,
        trigger
      } = props;
      const groupPrefixCls = `${prefixCls.value}-group`;
      const groupCls = (0, _classNames.default)(groupPrefixCls, hashId.value, attrs.class, {
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
        [`${groupPrefixCls}-${shape}`]: shape,
        [`${groupPrefixCls}-${shape}-shadow`]: !trigger
      });
      const wrapperCls = (0, _classNames.default)(hashId.value, `${groupPrefixCls}-wrap`);
      const transitionProps = (0, _transition.getTransitionProps)(`${groupPrefixCls}-wrap`);
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": floatButtonGroupRef
      }, attrs), {}, {
        "class": groupCls
      }, hoverAction.value), [trigger && ['click', 'hover'].includes(trigger) ? (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_vue.Transition, transitionProps, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", {
          "class": wrapperCls
        }, [slots.default && slots.default()]), [[_vue.vShow, open.value]])]
      }), (0, _vue.createVNode)(_FloatButton.default, {
        "ref": floatButtonRef,
        "type": type,
        "shape": shape,
        "tooltip": tooltip,
        "description": description
      }, {
        icon: () => {
          var _a, _b;
          return open.value ? ((_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots)) || (0, _vue.createVNode)(_CloseOutlined.default, null, null) : ((_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots)) || (0, _vue.createVNode)(_FileTextOutlined.default, null, null);
        },
        tooltip: slots.tooltip,
        description: slots.description
      })]) : (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
var _default = exports.default = FloatButtonGroup;