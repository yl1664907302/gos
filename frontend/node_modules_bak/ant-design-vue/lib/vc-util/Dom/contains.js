"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = contains;
function contains(root, n) {
  if (!root) {
    return false;
  }
  // Use native if support
  if (root.contains) {
    return root.contains(n);
  }
  return false;
}