"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAvatarProviderContext = exports.useAvatarInjectContext = void 0;
var _vue = require("vue");
const AvatarContextKey = Symbol('AvatarContextKey');
const useAvatarInjectContext = () => {
  return (0, _vue.inject)(AvatarContextKey, {});
};
exports.useAvatarInjectContext = useAvatarInjectContext;
const useAvatarProviderContext = context => {
  return (0, _vue.provide)(AvatarContextKey, context);
};
exports.useAvatarProviderContext = useAvatarProviderContext;