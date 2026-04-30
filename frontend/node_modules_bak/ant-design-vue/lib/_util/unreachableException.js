"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class UnreachableException {
  constructor(value) {
    this.error = new Error(`unreachable case: ${JSON.stringify(value)}`);
  }
}
exports.default = UnreachableException;