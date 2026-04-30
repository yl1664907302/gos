"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideTable = exports.useInjectTable = exports.TableContextKey = void 0;
var _vue = require("vue");
const TableContextKey = exports.TableContextKey = Symbol('TableContextProps');
const useProvideTable = props => {
  (0, _vue.provide)(TableContextKey, props);
};
exports.useProvideTable = useProvideTable;
const useInjectTable = () => {
  return (0, _vue.inject)(TableContextKey, {});
};
exports.useInjectTable = useInjectTable;