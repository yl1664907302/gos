import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
export const skeletonTitleProps = () => ({
  prefixCls: String,
  width: {
    type: [Number, String]
  }
});
const SkeletonTitle = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'SkeletonTitle',
  props: skeletonTitleProps(),
  setup(props) {
    return () => {
      const {
        prefixCls,
        width
      } = props;
      const zWidth = typeof width === 'number' ? `${width}px` : width;
      return _createVNode("h3", {
        "class": prefixCls,
        "style": {
          width: zWidth
        }
      }, null);
    };
  }
});
export default SkeletonTitle;