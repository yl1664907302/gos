import { onBeforeUnmount, onMounted } from 'vue';
export default function useSelectTriggerControl(refs, open, triggerOpen) {
  function onGlobalMouseDown(event) {
    var _a, _b, _c;
    let target = event.target;
    if (target.shadowRoot && event.composed) {
      target = event.composedPath()[0] || target;
    }
    const elements = [(_a = refs[0]) === null || _a === void 0 ? void 0 : _a.value, (_c = (_b = refs[1]) === null || _b === void 0 ? void 0 : _b.value) === null || _c === void 0 ? void 0 : _c.getPopupElement()];
    if (open.value && elements.every(element => element && !element.contains(target) && element !== target)) {
      // Should trigger close
      triggerOpen(false);
    }
  }
  onMounted(() => {
    window.addEventListener('mousedown', onGlobalMouseDown);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('mousedown', onGlobalMouseDown);
  });
}