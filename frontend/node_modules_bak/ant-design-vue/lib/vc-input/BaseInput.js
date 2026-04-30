"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vnode = require("../_util/vnode");
var _inputProps = require("./inputProps");
var _commonUtils = require("./utils/commonUtils");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'BaseInput',
  inheritAttrs: false,
  props: (0, _inputProps.baseInputProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const containerRef = (0, _vue.ref)();
    const onInputMouseDown = e => {
      var _a;
      if ((_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.contains(e.target)) {
        const {
          triggerFocus
        } = props;
        triggerFocus === null || triggerFocus === void 0 ? void 0 : triggerFocus();
      }
    };
    const getClearIcon = () => {
      var _a;
      const {
        allowClear,
        value,
        disabled,
        readonly,
        handleReset,
        suffix = slots.suffix,
        prefixCls
      } = props;
      if (!allowClear) {
        return null;
      }
      const needClear = !disabled && !readonly && value;
      const className = `${prefixCls}-clear-icon`;
      const iconNode = ((_a = slots.clearIcon) === null || _a === void 0 ? void 0 : _a.call(slots)) || '*';
      return (0, _vue.createVNode)("span", {
        "onClick": handleReset,
        "onMousedown": e => e.preventDefault(),
        "class": (0, _classNames.default)({
          [`${className}-hidden`]: !needClear,
          [`${className}-has-suffix`]: !!suffix
        }, className),
        "role": "button",
        "tabindex": -1
      }, [iconNode]);
    };
    return () => {
      var _a, _b;
      const {
        focused,
        value,
        disabled,
        allowClear,
        readonly,
        hidden,
        prefixCls,
        prefix = (_a = slots.prefix) === null || _a === void 0 ? void 0 : _a.call(slots),
        suffix = (_b = slots.suffix) === null || _b === void 0 ? void 0 : _b.call(slots),
        addonAfter = slots.addonAfter,
        addonBefore = slots.addonBefore,
        inputElement,
        affixWrapperClassName,
        wrapperClassName,
        groupClassName
      } = props;
      let element = (0, _vnode.cloneElement)(inputElement, {
        value,
        hidden
      });
      // ================== Prefix & Suffix ================== //
      if ((0, _commonUtils.hasPrefixSuffix)({
        prefix,
        suffix,
        allowClear
      })) {
        const affixWrapperPrefixCls = `${prefixCls}-affix-wrapper`;
        const affixWrapperCls = (0, _classNames.default)(affixWrapperPrefixCls, {
          [`${affixWrapperPrefixCls}-disabled`]: disabled,
          [`${affixWrapperPrefixCls}-focused`]: focused,
          [`${affixWrapperPrefixCls}-readonly`]: readonly,
          [`${affixWrapperPrefixCls}-input-with-clear-btn`]: suffix && allowClear && value
        }, !(0, _commonUtils.hasAddon)({
          addonAfter,
          addonBefore
        }) && attrs.class, affixWrapperClassName);
        const suffixNode = (suffix || allowClear) && (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-suffix`
        }, [getClearIcon(), suffix]);
        element = (0, _vue.createVNode)("span", {
          "class": affixWrapperCls,
          "style": attrs.style,
          "hidden": !(0, _commonUtils.hasAddon)({
            addonAfter,
            addonBefore
          }) && hidden,
          "onMousedown": onInputMouseDown,
          "ref": containerRef
        }, [prefix && (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-prefix`
        }, [prefix]), (0, _vnode.cloneElement)(inputElement, {
          style: null,
          value,
          hidden: null
        }), suffixNode]);
      }
      // ================== Addon ================== //
      if ((0, _commonUtils.hasAddon)({
        addonAfter,
        addonBefore
      })) {
        const wrapperCls = `${prefixCls}-group`;
        const addonCls = `${wrapperCls}-addon`;
        const mergedWrapperClassName = (0, _classNames.default)(`${prefixCls}-wrapper`, wrapperCls, wrapperClassName);
        const mergedGroupClassName = (0, _classNames.default)(`${prefixCls}-group-wrapper`, attrs.class, groupClassName);
        // Need another wrapper for changing display:table to display:inline-block
        // and put style prop in wrapper
        return (0, _vue.createVNode)("span", {
          "class": mergedGroupClassName,
          "style": attrs.style,
          "hidden": hidden
        }, [(0, _vue.createVNode)("span", {
          "class": mergedWrapperClassName
        }, [addonBefore && (0, _vue.createVNode)("span", {
          "class": addonCls
        }, [addonBefore]), (0, _vnode.cloneElement)(element, {
          style: null,
          hidden: null
        }), addonAfter && (0, _vue.createVNode)("span", {
          "class": addonCls
        }, [addonAfter])])]);
      }
      return element;
    };
  }
});