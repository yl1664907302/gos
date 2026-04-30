import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import Trigger from '../../vc-trigger';
import { computed, defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue';
import { useInjectForceRender, useInjectMenu } from './hooks/useMenuContext';
import { placements, placementsRtl } from './placements';
import raf from '../../_util/raf';
import classNames from '../../_util/classNames';
import { getTransitionProps } from '../../_util/transition';
const popupPlacementMap = {
  horizontal: 'bottomLeft',
  vertical: 'rightTop',
  'vertical-left': 'rightTop',
  'vertical-right': 'leftTop'
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'PopupTrigger',
  inheritAttrs: false,
  props: {
    prefixCls: String,
    mode: String,
    visible: Boolean,
    // popup: React.ReactNode;
    popupClassName: String,
    popupOffset: Array,
    disabled: Boolean,
    onVisibleChange: Function
  },
  slots: Object,
  emits: ['visibleChange'],
  setup(props, _ref) {
    let {
      slots,
      emit
    } = _ref;
    const innerVisible = shallowRef(false);
    const {
      getPopupContainer,
      rtl,
      subMenuOpenDelay,
      subMenuCloseDelay,
      builtinPlacements,
      triggerSubMenuAction,
      forceSubMenuRender,
      motion,
      defaultMotions,
      rootClassName
    } = useInjectMenu();
    const forceRender = useInjectForceRender();
    const placement = computed(() => rtl.value ? _extends(_extends({}, placementsRtl), builtinPlacements.value) : _extends(_extends({}, placements), builtinPlacements.value));
    const popupPlacement = computed(() => popupPlacementMap[props.mode]);
    const visibleRef = shallowRef();
    watch(() => props.visible, visible => {
      raf.cancel(visibleRef.value);
      visibleRef.value = raf(() => {
        innerVisible.value = visible;
      });
    }, {
      immediate: true
    });
    onBeforeUnmount(() => {
      raf.cancel(visibleRef.value);
    });
    const onVisibleChange = visible => {
      emit('visibleChange', visible);
    };
    const mergedMotion = computed(() => {
      var _a, _b;
      const m = motion.value || ((_a = defaultMotions.value) === null || _a === void 0 ? void 0 : _a[props.mode]) || ((_b = defaultMotions.value) === null || _b === void 0 ? void 0 : _b.other);
      const res = typeof m === 'function' ? m() : m;
      return res ? getTransitionProps(res.name, {
        css: true
      }) : undefined;
    });
    return () => {
      const {
        prefixCls,
        popupClassName,
        mode,
        popupOffset,
        disabled
      } = props;
      return _createVNode(Trigger, {
        "prefixCls": prefixCls,
        "popupClassName": classNames(`${prefixCls}-popup`, {
          [`${prefixCls}-rtl`]: rtl.value
        }, popupClassName, rootClassName.value),
        "stretch": mode === 'horizontal' ? 'minWidth' : null,
        "getPopupContainer": getPopupContainer.value,
        "builtinPlacements": placement.value,
        "popupPlacement": popupPlacement.value,
        "popupVisible": innerVisible.value,
        "popupAlign": popupOffset && {
          offset: popupOffset
        },
        "action": disabled ? [] : [triggerSubMenuAction.value],
        "mouseEnterDelay": subMenuOpenDelay.value,
        "mouseLeaveDelay": subMenuCloseDelay.value,
        "onPopupVisibleChange": onVisibleChange,
        "forceRender": forceRender || forceSubMenuRender.value,
        "popupAnimation": mergedMotion.value
      }, {
        popup: slots.popup,
        default: slots.default
      });
    };
  }
});