import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import omit from '../_util/omit';
import Base, { baseProps } from './Base';
export const paragraphProps = () => omit(baseProps(), ['component']);
const Paragraph = (props, _ref) => {
  let {
    slots,
    attrs
  } = _ref;
  const paragraphProps = _extends(_extends(_extends({}, props), {
    component: 'div'
  }), attrs);
  return _createVNode(Base, paragraphProps, slots);
};
Paragraph.displayName = 'ATypographyParagraph';
Paragraph.inheritAttrs = false;
Paragraph.props = paragraphProps();
export default Paragraph;