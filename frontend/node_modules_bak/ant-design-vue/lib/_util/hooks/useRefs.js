"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
const useRefs = () => {
  const refs = (0, _vue.ref)(new Map());
  const setRef = key => el => {
    refs.value.set(key, el);
  };
  (0, _vue.onBeforeUpdate)(() => {
    refs.value = new Map();
  });
  return [setRef, refs];
};
var _default = exports.default = useRefs;