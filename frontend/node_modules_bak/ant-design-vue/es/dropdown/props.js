import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../_util/vue-types';
import buttonTypes from '../button/buttonTypes';
import { booleanType, eventType, objectType, someType } from '../_util/type';
const dropdownProps = () => ({
  arrow: someType([Boolean, Object]),
  trigger: {
    type: [Array, String]
  },
  menu: objectType(),
  overlay: PropTypes.any,
  /** @deprecated Please use `open` instead */
  visible: booleanType(),
  open: booleanType(),
  disabled: booleanType(),
  danger: booleanType(),
  autofocus: booleanType(),
  align: objectType(),
  getPopupContainer: Function,
  prefixCls: String,
  transitionName: String,
  placement: String,
  overlayClassName: String,
  overlayStyle: objectType(),
  forceRender: booleanType(),
  mouseEnterDelay: Number,
  mouseLeaveDelay: Number,
  openClassName: String,
  minOverlayWidthMatchTrigger: booleanType(),
  destroyPopupOnHide: booleanType(),
  /** @deprecated Please use `onOpenChange` instead */
  onVisibleChange: {
    type: Function
  },
  /** @deprecated Please use `onUpdate:open` instead */
  'onUpdate:visible': {
    type: Function
  },
  onOpenChange: {
    type: Function
  },
  'onUpdate:open': {
    type: Function
  }
});
const buttonTypesProps = buttonTypes();
const dropdownButtonProps = () => _extends(_extends({}, dropdownProps()), {
  type: buttonTypesProps.type,
  size: String,
  htmlType: buttonTypesProps.htmlType,
  href: String,
  disabled: booleanType(),
  prefixCls: String,
  icon: PropTypes.any,
  title: String,
  loading: buttonTypesProps.loading,
  onClick: eventType()
});
export { dropdownProps, dropdownButtonProps };
export default dropdownProps;