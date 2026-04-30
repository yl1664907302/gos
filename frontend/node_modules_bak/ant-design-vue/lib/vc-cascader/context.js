"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideCascader = exports.useInjectCascader = void 0;
var _vue = require("vue");
const CascaderContextKey = Symbol('CascaderContextKey');
const useProvideCascader = props => {
  (0, _vue.provide)(CascaderContextKey, props);
};
exports.useProvideCascader = useProvideCascader;
const useInjectCascader = () => {
  return (0, _vue.inject)(CascaderContextKey);
};
exports.useInjectCascader = useInjectCascader;