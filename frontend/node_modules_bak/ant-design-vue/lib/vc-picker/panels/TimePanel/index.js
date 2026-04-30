"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _TimeHeader = _interopRequireDefault(require("./TimeHeader"));
var _TimeBody = _interopRequireDefault(require("./TimeBody"));
var _uiUtil = require("../../utils/uiUtil");
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
const countBoolean = boolList => boolList.filter(bool => bool !== false).length;
function TimePanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    generateConfig,
    format = 'HH:mm:ss',
    prefixCls,
    active,
    operationRef,
    showHour,
    showMinute,
    showSecond,
    use12Hours = false,
    onSelect,
    value
  } = props;
  const panelPrefixCls = `${prefixCls}-time-panel`;
  const bodyOperationRef = (0, _vue.ref)();
  // ======================= Keyboard =======================
  const activeColumnIndex = (0, _vue.ref)(-1);
  const columnsCount = countBoolean([showHour, showMinute, showSecond, use12Hours]);
  operationRef.value = {
    onKeydown: event => (0, _uiUtil.createKeydownHandler)(event, {
      onLeftRight: diff => {
        activeColumnIndex.value = (activeColumnIndex.value + diff + columnsCount) % columnsCount;
      },
      onUpDown: diff => {
        if (activeColumnIndex.value === -1) {
          activeColumnIndex.value = 0;
        } else if (bodyOperationRef.value) {
          bodyOperationRef.value.onUpDown(diff);
        }
      },
      onEnter: () => {
        onSelect(value || generateConfig.getNow(), 'key');
        activeColumnIndex.value = -1;
      }
    }),
    onBlur: () => {
      activeColumnIndex.value = -1;
    }
  };
  return (0, _vue.createVNode)("div", {
    "class": (0, _classNames.default)(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: active
    })
  }, [(0, _vue.createVNode)(_TimeHeader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "format": format,
    "prefixCls": prefixCls
  }), null), (0, _vue.createVNode)(_TimeBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "activeColumnIndex": activeColumnIndex.value,
    "operationRef": bodyOperationRef
  }), null)]);
}
TimePanel.displayName = 'TimePanel';
TimePanel.inheritAttrs = false;
var _default = exports.default = TimePanel;