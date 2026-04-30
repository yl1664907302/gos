"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useValueTexts;
var _vue = require("vue");
var _useMemo = _interopRequireDefault(require("../../_util/hooks/useMemo"));
var _shallowequal = _interopRequireDefault(require("../../_util/shallowequal"));
var _dateUtil = require("../utils/dateUtil");
function useValueTexts(value, _ref) {
  let {
    formatList,
    generateConfig,
    locale
  } = _ref;
  const texts = (0, _useMemo.default)(() => {
    if (!value.value) {
      return [[''], ''];
    }
    // We will convert data format back to first format
    let firstValueText = '';
    const fullValueTexts = [];
    for (let i = 0; i < formatList.value.length; i += 1) {
      const format = formatList.value[i];
      const formatStr = (0, _dateUtil.formatValue)(value.value, {
        generateConfig: generateConfig.value,
        locale: locale.value,
        format
      });
      fullValueTexts.push(formatStr);
      if (i === 0) {
        firstValueText = formatStr;
      }
    }
    return [fullValueTexts, firstValueText];
  }, [value, formatList], (next, prev) => prev[0] !== next[0] || !(0, _shallowequal.default)(prev[1], next[1]));
  const fullValueTexts = (0, _vue.computed)(() => texts.value[0]);
  const firstValueText = (0, _vue.computed)(() => texts.value[1]);
  return [fullValueTexts, firstValueText];
}