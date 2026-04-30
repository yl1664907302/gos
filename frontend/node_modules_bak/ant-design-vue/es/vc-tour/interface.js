import _extends from "@babel/runtime/helpers/esm/extends";
import { someType, stringType, objectType, functionType } from '../_util/type';
export const tourStepInfo = () => ({
  arrow: someType([Boolean, Object]),
  target: someType([String, Function, Object]),
  title: someType([String, Object]),
  description: someType([String, Object]),
  placement: stringType(),
  mask: someType([Object, Boolean], true),
  className: {
    type: String
  },
  style: objectType(),
  scrollIntoViewOptions: someType([Boolean, Object])
});
export const tourStepProps = () => _extends(_extends({}, tourStepInfo()), {
  prefixCls: {
    type: String
  },
  total: {
    type: Number
  },
  current: {
    type: Number
  },
  onClose: functionType(),
  onFinish: functionType(),
  renderPanel: functionType(),
  onPrev: functionType(),
  onNext: functionType()
});