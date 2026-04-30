"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FooterComponents = void 0;
Object.defineProperty(exports, "SummaryCell", {
  enumerable: true,
  get: function () {
    return _Cell.default;
  }
});
Object.defineProperty(exports, "SummaryRow", {
  enumerable: true,
  get: function () {
    return _Row.default;
  }
});
exports.default = void 0;
var _vue = require("vue");
var _Summary = _interopRequireDefault(require("./Summary"));
var _Row = _interopRequireDefault(require("./Row"));
var _Cell = _interopRequireDefault(require("./Cell"));
var _SummaryContext = require("../context/SummaryContext");
var _TableContext = require("../context/TableContext");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'TableFooter',
  inheritAttrs: false,
  props: ['stickyOffsets', 'flattenColumns'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    (0, _SummaryContext.useProvideSummary)((0, _vue.reactive)({
      stickyOffsets: (0, _vue.toRef)(props, 'stickyOffsets'),
      flattenColumns: (0, _vue.toRef)(props, 'flattenColumns'),
      scrollColumnIndex: (0, _vue.computed)(() => {
        const lastColumnIndex = props.flattenColumns.length - 1;
        const scrollColumn = props.flattenColumns[lastColumnIndex];
        return (scrollColumn === null || scrollColumn === void 0 ? void 0 : scrollColumn.scrollbar) ? lastColumnIndex : null;
      })
    }));
    return () => {
      var _a;
      const {
        prefixCls
      } = tableContext;
      return (0, _vue.createVNode)("tfoot", {
        "class": `${prefixCls}-summary`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});
const FooterComponents = exports.FooterComponents = _Summary.default;