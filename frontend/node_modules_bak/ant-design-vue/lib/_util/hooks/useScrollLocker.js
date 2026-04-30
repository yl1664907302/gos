"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useScrollLocker;
exports.isBodyOverflowing = isBodyOverflowing;
var _vue = require("vue");
var _dynamicCSS = require("../../vc-util/Dom/dynamicCSS");
var _getScrollBarSize = _interopRequireDefault(require("../../_util/getScrollBarSize"));
var _canUseDom = _interopRequireDefault(require("../../_util/canUseDom"));
const UNIQUE_ID = `vc-util-locker-${Date.now()}`;
let uuid = 0;
/**../vc-util/Dom/dynam
 * Test usage export. Do not use in your production
 */
function isBodyOverflowing() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight) && window.innerWidth > document.body.offsetWidth;
}
function useScrollLocker(lock) {
  const mergedLock = (0, _vue.computed)(() => !!lock && !!lock.value);
  uuid += 1;
  const id = `${UNIQUE_ID}_${uuid}`;
  (0, _vue.watchEffect)(onClear => {
    if (!(0, _canUseDom.default)()) {
      return;
    }
    if (mergedLock.value) {
      const scrollbarSize = (0, _getScrollBarSize.default)();
      const isOverflow = isBodyOverflowing();
      (0, _dynamicCSS.updateCSS)(`
html body {
  overflow-y: hidden;
  ${isOverflow ? `width: calc(100% - ${scrollbarSize}px);` : ''}
}`, id);
    } else {
      (0, _dynamicCSS.removeCSS)(id);
    }
    onClear(() => {
      (0, _dynamicCSS.removeCSS)(id);
    });
  }, {
    flush: 'post'
  });
}