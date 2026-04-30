"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useMutationObserver = useMutationObserver;
var _tryOnScopeDispose = require("./tryOnScopeDispose");
var _vue = require("vue");
var _unrefElement = require("./unrefElement");
var _useSupported = require("./useSupported");
var _configurable = require("./_configurable");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
/**
 * Watch for changes being made to the DOM tree.
 *
 * @see https://vueuse.org/useMutationObserver
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver MutationObserver MDN
 * @param target
 * @param callback
 * @param options
 */
function useMutationObserver(target, callback) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
      window = _configurable.defaultWindow
    } = options,
    mutationOptions = __rest(options, ["window"]);
  let observer;
  const isSupported = (0, _useSupported.useSupported)(() => window && 'MutationObserver' in window);
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = undefined;
    }
  };
  const stopWatch = (0, _vue.watch)(() => (0, _unrefElement.unrefElement)(target), el => {
    cleanup();
    if (isSupported.value && window && el) {
      observer = new MutationObserver(callback);
      observer.observe(el, mutationOptions);
    }
  }, {
    immediate: true
  });
  const stop = () => {
    cleanup();
    stopWatch();
  };
  (0, _tryOnScopeDispose.tryOnScopeDispose)(stop);
  return {
    isSupported,
    stop
  };
}