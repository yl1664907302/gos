import { ref, watch } from 'vue';
export default function useTextValueMapping(_ref) {
  let {
    valueTexts,
    onTextChange
  } = _ref;
  const text = ref('');
  function triggerTextChange(value) {
    text.value = value;
    onTextChange(value);
  }
  function resetText() {
    text.value = valueTexts.value[0];
  }
  watch(() => [...valueTexts.value], function (cur) {
    let pre = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    if (cur.join('||') !== pre.join('||') && valueTexts.value.every(valText => valText !== text.value)) {
      resetText();
    }
  }, {
    immediate: true
  });
  return [text, triggerTextChange, resetText];
}