"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInjectIconContext = exports.useProvideIconContext = void 0;

var _vue = require("vue");

var contextKey = Symbol('iconContext');

var useProvideIconContext = function useProvideIconContext(props) {
  (0, _vue.provide)(contextKey, props);
  return props;
};

exports.useProvideIconContext = useProvideIconContext;

var useInjectIconContext = function useInjectIconContext() {
  return (0, _vue.inject)(contextKey, {
    prefixCls: (0, _vue.ref)('anticon'),
    rootClassName: (0, _vue.ref)(''),
    csp: (0, _vue.ref)()
  });
};

exports.useInjectIconContext = useInjectIconContext;