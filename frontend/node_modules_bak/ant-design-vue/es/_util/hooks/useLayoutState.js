import { onBeforeUnmount, shallowRef } from 'vue';
import raf from '../raf';
/**
 * Execute code before next frame but async
 */
export function useLayoutState(defaultState) {
  const stateRef = shallowRef(defaultState);
  let tempState = stateRef.value;
  let updateBatchRef = [];
  const rafRef = shallowRef();
  function setFrameState(updater) {
    raf.cancel(rafRef.value);
    updateBatchRef.push(updater);
    rafRef.value = raf(() => {
      const prevBatch = updateBatchRef;
      // const prevState = stateRef.value;
      updateBatchRef = [];
      prevBatch.forEach(batchUpdater => {
        tempState = batchUpdater(tempState);
      });
      // if (tempState !== stateRef.value) {
      stateRef.value = tempState;
      // }
    });
  }
  onBeforeUnmount(() => {
    raf.cancel(rafRef.value);
  });
  return [stateRef, setFrameState];
}