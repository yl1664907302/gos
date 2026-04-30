"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skeletonParagraphProps = exports.default = void 0;
var _vue = require("vue");
const skeletonParagraphProps = () => ({
  prefixCls: String,
  width: {
    type: [Number, String, Array]
  },
  rows: Number
});
exports.skeletonParagraphProps = skeletonParagraphProps;
const SkeletonParagraph = (0, _vue.defineComponent)({
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
        return (0, _vue.createVNode)("li", {
          "key": index,
          "style": {
            width: typeof width === 'number' ? `${width}px` : width
          }
        }, null);
      });
      return (0, _vue.createVNode)("ul", {
        "class": prefixCls
      }, [rowList]);
    };
  }
});
var _default = exports.default = SkeletonParagraph;