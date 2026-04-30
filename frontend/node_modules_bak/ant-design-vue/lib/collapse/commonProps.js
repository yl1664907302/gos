"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.collapseProps = exports.collapsePanelProps = void 0;
var _type = require("../_util/type");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
const collapseProps = () => ({
  prefixCls: String,
  activeKey: (0, _type.someType)([Array, Number, String]),
  defaultActiveKey: (0, _type.someType)([Array, Number, String]),
  accordion: (0, _type.booleanType)(),
  destroyInactivePanel: (0, _type.booleanType)(),
  bordered: (0, _type.booleanType)(),
  expandIcon: (0, _type.functionType)(),
  openAnimation: _vueTypes.default.object,
  expandIconPosition: (0, _type.stringType)(),
  collapsible: (0, _type.stringType)(),
  ghost: (0, _type.booleanType)(),
  onChange: (0, _type.functionType)(),
  'onUpdate:activeKey': (0, _type.functionType)()
});
exports.collapseProps = collapseProps;
const collapsePanelProps = () => ({
  openAnimation: _vueTypes.default.object,
  prefixCls: String,
  header: _vueTypes.default.any,
  headerClass: String,
  showArrow: (0, _type.booleanType)(),
  isActive: (0, _type.booleanType)(),
  destroyInactivePanel: (0, _type.booleanType)(),
  /** @deprecated Use `collapsible="disabled"` instead */
  disabled: (0, _type.booleanType)(),
  accordion: (0, _type.booleanType)(),
  forceRender: (0, _type.booleanType)(),
  expandIcon: (0, _type.functionType)(),
  extra: _vueTypes.default.any,
  panelKey: (0, _type.someType)(),
  collapsible: (0, _type.stringType)(),
  role: String,
  onItemClick: (0, _type.functionType)()
});
exports.collapsePanelProps = collapsePanelProps;