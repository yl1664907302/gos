import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent, toRefs } from 'vue';
import VCTour from '../vc-tour';
import classNames from '../_util/classNames';
import TourPanel from './panelRender';
import { tourProps } from './interface';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { withInstall } from '../_util/type';
import useMergedType from './useMergedType';
// CSSINJS
import useStyle from './style';
import getPlacements from '../_util/placements';
const Tour = defineComponent({
  name: 'ATour',
  inheritAttrs: false,
  props: tourProps(),
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      current,
      type,
      steps,
      defaultCurrent
    } = toRefs(props);
    const {
      prefixCls,
      direction
    } = useConfigInject('tour', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const {
      currentMergedType,
      updateInnerCurrent
    } = useMergedType({
      defaultType: type,
      steps,
      current,
      defaultCurrent
    });
    return () => {
      const {
          steps,
          current,
          type,
          rootClassName
        } = props,
        restProps = __rest(props, ["steps", "current", "type", "rootClassName"]);
      const customClassName = classNames({
        [`${prefixCls.value}-primary`]: currentMergedType.value === 'primary',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, hashId.value, rootClassName);
      const mergedRenderPanel = (stepProps, stepCurrent) => {
        return _createVNode(TourPanel, _objectSpread(_objectSpread({}, stepProps), {}, {
          "type": type,
          "current": stepCurrent
        }), {
          indicatorsRender: slots.indicatorsRender
        });
      };
      const onStepChange = stepCurrent => {
        updateInnerCurrent(stepCurrent);
        emit('update:current', stepCurrent);
        emit('change', stepCurrent);
      };
      const builtinPlacements = computed(() => getPlacements({
        arrowPointAtCenter: true,
        autoAdjustOverflow: true
      }));
      return wrapSSR(_createVNode(VCTour, _objectSpread(_objectSpread(_objectSpread({}, attrs), restProps), {}, {
        "rootClassName": customClassName,
        "prefixCls": prefixCls.value,
        "current": current,
        "defaultCurrent": props.defaultCurrent,
        "animated": true,
        "renderPanel": mergedRenderPanel,
        "onChange": onStepChange,
        "steps": steps,
        "builtinPlacements": builtinPlacements.value
      }), null));
    };
  }
});
export default withInstall(Tour);