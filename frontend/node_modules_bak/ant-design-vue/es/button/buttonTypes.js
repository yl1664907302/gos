import PropTypes from '../_util/vue-types';
import { eventType } from '../_util/type';
export function convertLegacyProps(type) {
  if (type === 'danger') {
    return {
      danger: true
    };
  }
  return {
    type
  };
}
export const buttonProps = () => ({
  prefixCls: String,
  type: String,
  htmlType: {
    type: String,
    default: 'button'
  },
  shape: {
    type: String
  },
  size: {
    type: String
  },
  loading: {
    type: [Boolean, Object],
    default: () => false
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  ghost: {
    type: Boolean,
    default: undefined
  },
  block: {
    type: Boolean,
    default: undefined
  },
  danger: {
    type: Boolean,
    default: undefined
  },
  icon: PropTypes.any,
  href: String,
  target: String,
  title: String,
  onClick: eventType(),
  onMousedown: eventType()
});
export default buttonProps;