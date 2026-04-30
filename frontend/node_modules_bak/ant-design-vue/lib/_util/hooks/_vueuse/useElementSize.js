"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useElementSize = useElementSize;
var _vue = require("vue");
var _useResizeObserver = require("./useResizeObserver");
var _unrefElement = require("./unrefElement");
/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 * @param target
 * @param callback
 * @param options
 */
function useElementSize(target) {
  let initialSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    width: 0,
    height: 0
  };
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
    box = 'content-box'
  } = options;
  const width = (0, _vue.shallowRef)(initialSize.width);
  const height = (0, _vue.shallowRef)(initialSize.height);
  (0, _useResizeObserver.useResizeObserver)(target, _ref => {
    let [entry] = _ref;
    const boxSize = box === 'border-box' ? entry.borderBoxSize : box === 'content-box' ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
    if (boxSize) {
      width.value = boxSize.reduce((acc, _ref2) => {
        let {
          inlineSize
        } = _ref2;
        return acc + inlineSize;
      }, 0);
      height.value = boxSize.reduce((acc, _ref3) => {
        let {
          blockSize
        } = _ref3;
        return acc + blockSize;
      }, 0);
    } else {
      // fallback
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }
  }, options);
  (0, _vue.watch)(() => (0, _unrefElement.unrefElement)(target), ele => {
    width.value = ele ? initialSize.width : 0;
    height.value = ele ? initialSize.height : 0;
  });
  return {
    width,
    height
  };
}