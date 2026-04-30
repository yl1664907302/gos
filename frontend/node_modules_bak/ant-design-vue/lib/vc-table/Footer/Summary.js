"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _TableContext = require("../context/TableContext");
let indexGuid = 0;
const Summary = (0, _vue.defineComponent)({
  name: 'TableSummary',
  props: ['fixed'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    const uniKey = `table-summary-uni-key-${++indexGuid}`;
    const fixed = (0, _vue.computed)(() => props.fixed === '' || props.fixed);
    (0, _vue.watchEffect)(() => {
      tableContext.summaryCollect(uniKey, fixed.value);
    });
    (0, _vue.onBeforeUnmount)(() => {
      tableContext.summaryCollect(uniKey, false);
    });
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
var _default = exports.default = Summary;