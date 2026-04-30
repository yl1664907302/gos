"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideExpandedRow = exports.useInjectExpandedRow = exports.ExpandedRowContextKey = void 0;
var _vue = require("vue");
const ExpandedRowContextKey = exports.ExpandedRowContextKey = Symbol('ExpandedRowProps');
const useProvideExpandedRow = props => {
  (0, _vue.provide)(ExpandedRowContextKey, props);
};
exports.useProvideExpandedRow = useProvideExpandedRow;
const useInjectExpandedRow = () => {
  return (0, _vue.inject)(ExpandedRowContextKey, {});
};
exports.useInjectExpandedRow = useInjectExpandedRow;