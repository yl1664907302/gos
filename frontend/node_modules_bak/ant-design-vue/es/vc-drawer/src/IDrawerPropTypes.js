import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../../_util/vue-types';
import { arrayType, objectType, functionType } from '../../_util/type';
const props = () => ({
  prefixCls: String,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: {
    type: Object,
    default: undefined
  },
  class: String,
  rootClassName: String,
  rootStyle: objectType(),
  placement: {
    type: String
  },
  wrapperClassName: String,
  level: {
    type: [String, Array]
  },
  levelMove: {
    type: [Number, Function, Array]
  },
  duration: String,
  ease: String,
  showMask: {
    type: Boolean,
    default: undefined
  },
  maskClosable: {
    type: Boolean,
    default: undefined
  },
  maskStyle: {
    type: Object,
    default: undefined
  },
  afterVisibleChange: Function,
  keyboard: {
    type: Boolean,
    default: undefined
  },
  contentWrapperStyle: arrayType(),
  autofocus: {
    type: Boolean,
    default: undefined
  },
  open: {
    type: Boolean,
    default: undefined
  },
  // Motion
  motion: functionType(),
  maskMotion: objectType()
});
const drawerProps = () => _extends(_extends({}, props()), {
  forceRender: {
    type: Boolean,
    default: undefined
  },
  getContainer: PropTypes.oneOfType([PropTypes.string, PropTypes.func, PropTypes.object, PropTypes.looseBool])
});
const drawerChildProps = () => _extends(_extends({}, props()), {
  getContainer: Function,
  getOpenCount: Function,
  scrollLocker: PropTypes.any,
  inline: Boolean
});
export { drawerProps, drawerChildProps };