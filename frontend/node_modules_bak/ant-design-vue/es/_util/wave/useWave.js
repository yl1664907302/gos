import { onBeforeUnmount, getCurrentInstance } from 'vue';
import { findDOMNode } from '../props-util';
import showWaveEffect from './WaveEffect';
export default function useWave(className, wave) {
  const instance = getCurrentInstance();
  let stopWave;
  function showWave() {
    var _a;
    const node = findDOMNode(instance);
    stopWave === null || stopWave === void 0 ? void 0 : stopWave();
    if (((_a = wave === null || wave === void 0 ? void 0 : wave.value) === null || _a === void 0 ? void 0 : _a.disabled) || !node) {
      return;
    }
    stopWave = showWaveEffect(node, className.value);
  }
  onBeforeUnmount(() => {
    stopWave === null || stopWave === void 0 ? void 0 : stopWave();
  });
  return showWave;
}