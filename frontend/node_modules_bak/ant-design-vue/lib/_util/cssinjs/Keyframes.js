"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class Keyframe {
  constructor(name, style) {
    this._keyframe = true;
    this.name = name;
    this.style = style;
  }
  getName() {
    let hashId = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    return hashId ? `${hashId}-${this.name}` : this.name;
  }
}
var _default = exports.default = Keyframe;