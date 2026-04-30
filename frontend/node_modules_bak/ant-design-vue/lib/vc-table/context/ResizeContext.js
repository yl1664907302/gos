"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideResize = exports.useInjectResize = exports.ResizeContextKey = void 0;
var _vue = require("vue");
const ResizeContextKey = exports.ResizeContextKey = Symbol('ResizeContextProps');
const useProvideResize = props => {
  (0, _vue.provide)(ResizeContextKey, props);
};
exports.useProvideResize = useProvideResize;
const useInjectResize = () => {
  return (0, _vue.inject)(ResizeContextKey, {
    onColumnResize: () => {}
  });
};
exports.useInjectResize = useInjectResize;