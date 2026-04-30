import { createVNode as _createVNode } from "vue";
import classNames from '../_util/classNames';
export const skeletonElementProps = () => ({
  prefixCls: String,
  size: [String, Number],
  shape: String,
  active: {
    type: Boolean,
    default: undefined
  }
});
const Element = props => {
  const {
    prefixCls,
    size,
    shape
  } = props;
  const sizeCls = classNames({
    [`${prefixCls}-lg`]: size === 'large',
    [`${prefixCls}-sm`]: size === 'small'
  });
  const shapeCls = classNames({
    [`${prefixCls}-circle`]: shape === 'circle',
    [`${prefixCls}-square`]: shape === 'square',
    [`${prefixCls}-round`]: shape === 'round'
  });
  const sizeStyle = typeof size === 'number' ? {
    width: `${size}px`,
    height: `${size}px`,
    lineHeight: `${size}px`
  } : {};
  return _createVNode("span", {
    "class": classNames(prefixCls, sizeCls, shapeCls),
    "style": sizeStyle
  }, null);
};
Element.displayName = 'SkeletonElement';
export default Element;