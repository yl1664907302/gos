import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { shallowRef, defineComponent, watchEffect, computed } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import Wave from '../_util/wave';
import { isPresetColor, isPresetStatusColor } from '../_util/colors';
import { eventType } from '../_util/type';
import CheckableTag from './CheckableTag';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import warning from '../_util/warning';
import useStyle from './style';
export const tagProps = () => ({
  prefixCls: String,
  color: {
    type: String
  },
  closable: {
    type: Boolean,
    default: false
  },
  closeIcon: PropTypes.any,
  /** @deprecated `visible` will be removed in next major version. */
  visible: {
    type: Boolean,
    default: undefined
  },
  onClose: {
    type: Function
  },
  onClick: eventType(),
  'onUpdate:visible': Function,
  icon: PropTypes.any,
  bordered: {
    type: Boolean,
    default: true
  }
});
const Tag = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATag',
  inheritAttrs: false,
  props: tagProps(),
  // emits: ['update:visible', 'close'],
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('tag', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const visible = shallowRef(true);
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      warning(props.visible === undefined, 'Tag', '`visible` is deprecated, please use `<Tag v-show="visible" />` instead.');
    }
    watchEffect(() => {
      if (props.visible !== undefined) {
        visible.value = props.visible;
      }
    });
    const handleCloseClick = e => {
      e.stopPropagation();
      emit('update:visible', false);
      emit('close', e);
      if (e.defaultPrevented) {
        return;
      }
      if (props.visible === undefined) {
        visible.value = false;
      }
    };
    // const isPresetColor = computed(() => {
    //   const { color } = props;
    //   if (!color) {
    //     return false;
    //   }
    //   return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
    // });
    const isInternalColor = computed(() => isPresetColor(props.color) || isPresetStatusColor(props.color));
    const tagClassName = computed(() => classNames(prefixCls.value, hashId.value, {
      [`${prefixCls.value}-${props.color}`]: isInternalColor.value,
      [`${prefixCls.value}-has-color`]: props.color && !isInternalColor.value,
      [`${prefixCls.value}-hidden`]: !visible.value,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-borderless`]: !props.bordered
    }));
    const handleClick = e => {
      emit('click', e);
    };
    return () => {
      var _a, _b, _c;
      const {
        icon = (_a = slots.icon) === null || _a === void 0 ? void 0 : _a.call(slots),
        color,
        closeIcon = (_b = slots.closeIcon) === null || _b === void 0 ? void 0 : _b.call(slots),
        closable = false
      } = props;
      const renderCloseIcon = () => {
        if (closable) {
          return closeIcon ? _createVNode("span", {
            "class": `${prefixCls.value}-close-icon`,
            "onClick": handleCloseClick
          }, [closeIcon]) : _createVNode(CloseOutlined, {
            "class": `${prefixCls.value}-close-icon`,
            "onClick": handleCloseClick
          }, null);
        }
        return null;
      };
      const tagStyle = {
        backgroundColor: color && !isInternalColor.value ? color : undefined
      };
      const iconNode = icon || null;
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      const kids = iconNode ? _createVNode(_Fragment, null, [iconNode, _createVNode("span", null, [children])]) : children;
      const isNeedWave = props.onClick !== undefined;
      const tagNode = _createVNode("span", _objectSpread(_objectSpread({}, attrs), {}, {
        "onClick": handleClick,
        "class": [tagClassName.value, attrs.class],
        "style": [tagStyle, attrs.style]
      }), [kids, renderCloseIcon()]);
      return wrapSSR(isNeedWave ? _createVNode(Wave, null, {
        default: () => [tagNode]
      }) : tagNode);
    };
  }
});
Tag.CheckableTag = CheckableTag;
Tag.install = function (app) {
  app.component(Tag.name, Tag);
  app.component(CheckableTag.name, CheckableTag);
  return app;
};
export { CheckableTag };
export default Tag;