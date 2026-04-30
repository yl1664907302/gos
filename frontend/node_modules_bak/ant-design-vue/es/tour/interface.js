import _extends from "@babel/runtime/helpers/esm/extends";
import { tourProps as VCTourProps, tourStepProps as VCTourStepProps } from '../vc-tour';
export const tourProps = () => _extends(_extends({}, VCTourProps()), {
  steps: {
    type: Array
  },
  prefixCls: {
    type: String
  },
  current: {
    type: Number
  },
  type: {
    type: String
  },
  'onUpdate:current': Function
});
export const tourStepProps = () => _extends(_extends({}, VCTourStepProps()), {
  cover: {
    type: Object
  },
  nextButtonProps: {
    type: Object
  },
  prevButtonProps: {
    type: Object
  },
  current: {
    type: Number
  },
  type: {
    type: String
  }
});