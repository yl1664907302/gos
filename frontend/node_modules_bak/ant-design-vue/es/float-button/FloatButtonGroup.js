import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow, Fragment as _Fragment } from "vue";
import { defineComponent, ref, computed, watch, onBeforeUnmount, Transition } from 'vue';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import FileTextOutlined from "@ant-design/icons-vue/es/icons/FileTextOutlined";
import classNames from '../_util/classNames';
import { getTransitionProps } from '../_util/transition';
import FloatButton, { floatButtonPrefixCls } from './FloatButton';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useProvideFloatButtonGroupContext } from './context';
import { findDOMNode, initDefaultProps } from '../_util/props-util';
import { floatButtonGroupProps } from './interface';
import canUseDom from '../_util/canUseDom';
// CSSINJS
import useStyle from './style';
import useMergedState from '../_util/hooks/useMergedState';
const FloatButtonGroup = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AFloatButtonGroup',
  inheritAttrs: false,
  props: initDefaultProps(floatButtonGroupProps(), {
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
    } = useConfigInject(floatButtonPrefixCls, props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [open, setOpen] = useMergedState(false, {
      value: computed(() => props.open)
    });
    const floatButtonGroupRef = ref(null);
    const floatButtonRef = ref(null);
    useProvideFloatButtonGroupContext({
      shape: computed(() => props.shape)
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
    const hoverAction = computed(() => {
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
        if ((_b = findDOMNode(floatButtonRef.value)) === null || _b === void 0 ? void 0 : _b.contains(e.target)) {
          handleOpenChange();
        }
        return;
      }
      setOpen(false);
      emit('update:open', false);
      (_c = props.onOpenChange) === null || _c === void 0 ? void 0 : _c.call(props, false);
    };
    watch(computed(() => props.trigger), value => {
      if (!canUseDom()) {
        return;
      }
      document.removeEventListener('click', onClick);
      if (value === 'click') {
        document.addEventListener('click', onClick);
      }
    }, {
      immediate: true
    });
    onBeforeUnmount(() => {
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
      const groupCls = classNames(groupPrefixCls, hashId.value, attrs.class, {
        [`${groupPrefixCls}-rtl`]: direction.value === 'rtl',
        [`${groupPrefixCls}-${shape}`]: shape,
        [`${groupPrefixCls}-${shape}-shadow`]: !trigger
      });
      const wrapperCls = classNames(hashId.value, `${groupPrefixCls}-wrap`);
      const transitionProps = getTransitionProps(`${groupPrefixCls}-wrap`);
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({
        "ref": floatButtonGroupRef
      }, attrs), {}, {
        "class": groupCls
      }, hoverAction.value), [trigger && ['click', 'hover'].includes(trigger) ? _createVNode(_Fragment, null, [_createVNode(Transition, transitionProps, {
        default: () => [_withDirectives(_createVNode("div", {
          "class": wrapperCls
        }, [slots.default && slots.default()]), [[_vShow, open.value]])]
      }), _createVNode(FloatButton, {
        "ref": floatButtonRef,
        "type": type,
        "shape": shape,
        "tooltip": tooltip,
        "description": description
      }, {
        icon: () => {
          var _a, _b;
          return open.value ? ((_a = slots.closeIcon) === null || _a === void 0 ? void 0 : _a.call(slots)) || _createVNode(CloseOutlined, null, null) : ((_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots)) || _createVNode(FileTextOutlined, null, null);
        },
        tooltip: slots.tooltip,
        description: slots.description
      })]) : (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
export default FloatButtonGroup;