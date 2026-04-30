import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent, onUnmounted, ref } from 'vue';
import ResizeObserver from '../vc-resize-observer';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
const UNDEFINED = undefined;
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Item',
  props: {
    prefixCls: String,
    item: PropTypes.any,
    renderItem: Function,
    responsive: Boolean,
    itemKey: {
      type: [String, Number]
    },
    registerSize: Function,
    display: Boolean,
    order: Number,
    component: PropTypes.any,
    invalidate: Boolean
  },
  setup(props, _ref) {
    let {
      slots,
      expose
    } = _ref;
    const mergedHidden = computed(() => props.responsive && !props.display);
    const itemNodeRef = ref();
    expose({
      itemNodeRef
    });
    // ================================ Effect ================================
    function internalRegisterSize(width) {
      props.registerSize(props.itemKey, width);
    }
    onUnmounted(() => {
      internalRegisterSize(null);
    });
    return () => {
      var _a;
      const {
          prefixCls,
          invalidate,
          item,
          renderItem,
          responsive,
          registerSize,
          itemKey,
          display,
          order,
          component: Component = 'div'
        } = props,
        restProps = __rest(props, ["prefixCls", "invalidate", "item", "renderItem", "responsive", "registerSize", "itemKey", "display", "order", "component"]);
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
      // ================================ Render ================================
      const childNode = renderItem && item !== UNDEFINED ? renderItem(item) : children;
      let overflowStyle;
      if (!invalidate) {
        overflowStyle = {
          opacity: mergedHidden.value ? 0 : 1,
          height: mergedHidden.value ? 0 : UNDEFINED,
          overflowY: mergedHidden.value ? 'hidden' : UNDEFINED,
          order: responsive ? order : UNDEFINED,
          pointerEvents: mergedHidden.value ? 'none' : UNDEFINED,
          position: mergedHidden.value ? 'absolute' : UNDEFINED
        };
      }
      const overflowProps = {};
      if (mergedHidden.value) {
        overflowProps['aria-hidden'] = true;
      }
      // 使用 disabled  避免结构不一致 导致子组件 rerender
      return _createVNode(ResizeObserver, {
        "disabled": !responsive,
        "onResize": _ref2 => {
          let {
            offsetWidth
          } = _ref2;
          internalRegisterSize(offsetWidth);
        }
      }, {
        default: () => _createVNode(Component, _objectSpread(_objectSpread(_objectSpread({
          "class": classNames(!invalidate && prefixCls),
          "style": overflowStyle
        }, overflowProps), restProps), {}, {
          "ref": itemNodeRef
        }), {
          default: () => [childNode]
        })
      });
    };
  }
});