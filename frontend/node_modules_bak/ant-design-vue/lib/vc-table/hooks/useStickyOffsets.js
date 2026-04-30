"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
/**
 * Get sticky column offset width
 */
function useStickyOffsets(colWidthsRef, columnCountRef, directionRef) {
  const stickyOffsets = (0, _vue.computed)(() => {
    const leftOffsets = [];
    const rightOffsets = [];
    let left = 0;
    let right = 0;
    const colWidths = colWidthsRef.value;
    const columnCount = columnCountRef.value;
    const direction = directionRef.value;
    for (let start = 0; start < columnCount; start += 1) {
      if (direction === 'rtl') {
        // Left offset
        rightOffsets[start] = right;
        right += colWidths[start] || 0;
        // Right offset
        const end = columnCount - start - 1;
        leftOffsets[end] = left;
        left += colWidths[end] || 0;
      } else {
        // Left offset
        leftOffsets[start] = left;
        left += colWidths[start] || 0;
        // Right offset
        const end = columnCount - start - 1;
        rightOffsets[end] = right;
        right += colWidths[end] || 0;
      }
    }
    return {
      left: leftOffsets,
      right: rightOffsets
    };
  });
  return stickyOffsets;
}
var _default = exports.default = useStickyOffsets;