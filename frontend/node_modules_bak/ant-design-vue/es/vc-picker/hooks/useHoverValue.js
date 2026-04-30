import raf from '../../_util/raf';
import { ref, onBeforeUnmount, watch } from 'vue';
import useValueTexts from './useValueTexts';
export default function useHoverValue(valueText, _ref) {
  let {
    formatList,
    generateConfig,
    locale
  } = _ref;
  const innerValue = ref(null);
  let rafId;
  function setValue(val) {
    let immediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    raf.cancel(rafId);
    if (immediately) {
      innerValue.value = val;
      return;
    }
    rafId = raf(() => {
      innerValue.value = val;
    });
  }
  const [, firstText] = useValueTexts(innerValue, {
    formatList,
    generateConfig,
    locale
  });
  function onEnter(date) {
    setValue(date);
  }
  function onLeave() {
    let immediately = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    setValue(null, immediately);
  }
  watch(valueText, () => {
    onLeave(true);
  });
  onBeforeUnmount(() => {
    raf.cancel(rafId);
  });
  return [firstText, onEnter, onLeave];
}