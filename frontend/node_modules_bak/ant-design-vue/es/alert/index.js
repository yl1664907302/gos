import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode } from "vue";
import { computed, defineComponent, shallowRef, Transition } from 'vue';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import CheckCircleOutlined from "@ant-design/icons-vue/es/icons/CheckCircleOutlined";
import ExclamationCircleOutlined from "@ant-design/icons-vue/es/icons/ExclamationCircleOutlined";
import InfoCircleOutlined from "@ant-design/icons-vue/es/icons/InfoCircleOutlined";
import CloseCircleOutlined from "@ant-design/icons-vue/es/icons/CloseCircleOutlined";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import InfoCircleFilled from "@ant-design/icons-vue/es/icons/InfoCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { getTransitionProps } from '../_util/transition';
import { isValidElement } from '../_util/props-util';
import { tuple, withInstall } from '../_util/type';
import { cloneElement } from '../_util/vnode';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
const iconMapFilled = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled
};
const iconMapOutlined = {
  success: CheckCircleOutlined,
  info: InfoCircleOutlined,
  error: CloseCircleOutlined,
  warning: ExclamationCircleOutlined
};
const AlertTypes = tuple('success', 'info', 'warning', 'error');
export const alertProps = () => ({
  /**
   * Type of Alert styles, options: `success`, `info`, `warning`, `error`
   */
  type: PropTypes.oneOf(AlertTypes),
  /** Whether Alert can be closed */
  closable: {
    type: Boolean,
    default: undefined
  },
  /** Close text to show */
  closeText: PropTypes.any,
  /** Content of Alert */
  message: PropTypes.any,
  /** Additional content of Alert */
  description: PropTypes.any,
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
  icon: PropTypes.any,
  closeIcon: PropTypes.any,
  onClose: Function
});
const Alert = defineComponent({
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
    } = useConfigInject('alert', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const closing = shallowRef(false);
    const closed = shallowRef(false);
    const alertNode = shallowRef();
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
    const mergedType = computed(() => {
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
    const motionStyle = shallowRef({});
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
      const alertCls = classNames(prefixClsValue, {
        [`${prefixClsValue}-${mergedType.value}`]: true,
        [`${prefixClsValue}-closing`]: closing.value,
        [`${prefixClsValue}-with-description`]: !!description,
        [`${prefixClsValue}-no-icon`]: !showIcon,
        [`${prefixClsValue}-banner`]: !!banner,
        [`${prefixClsValue}-closable`]: closable,
        [`${prefixClsValue}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      });
      const closeIcon = closable ? _createVNode("button", {
        "type": "button",
        "onClick": handleClose,
        "class": `${prefixClsValue}-close-icon`,
        "tabindex": 0
      }, [closeText ? _createVNode("span", {
        "class": `${prefixClsValue}-close-text`
      }, [closeText]) : customCloseIcon === undefined ? _createVNode(CloseOutlined, null, null) : customCloseIcon]) : null;
      const iconNode = icon && (isValidElement(icon) ? cloneElement(icon, {
        class: `${prefixClsValue}-icon`
      }) : _createVNode("span", {
        "class": `${prefixClsValue}-icon`
      }, [icon])) || _createVNode(IconType, {
        "class": `${prefixClsValue}-icon`
      }, null);
      const transitionProps = getTransitionProps(`${prefixClsValue}-motion`, {
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
      return wrapSSR(closed.value ? null : _createVNode(Transition, transitionProps, {
        default: () => [_withDirectives(_createVNode("div", _objectSpread(_objectSpread({
          "role": "alert"
        }, attrs), {}, {
          "style": [attrs.style, motionStyle.value],
          "class": [attrs.class, alertCls],
          "data-show": !closing.value,
          "ref": alertNode
        }), [showIcon ? iconNode : null, _createVNode("div", {
          "class": `${prefixClsValue}-content`
        }, [message ? _createVNode("div", {
          "class": `${prefixClsValue}-message`
        }, [message]) : null, description ? _createVNode("div", {
          "class": `${prefixClsValue}-description`
        }, [description]) : null]), action ? _createVNode("div", {
          "class": `${prefixClsValue}-action`
        }, [action]) : null, closeIcon]), [[_vShow, !closing.value]])]
      }));
    };
  }
});
export default withInstall(Alert);