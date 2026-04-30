import _extends from "@babel/runtime/helpers/esm/extends";
import raf from '../../../_util/raf';
import { onMounted, reactive, ref } from 'vue';
export default function useFrameSetState(initial) {
  const frame = ref(null);
  const state = reactive(_extends({}, initial));
  const queue = ref([]);
  const setFrameState = newState => {
    if (frame.value === null) {
      queue.value = [];
      frame.value = raf(() => {
        let memoState;
        queue.value.forEach(queueState => {
          memoState = _extends(_extends({}, memoState), queueState);
        });
        _extends(state, memoState);
        frame.value = null;
      });
    }
    queue.value.push(newState);
  };
  onMounted(() => {
    frame.value && raf.cancel(frame.value);
  });
  return [state, setFrameState];
}