"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DECADE_UNIT_DIFF = exports.DECADE_DISTANCE_COUNT = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _DecadeHeader = _interopRequireDefault(require("./DecadeHeader"));
var _DecadeBody = _interopRequireWildcard(require("./DecadeBody"));
var _uiUtil = require("../../utils/uiUtil");
var _useMergeProps = _interopRequireDefault(require("../../hooks/useMergeProps"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const DECADE_UNIT_DIFF = exports.DECADE_UNIT_DIFF = 10;
const DECADE_DISTANCE_COUNT = exports.DECADE_DISTANCE_COUNT = DECADE_UNIT_DIFF * 10;
function DecadePanel(_props) {
  const props = (0, _useMergeProps.default)(_props);
  const {
    prefixCls,
    onViewDateChange,
    generateConfig,
    viewDate,
    operationRef,
    onSelect,
    onPanelChange
  } = props;
  const panelPrefixCls = `${prefixCls}-decade-panel`;
  // ======================= Keyboard =======================
  operationRef.value = {
    onKeydown: event => (0, _uiUtil.createKeydownHandler)(event, {
      onLeftRight: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF), 'key');
      },
      onCtrlLeftRight: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT), 'key');
      },
      onUpDown: diff => {
        onSelect(generateConfig.addYear(viewDate, diff * DECADE_UNIT_DIFF * _DecadeBody.DECADE_COL_COUNT), 'key');
      },
      onEnter: () => {
        onPanelChange('year', viewDate);
      }
    })
  };
  // ==================== View Operation ====================
  const onDecadesChange = diff => {
    const newDate = generateConfig.addYear(viewDate, diff * DECADE_DISTANCE_COUNT);
    onViewDateChange(newDate);
    onPanelChange(null, newDate);
  };
  const onInternalSelect = date => {
    onSelect(date, 'mouse');
    onPanelChange('year', date);
  };
  return (0, _vue.createVNode)("div", {
    "class": panelPrefixCls
  }, [(0, _vue.createVNode)(_DecadeHeader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "onPrevDecades": () => {
      onDecadesChange(-1);
    },
    "onNextDecades": () => {
      onDecadesChange(1);
    }
  }), null), (0, _vue.createVNode)(_DecadeBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
    "prefixCls": prefixCls,
    "onSelect": onInternalSelect
  }), null)]);
}
DecadePanel.displayName = 'DecadePanel';
DecadePanel.inheritAttrs = false;
var _default = exports.default = DecadePanel;