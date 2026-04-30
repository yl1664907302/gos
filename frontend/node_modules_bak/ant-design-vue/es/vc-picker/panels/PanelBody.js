import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { useInjectPanel } from '../PanelContext';
import { getLastDay } from '../utils/timeUtil';
import { getCellDateDisabled } from '../utils/dateUtil';
import classNames from '../../_util/classNames';
import useMergeProps from '../hooks/useMergeProps';
function PanelBody(_props) {
  const {
    prefixCls,
    disabledDate,
    onSelect,
    picker,
    rowNum,
    colNum,
    prefixColumn,
    rowClassName,
    baseDate,
    getCellClassName,
    getCellText,
    getCellNode,
    getCellDate,
    generateConfig,
    titleCell,
    headerCells
  } = useMergeProps(_props);
  const {
    onDateMouseenter,
    onDateMouseleave,
    mode
  } = useInjectPanel();
  const cellPrefixCls = `${prefixCls}-cell`;
  // =============================== Body ===============================
  const rows = [];
  for (let i = 0; i < rowNum; i += 1) {
    const row = [];
    let rowStartDate;
    for (let j = 0; j < colNum; j += 1) {
      const offset = i * colNum + j;
      const currentDate = getCellDate(baseDate, offset);
      const disabled = getCellDateDisabled({
        cellDate: currentDate,
        mode: mode.value,
        disabledDate,
        generateConfig
      });
      if (j === 0) {
        rowStartDate = currentDate;
        if (prefixColumn) {
          row.push(prefixColumn(rowStartDate));
        }
      }
      const title = titleCell && titleCell(currentDate);
      row.push(_createVNode("td", {
        "key": j,
        "title": title,
        "class": classNames(cellPrefixCls, _extends({
          [`${cellPrefixCls}-disabled`]: disabled,
          [`${cellPrefixCls}-start`]: getCellText(currentDate) === 1 || picker === 'year' && Number(title) % 10 === 0,
          [`${cellPrefixCls}-end`]: title === getLastDay(generateConfig, currentDate) || picker === 'year' && Number(title) % 10 === 9
        }, getCellClassName(currentDate))),
        "onClick": e => {
          e.stopPropagation();
          if (!disabled) {
            onSelect(currentDate);
          }
        },
        "onMouseenter": () => {
          if (!disabled && onDateMouseenter) {
            onDateMouseenter(currentDate);
          }
        },
        "onMouseleave": () => {
          if (!disabled && onDateMouseleave) {
            onDateMouseleave(currentDate);
          }
        }
      }, [getCellNode ? getCellNode(currentDate) : _createVNode("div", {
        "class": `${cellPrefixCls}-inner`
      }, [getCellText(currentDate)])]));
    }
    rows.push(_createVNode("tr", {
      "key": i,
      "class": rowClassName && rowClassName(rowStartDate)
    }, [row]));
  }
  return _createVNode("div", {
    "class": `${prefixCls}-body`
  }, [_createVNode("table", {
    "class": `${prefixCls}-content`
  }, [headerCells && _createVNode("thead", null, [_createVNode("tr", null, [headerCells])]), _createVNode("tbody", null, [rows])])]);
}
PanelBody.displayName = 'PanelBody';
PanelBody.inheritAttrs = false;
export default PanelBody;