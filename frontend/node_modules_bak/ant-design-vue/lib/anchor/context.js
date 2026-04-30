"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvideAnchor = exports.useInjectAnchor = exports.default = exports.AnchorContextKey = void 0;
var _vue = require("vue");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function noop() {}
const AnchorContextKey = exports.AnchorContextKey = Symbol('anchorContextKey');
const useProvideAnchor = state => {
  (0, _vue.provide)(AnchorContextKey, state);
};
exports.useProvideAnchor = useProvideAnchor;
const useInjectAnchor = () => {
  return (0, _vue.inject)(AnchorContextKey, {
    registerLink: noop,
    unregisterLink: noop,
    scrollTo: noop,
    activeLink: (0, _vue.computed)(() => ''),
    handleClick: noop,
    direction: (0, _vue.computed)(() => 'vertical')
  });
};
exports.useInjectAnchor = useInjectAnchor;
var _default = exports.default = useProvideAnchor;