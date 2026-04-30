import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
const Filter = (_ref, _ref2) => {
  let {
    height,
    offset,
    prefixCls,
    onInnerResize
  } = _ref;
  let {
    slots
  } = _ref2;
  var _a;
  let outerStyle = {};
  let innerStyle = {
    display: 'flex',
    flexDirection: 'column'
  };
  if (offset !== undefined) {
    outerStyle = {
      height: `${height}px`,
      position: 'relative',
      overflow: 'hidden'
    };
    innerStyle = _extends(_extends({}, innerStyle), {
      transform: `translateY(${offset}px)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0
    });
  }
  return _createVNode("div", {
    "style": outerStyle
  }, [_createVNode(ResizeObserver, {
    "onResize": _ref3 => {
      let {
        offsetHeight
      } = _ref3;
      if (offsetHeight && onInnerResize) {
        onInnerResize();
      }
    }
  }, {
    default: () => [_createVNode("div", {
      "style": innerStyle,
      "class": classNames({
        [`${prefixCls}-holder-inner`]: prefixCls
      })
    }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]
  })]);
};
Filter.displayName = 'Filter';
Filter.inheritAttrs = false;
Filter.props = {
  prefixCls: String,
  /** Virtual filler height. Should be `count * itemMinHeight` */
  height: Number,
  /** Set offset of visible items. Should be the top of start item position */
  offset: Number,
  onInnerResize: Function
};
export default Filter;