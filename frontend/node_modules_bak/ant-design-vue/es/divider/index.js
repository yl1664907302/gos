import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { flattenChildren } from '../_util/props-util';
import { computed, defineComponent } from 'vue';
import { withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
export const dividerProps = () => ({
  prefixCls: String,
  type: {
    type: String,
    default: 'horizontal'
  },
  dashed: {
    type: Boolean,
    default: false
  },
  orientation: {
    type: String,
    default: 'center'
  },
  plain: {
    type: Boolean,
    default: false
  },
  orientationMargin: [String, Number]
});
const Divider = defineComponent({
  name: 'ADivider',
  inheritAttrs: false,
  compatConfig: {
    MODE: 3
  },
  props: dividerProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls: prefixClsRef,
      direction
    } = useConfigInject('divider', props);
    const [wrapSSR, hashId] = useStyle(prefixClsRef);
    const hasCustomMarginLeft = computed(() => props.orientation === 'left' && props.orientationMargin != null);
    const hasCustomMarginRight = computed(() => props.orientation === 'right' && props.orientationMargin != null);
    const classString = computed(() => {
      const {
        type,
        dashed,
        plain
      } = props;
      const prefixCls = prefixClsRef.value;
      return {
        [prefixCls]: true,
        [hashId.value]: !!hashId.value,
        [`${prefixCls}-${type}`]: true,
        [`${prefixCls}-dashed`]: !!dashed,
        [`${prefixCls}-plain`]: !!plain,
        [`${prefixCls}-rtl`]: direction.value === 'rtl',
        [`${prefixCls}-no-default-orientation-margin-left`]: hasCustomMarginLeft.value,
        [`${prefixCls}-no-default-orientation-margin-right`]: hasCustomMarginRight.value
      };
    });
    const innerStyle = computed(() => {
      const marginValue = typeof props.orientationMargin === 'number' ? `${props.orientationMargin}px` : props.orientationMargin;
      return _extends(_extends({}, hasCustomMarginLeft.value && {
        marginLeft: marginValue
      }), hasCustomMarginRight.value && {
        marginRight: marginValue
      });
    });
    const orientationPrefix = computed(() => props.orientation.length > 0 ? '-' + props.orientation : props.orientation);
    return () => {
      var _a;
      const children = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [classString.value, children.length ? `${prefixClsRef.value}-with-text ${prefixClsRef.value}-with-text${orientationPrefix.value}` : '', attrs.class],
        "role": "separator"
      }), [children.length ? _createVNode("span", {
        "class": `${prefixClsRef.value}-inner-text`,
        "style": innerStyle.value
      }, [children]) : null]));
    };
  }
});
export default withInstall(Divider);