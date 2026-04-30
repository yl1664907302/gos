"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvidePanel = exports.useInjectPanel = exports.default = void 0;
var _vue = require("vue");
const PanelContextKey = Symbol('PanelContextProps');
const useProvidePanel = props => {
  (0, _vue.provide)(PanelContextKey, props);
};
exports.useProvidePanel = useProvidePanel;
const useInjectPanel = () => {
  return (0, _vue.inject)(PanelContextKey, {});
};
exports.useInjectPanel = useInjectPanel;
var _default = exports.default = PanelContextKey;