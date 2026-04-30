import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
export const skeletonParagraphProps = () => ({
  prefixCls: String,
  width: {
    type: [Number, String, Array]
  },
  rows: Number
});
const SkeletonParagraph = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'SkeletonParagraph',
  props: skeletonParagraphProps(),
  setup(props) {
    const getWidth = index => {
      const {
        width,
        rows = 2
      } = props;
      if (Array.isArray(width)) {
        return width[index];
      }
      // last paragraph
      if (rows - 1 === index) {
        return width;
      }
      return undefined;
    };
    return () => {
      const {
        prefixCls,
        rows
      } = props;
      const rowList = [...Array(rows)].map((_, index) => {
        const width = getWidth(index);
        return _createVNode("li", {
          "key": index,
          "style": {
            width: typeof width === 'number' ? `${width}px` : width
          }
        }, null);
      });
      return _createVNode("ul", {
        "class": prefixCls
      }, [rowList]);
    };
  }
});
export default SkeletonParagraph;