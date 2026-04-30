import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { defineComponent, computed, ref, watch, Fragment } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import { booleanType, tuple } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useFlexGapSupport from '../_util/hooks/useFlexGapSupport';
import classNames from '../_util/classNames';
import Compact from './Compact';
import useStyle from './style';
const spaceSize = {
  small: 8,
  middle: 16,
  large: 24
};
export const spaceProps = () => ({
  prefixCls: String,
  size: {
    type: [String, Number, Array]
  },
  direction: PropTypes.oneOf(tuple('horizontal', 'vertical')).def('horizontal'),
  align: PropTypes.oneOf(tuple('start', 'end', 'center', 'baseline')),
  wrap: booleanType()
});
function getNumberSize(size) {
  return typeof size === 'string' ? spaceSize[size] : size || 0;
}
const Space = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASpace',
  inheritAttrs: false,
  props: spaceProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      space,
      direction: directionConfig
    } = useConfigInject('space', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const supportFlexGap = useFlexGapSupport();
    const size = computed(() => {
      var _a, _b, _c;
      return (_c = (_a = props.size) !== null && _a !== void 0 ? _a : (_b = space === null || space === void 0 ? void 0 : space.value) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : 'small';
    });
    const horizontalSize = ref();
    const verticalSize = ref();
    watch(size, () => {
      [horizontalSize.value, verticalSize.value] = (Array.isArray(size.value) ? size.value : [size.value, size.value]).map(item => getNumberSize(item));
    }, {
      immediate: true
    });
    const mergedAlign = computed(() => props.align === undefined && props.direction === 'horizontal' ? 'center' : props.align);
    const cn = computed(() => {
      return classNames(prefixCls.value, hashId.value, `${prefixCls.value}-${props.direction}`, {
        [`${prefixCls.value}-rtl`]: directionConfig.value === 'rtl',
        [`${prefixCls.value}-align-${mergedAlign.value}`]: mergedAlign.value
      });
    });
    const marginDirection = computed(() => directionConfig.value === 'rtl' ? 'marginLeft' : 'marginRight');
    const style = computed(() => {
      const gapStyle = {};
      if (supportFlexGap.value) {
        gapStyle.columnGap = `${horizontalSize.value}px`;
        gapStyle.rowGap = `${verticalSize.value}px`;
      }
      return _extends(_extends({}, gapStyle), props.wrap && {
        flexWrap: 'wrap',
        marginBottom: `${-verticalSize.value}px`
      });
    });
    return () => {
      var _a, _b;
      const {
        wrap,
        direction = 'horizontal'
      } = props;
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      const items = filterEmpty(children);
      const len = items.length;
      if (len === 0) {
        return null;
      }
      const split = (_b = slots.split) === null || _b === void 0 ? void 0 : _b.call(slots);
      const itemClassName = `${prefixCls.value}-item`;
      const horizontalSizeVal = horizontalSize.value;
      const latestIndex = len - 1;
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [cn.value, attrs.class],
        "style": [style.value, attrs.style]
      }), [items.map((child, index) => {
        let originIndex = children.indexOf(child);
        if (originIndex === -1) {
          originIndex = `$$space-${index}`;
        }
        let itemStyle = {};
        if (!supportFlexGap.value) {
          if (direction === 'vertical') {
            if (index < latestIndex) {
              itemStyle = {
                marginBottom: `${horizontalSizeVal / (split ? 2 : 1)}px`
              };
            }
          } else {
            itemStyle = _extends(_extends({}, index < latestIndex && {
              [marginDirection.value]: `${horizontalSizeVal / (split ? 2 : 1)}px`
            }), wrap && {
              paddingBottom: `${verticalSize.value}px`
            });
          }
        }
        return wrapSSR(_createVNode(_Fragment, {
          "key": originIndex
        }, [_createVNode("div", {
          "class": itemClassName,
          "style": itemStyle
        }, [child]), index < latestIndex && split && _createVNode("span", {
          "class": `${itemClassName}-split`,
          "style": itemStyle
        }, [split])]));
      })]);
    };
  }
});
Space.Compact = Compact;
Space.install = function (app) {
  app.component(Space.name, Space);
  app.component(Compact.name, Compact);
  return app;
};
export { Compact };
export default Space;