import _extends from "@babel/runtime/helpers/esm/extends";
import omit from '../_util/omit';
import { eventType } from '../_util/type';
import { inputProps as vcInputProps } from '../vc-input/inputProps';
export const inputDefaultValue = Symbol();
const inputProps = () => {
  return omit(vcInputProps(), ['wrapperClassName', 'groupClassName', 'inputClassName', 'affixWrapperClassName']);
};
export default inputProps;
const textAreaProps = () => _extends(_extends({}, omit(inputProps(), ['prefix', 'addonBefore', 'addonAfter', 'suffix'])), {
  rows: Number,
  autosize: {
    type: [Boolean, Object],
    default: undefined
  },
  autoSize: {
    type: [Boolean, Object],
    default: undefined
  },
  onResize: {
    type: Function
  },
  onCompositionstart: eventType(),
  onCompositionend: eventType(),
  valueModifiers: Object
});
export { textAreaProps };