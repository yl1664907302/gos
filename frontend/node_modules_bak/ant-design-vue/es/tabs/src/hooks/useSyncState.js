import { ref } from 'vue';
export default function useSyncState(defaultState, onChange) {
  const stateRef = ref(defaultState);
  function setState(updater) {
    const newValue = typeof updater === 'function' ? updater(stateRef.value) : updater;
    if (newValue !== stateRef.value) {
      onChange(newValue, stateRef.value);
    }
    stateRef.value = newValue;
  }
  return [stateRef, setState];
}