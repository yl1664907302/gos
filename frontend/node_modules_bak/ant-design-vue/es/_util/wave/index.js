import { computed, defineComponent, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import isVisible from '../../vc-util/Dom/isVisible';
import classNames from '../classNames';
import { findDOMNode } from '../props-util';
import useStyle from './style';
import useWave from './useWave';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Wave',
  props: {
    disabled: Boolean
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const instance = getCurrentInstance();
    const {
      prefixCls,
      wave
    } = useConfigInject('wave', props);
    // ============================== Style ===============================
    const [, hashId] = useStyle(prefixCls);
    // =============================== Wave ===============================
    const showWave = useWave(computed(() => classNames(prefixCls.value, hashId.value)), wave);
    let onClick;
    const clear = () => {
      const node = findDOMNode(instance);
      node.removeEventListener('click', onClick, true);
    };
    onMounted(() => {
      watch(() => props.disabled, () => {
        clear();
        nextTick(() => {
          const node = findDOMNode(instance);
          node === null || node === void 0 ? void 0 : node.removeEventListener('click', onClick, true);
          if (!node || node.nodeType !== 1 || props.disabled) {
            return;
          }
          // Click handler
          onClick = e => {
            // Fix radio button click twice
            if (e.target.tagName === 'INPUT' || !isVisible(e.target) ||
            // No need wave
            !node.getAttribute || node.getAttribute('disabled') || node.disabled || node.className.includes('disabled') || node.className.includes('-leave')) {
              return;
            }
            showWave();
          };
          // Bind events
          node.addEventListener('click', onClick, true);
        });
      }, {
        immediate: true,
        flush: 'post'
      });
    });
    onBeforeUnmount(() => {
      clear();
    });
    return () => {
      var _a;
      // ============================== Render ==============================
      const children = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)[0];
      return children;
    };
  }
});