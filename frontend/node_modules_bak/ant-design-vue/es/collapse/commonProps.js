import { booleanType, someType, stringType, functionType } from '../_util/type';
import PropTypes from '../_util/vue-types';
const collapseProps = () => ({
  prefixCls: String,
  activeKey: someType([Array, Number, String]),
  defaultActiveKey: someType([Array, Number, String]),
  accordion: booleanType(),
  destroyInactivePanel: booleanType(),
  bordered: booleanType(),
  expandIcon: functionType(),
  openAnimation: PropTypes.object,
  expandIconPosition: stringType(),
  collapsible: stringType(),
  ghost: booleanType(),
  onChange: functionType(),
  'onUpdate:activeKey': functionType()
});
const collapsePanelProps = () => ({
  openAnimation: PropTypes.object,
  prefixCls: String,
  header: PropTypes.any,
  headerClass: String,
  showArrow: booleanType(),
  isActive: booleanType(),
  destroyInactivePanel: booleanType(),
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: booleanType(),
  accordion: booleanType(),
  forceRender: booleanType(),
  expandIcon: functionType(),
  extra: PropTypes.any,
  panelKey: someType(),
  collapsible: stringType(),
  role: String,
  onItemClick: functionType()
});
export { collapseProps, collapsePanelProps };