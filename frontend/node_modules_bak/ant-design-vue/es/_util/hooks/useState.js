import { ref } from 'vue';
export default function useState(defaultStateValue) {
  const initValue = typeof defaultStateValue === 'function' ? defaultStateValue() : defaultStateValue;
  const innerValue = ref(initValue);
  function triggerChange(newValue) {
    innerValue.value = newValue;
  }
  return [innerValue, triggerChange];
}