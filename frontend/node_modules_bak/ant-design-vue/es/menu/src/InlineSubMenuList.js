import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow } from "vue";
import { computed, Transition, defineComponent, ref, watch } from 'vue';
import { useInjectMenu, MenuContextProvider } from './hooks/useMenuContext';
import SubMenuList from './SubMenuList';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'InlineSubMenuList',
  inheritAttrs: false,
  props: {
    id: String,
    open: Boolean,
    keyPath: Array
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const fixedMode = computed(() => 'inline');
    const {
      motion,
      mode,
      defaultMotions
    } = useInjectMenu();
    const sameModeRef = computed(() => mode.value === fixedMode.value);
    const destroy = ref(!sameModeRef.value);
    const mergedOpen = computed(() => sameModeRef.value ? props.open : false);
    // ================================= Effect =================================
    // Reset destroy state when mode change back
    watch(mode, () => {
      if (sameModeRef.value) {
        destroy.value = false;
      }
    }, {
      flush: 'post'
    });
    const mergedMotion = computed(() => {
      var _a, _b;
      const m = motion.value || ((_a = defaultMotions.value) === null || _a === void 0 ? void 0 : _a[fixedMode.value]) || ((_b = defaultMotions.value) === null || _b === void 0 ? void 0 : _b.other);
      const res = typeof m === 'function' ? m() : m;
      return _extends(_extends({}, res), {
        appear: props.keyPath.length <= 1
      });
    });
    return () => {
      var _a;
      if (destroy.value) {
        return null;
      }
      return _createVNode(MenuContextProvider, {
        "mode": fixedMode.value
      }, {
        default: () => [_createVNode(Transition, mergedMotion.value, {
          default: () => [_withDirectives(_createVNode(SubMenuList, {
            "id": props.id
          }, {
            default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
          }), [[_vShow, mergedOpen.value]])]
        })]
      });
    };
  }
});