"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideRow = exports.useInjectRow = exports.default = exports.RowContextKey = void 0;
var _vue = require("vue");
const RowContextKey = exports.RowContextKey = Symbol('rowContextKey');
const useProvideRow = state => {
  (0, _vue.provide)(RowContextKey, state);
};
exports.useProvideRow = useProvideRow;
const useInjectRow = () => {
  return (0, _vue.inject)(RowContextKey, {
    gutter: (0, _vue.computed)(() => undefined),
    wrap: (0, _vue.computed)(() => undefined),
    supportFlexGap: (0, _vue.computed)(() => undefined)
  });
};
exports.useInjectRow = useInjectRow;
var _default = exports.default = useProvideRow;