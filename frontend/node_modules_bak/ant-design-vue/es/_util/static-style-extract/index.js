import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
import { createCache, extractStyle as extStyle, StyleProvider } from '../cssinjs';
import * as antd from '../../components';
import { renderToString } from 'vue/server-renderer';
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
const defaultNode = () => _createVNode(_Fragment, null, [Object.keys(antd).filter(name => !blackList.includes(name) && name[0] === name[0].toUpperCase()).map(compName => {
  const Comp = antd[compName];
  if (compName === 'Dropdown') {
    return _createVNode(Comp, {
      "key": compName,
      "menu": {
        items: []
      }
    }, {
      default: () => [_createVNode("div", null, null)]
    });
  }
  if (compName === 'Anchor') {
    return _createVNode(Comp, {
      "key": compName,
      "items": []
    }, null);
  }
  if (compName in pickerMap) {
    const Comp = antd['DatePicker'];
    const type = pickerMap[compName];
    return _createVNode(Comp, {
      "key": compName,
      "picker": type
    }, null);
  }
  if (compName in compChildNameMap) {
    const ParentComp = antd[compChildNameMap[compName]];
    return _createVNode(ParentComp, null, {
      default: () => [_createVNode(Comp, null, null)]
    });
  }
  if (compName === 'QRCode' || compName === 'Segmented') {
    return _createVNode(Comp, {
      "key": compName,
      "value": ''
    }, {
      default: () => [_createVNode("div", null, null)]
    });
  }
  return _createVNode(Comp, {
    "key": compName
  }, null);
})]);
export function extractStyle(customTheme) {
  const cache = createCache();
  renderToString(_createVNode(StyleProvider, {
    "cache": cache
  }, {
    default: () => [customTheme ? customTheme(defaultNode()) : defaultNode()]
  }));
  // Grab style from cache
  const styleText = extStyle(cache, true);
  return styleText;
}