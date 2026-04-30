"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.extractStyle = extractStyle;
var _vue = require("vue");
var _cssinjs = require("../cssinjs");
var antd = _interopRequireWildcard(require("../../components"));
var _serverRenderer = require("vue/server-renderer");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const blackList = ['ConfigProvider', 'Grid', 'Tour', 'SelectOptGroup', 'SelectOption', 'MentionsOption', 'TreeNode', 'TreeSelectNode', 'LocaleProvider'];
const pickerMap = {
  MonthPicker: 'month',
  WeekPicker: 'week',
  QuarterPicker: 'quarter'
};
const compChildNameMap = {
  MenuDivider: 'Menu',
  MenuItem: 'Menu',
  MenuItemGroup: 'Menu',
  SubMenu: 'Menu',
  TableColumn: 'Table',
  TableColumnGroup: 'Table',
  TableSummary: 'Table',
  TableSummaryRow: 'Table',
  TableSummaryCell: 'Table',
  TabPane: 'Tabs',
  TimelineItem: 'Timeline'
};
const defaultNode = () => (0, _vue.createVNode)(_vue.Fragment, null, [Object.keys(antd).filter(name => !blackList.includes(name) && name[0] === name[0].toUpperCase()).map(compName => {
  const Comp = antd[compName];
  if (compName === 'Dropdown') {
    return (0, _vue.createVNode)(Comp, {
      "key": compName,
      "menu": {
        items: []
      }
    }, {
      default: () => [(0, _vue.createVNode)("div", null, null)]
    });
  }
  if (compName === 'Anchor') {
    return (0, _vue.createVNode)(Comp, {
      "key": compName,
      "items": []
    }, null);
  }
  if (compName in pickerMap) {
    const Comp = antd['DatePicker'];
    const type = pickerMap[compName];
    return (0, _vue.createVNode)(Comp, {
      "key": compName,
      "picker": type
    }, null);
  }
  if (compName in compChildNameMap) {
    const ParentComp = antd[compChildNameMap[compName]];
    return (0, _vue.createVNode)(ParentComp, null, {
      default: () => [(0, _vue.createVNode)(Comp, null, null)]
    });
  }
  if (compName === 'QRCode' || compName === 'Segmented') {
    return (0, _vue.createVNode)(Comp, {
      "key": compName,
      "value": ''
    }, {
      default: () => [(0, _vue.createVNode)("div", null, null)]
    });
  }
  return (0, _vue.createVNode)(Comp, {
    "key": compName
  }, null);
})]);
function extractStyle(customTheme) {
  const cache = (0, _cssinjs.createCache)();
  (0, _serverRenderer.renderToString)((0, _vue.createVNode)(_cssinjs.StyleProvider, {
    "cache": cache
  }, {
    default: () => [customTheme ? customTheme(defaultNode()) : defaultNode()]
  }));
  // Grab style from cache
  const styleText = (0, _cssinjs.extractStyle)(cache, true);
  return styleText;
}