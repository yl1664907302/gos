import _extends from "@babel/runtime/helpers/esm/extends";
import { objectType, stringType } from '../_util/type';
export const qrProps = () => {
  return {
    size: {
      type: Number,
      default: 160
    },
    value: {
      type: String,
      required: true
    },
    type: stringType('canvas'),
    color: String,
    bgColor: String,
    includeMargin: Boolean,
    imageSettings: objectType()
  };
};
export const qrcodeProps = () => {
  return _extends(_extends({}, qrProps()), {
    errorLevel: stringType('M'),
    icon: String,
    iconSize: {
      type: Number,
      default: 40
    },
    status: stringType('active'),
    bordered: {
      type: Boolean,
      default: true
    }
  });
};