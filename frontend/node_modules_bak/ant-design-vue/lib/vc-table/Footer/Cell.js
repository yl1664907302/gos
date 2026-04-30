"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Cell = _interopRequireDefault(require("../Cell"));
var _SummaryContext = require("../context/SummaryContext");
var _TableContext = require("../context/TableContext");
var _fixUtil = require("../utils/fixUtil");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'ATableSummaryCell',
  props: ['index', 'colSpan', 'rowSpan', 'align'],
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    const summaryContext = (0, _SummaryContext.useInjectSummary)();
    return () => {
      const {
        index,
        colSpan = 1,
        rowSpan,
        align
      } = props;
      const {
        prefixCls,
        direction
      } = tableContext;
      const {
        scrollColumnIndex,
        stickyOffsets,
        flattenColumns
      } = summaryContext;
      const lastIndex = index + colSpan - 1;
      const mergedColSpan = lastIndex + 1 === scrollColumnIndex ? colSpan + 1 : colSpan;
      const fixedInfo = (0, _fixUtil.getCellFixedInfo)(index, index + mergedColSpan - 1, flattenColumns, stickyOffsets, direction);
      return (0, _vue.createVNode)(_Cell.default, (0, _objectSpread2.default)({
        "class": attrs.class,
        "index": index,
        "component": "td",
        "prefixCls": prefixCls,
        "record": null,
        "dataIndex": null,
        "align": align,
        "colSpan": mergedColSpan,
        "rowSpan": rowSpan,
        "customRender": () => {
          var _a;
          return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
        }
      }, fixedInfo), null);
    };
  }
});