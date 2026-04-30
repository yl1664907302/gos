import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import { defineComponent, onMounted, ref } from 'vue';
import VCResizeObserver from '../../vc-resize-observer';
export default defineComponent({
  name: 'MeasureCell',
  props: ['columnKey'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const tdRef = ref();
    onMounted(() => {
      if (tdRef.value) {
        emit('columnResize', props.columnKey, tdRef.value.offsetWidth);
      }
    });
    return () => {
      return _createVNode(VCResizeObserver, {
        "onResize": _ref2 => {
          let {
            offsetWidth
          } = _ref2;
          emit('columnResize', props.columnKey, offsetWidth);
        }
      }, {
        default: () => [_createVNode("td", {
          "ref": tdRef,
          "style": {
            padding: 0,
            border: 0,
            height: 0
          }
        }, [_createVNode("div", {
          "style": {
            height: 0,
            overflow: 'hidden'
          }
        }, [_createTextVNode("\xA0")])])]
      });
    };
  }
});