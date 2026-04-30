import { createVNode as _createVNode } from "vue";
import { defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import { baseInputProps } from './inputProps';
import { hasAddon, hasPrefixSuffix } from './utils/commonUtils';
export default defineComponent({
  name: 'BaseInput',
  inheritAttrs: false,
  props: baseInputProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const containerRef = ref();
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
      return _createVNode("span", {
        "onClick": handleReset,
        "onMousedown": e => e.preventDefault(),
        "class": classNames({
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
      let element = cloneElement(inputElement, {
        value,
        hidden
      });
      // ================== Prefix & Suffix ================== //
      if (hasPrefixSuffix({
        prefix,
        suffix,
        allowClear
      })) {
        const affixWrapperPrefixCls = `${prefixCls}-affix-wrapper`;
        const affixWrapperCls = classNames(affixWrapperPrefixCls, {
          [`${affixWrapperPrefixCls}-disabled`]: disabled,
          [`${affixWrapperPrefixCls}-focused`]: focused,
          [`${affixWrapperPrefixCls}-readonly`]: readonly,
          [`${affixWrapperPrefixCls}-input-with-clear-btn`]: suffix && allowClear && value
        }, !hasAddon({
          addonAfter,
          addonBefore
        }) && attrs.class, affixWrapperClassName);
        const suffixNode = (suffix || allowClear) && _createVNode("span", {
          "class": `${prefixCls}-suffix`
        }, [getClearIcon(), suffix]);
        element = _createVNode("span", {
          "class": affixWrapperCls,
          "style": attrs.style,
          "hidden": !hasAddon({
            addonAfter,
            addonBefore
          }) && hidden,
          "onMousedown": onInputMouseDown,
          "ref": containerRef
        }, [prefix && _createVNode("span", {
          "class": `${prefixCls}-prefix`
        }, [prefix]), cloneElement(inputElement, {
          style: null,
          value,
          hidden: null
        }), suffixNode]);
      }
      // ================== Addon ================== //
      if (hasAddon({
        addonAfter,
        addonBefore
      })) {
        const wrapperCls = `${prefixCls}-group`;
        const addonCls = `${wrapperCls}-addon`;
        const mergedWrapperClassName = classNames(`${prefixCls}-wrapper`, wrapperCls, wrapperClassName);
        const mergedGroupClassName = classNames(`${prefixCls}-group-wrapper`, attrs.class, groupClassName);
        // Need another wrapper for changing display:table to display:inline-block
        // and put style prop in wrapper
        return _createVNode("span", {
          "class": mergedGroupClassName,
          "style": attrs.style,
          "hidden": hidden
        }, [_createVNode("span", {
          "class": mergedWrapperClassName
        }, [addonBefore && _createVNode("span", {
          "class": addonCls
        }, [addonBefore]), cloneElement(element, {
          style: null,
          hidden: null
        }), addonAfter && _createVNode("span", {
          "class": addonCls
        }, [addonAfter])])]);
      }
      return element;
    };
  }
});