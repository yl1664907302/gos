"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function useProdHMR() {
  return false;
}
let webpackHMR = false;
function useDevHMR() {
  return webpackHMR;
}
var _default = exports.default = process.env.NODE_ENV === 'production' ? useProdHMR : useDevHMR; // Webpack `module.hot.accept` do not support any deps update trigger
// We have to hack handler to force mark as HRM
if (process.env.NODE_ENV !== 'production' && typeof module !== 'undefined' && module && module.hot && typeof window !== 'undefined') {
  const win = window;
  if (typeof win.webpackHotUpdate === 'function') {
    const originWebpackHotUpdate = win.webpackHotUpdate;
    win.webpackHotUpdate = function () {
      webpackHMR = true;
      setTimeout(() => {
        webpackHMR = false;
      }, 0);
      return originWebpackHotUpdate(...arguments);
    };
  }
}