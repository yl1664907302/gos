"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useSticky;
var _canUseDom = _interopRequireDefault(require("../../_util/canUseDom"));
var _vue = require("vue");
// fix ssr render
const defaultContainer = (0, _canUseDom.default)() ? window : null;
/** Sticky header hooks */
function useSticky(stickyRef, prefixClsRef) {
  return (0, _vue.computed)(() => {
    const {
      offsetHeader = 0,
      offsetSummary = 0,
      offsetScroll = 0,
      getContainer = () => defaultContainer
    } = typeof stickyRef.value === 'object' ? stickyRef.value : {};
    const container = getContainer() || defaultContainer;
    const isSticky = !!stickyRef.value;
    return {
      isSticky,
      stickyClassName: isSticky ? `${prefixClsRef.value}-sticky-holder` : '',
      offsetHeader,
      offsetSummary,
      offsetScroll,
      container
    };
  });
}