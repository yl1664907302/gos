"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skeletonTitleProps = exports.default = void 0;
var _vue = require("vue");
const skeletonTitleProps = () => ({
  prefixCls: String,
  width: {
    type: [Number, String]
  }
});
exports.skeletonTitleProps = skeletonTitleProps;
const SkeletonTitle = (0, _vue.defineComponent)({
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
      return (0, _vue.createVNode)("h3", {
        "class": prefixCls,
        "style": {
          width: zWidth
        }
      }, null);
    };
  }
});
var _default = exports.default = SkeletonTitle;