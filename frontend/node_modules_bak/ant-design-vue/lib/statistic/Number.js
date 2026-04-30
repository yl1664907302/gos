"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
const StatisticNumber = props => {
  const {
    value,
    formatter,
    precision,
    decimalSeparator,
    groupSeparator = '',
    prefixCls
  } = props;
  let valueNode;
  if (typeof formatter === 'function') {
    // Customize formatter
    valueNode = formatter({
      value
    });
  } else {
    // Internal formatter
    const val = String(value);
    const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/);
    // Process if illegal number
    if (!cells) {
      valueNode = val;
    } else {
      const negative = cells[1];
      let int = cells[2] || '0';
      let decimal = cells[4] || '';
      int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator);
      if (typeof precision === 'number') {
        decimal = decimal.padEnd(precision, '0').slice(0, precision > 0 ? precision : 0);
      }
      if (decimal) {
        decimal = `${decimalSeparator}${decimal}`;
      }
      valueNode = [(0, _vue.createVNode)("span", {
        "key": "int",
        "class": `${prefixCls}-content-value-int`
      }, [negative, int]), decimal && (0, _vue.createVNode)("span", {
        "key": "decimal",
        "class": `${prefixCls}-content-value-decimal`
      }, [decimal])];
    }
  }
  return (0, _vue.createVNode)("span", {
    "class": `${prefixCls}-content-value`
  }, [valueNode]);
};
StatisticNumber.displayName = 'StatisticNumber';
var _default = exports.default = StatisticNumber;