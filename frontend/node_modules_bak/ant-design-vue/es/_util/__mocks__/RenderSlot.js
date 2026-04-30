import { defineComponent } from 'vue';
import { customRenderSlot } from '../vnode';
export default defineComponent({
  name: 'RenderSlot',
  setup(_props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      return customRenderSlot(slots, 'default', {}, () => ['default value']);
    };
  }
});