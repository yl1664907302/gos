import { defineComponent } from 'vue';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Portal',
  inheritAttrs: false,
  props: ['getContainer'],
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});