"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideBody = exports.useInjectBody = exports.BodyContextKey = void 0;
var _vue = require("vue");
const BodyContextKey = exports.BodyContextKey = Symbol('BodyContextProps');
const useProvideBody = props => {
  (0, _vue.provide)(BodyContextKey, props);
};
exports.useProvideBody = useProvideBody;
const useInjectBody = () => {
  return (0, _vue.inject)(BodyContextKey, {});
};
exports.useInjectBody = useInjectBody;