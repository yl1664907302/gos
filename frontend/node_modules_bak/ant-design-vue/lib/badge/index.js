"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BadgeRibbon", {
  enumerable: true,
  get: function () {
    return _Ribbon.default;
  }
});
exports.default = void 0;
var _Badge = _interopRequireDefault(require("./Badge"));
var _Ribbon = _interopRequireDefault(require("./Ribbon"));
_Badge.default.install = function (app) {
  app.component(_Badge.default.name, _Badge.default);
  app.component(_Ribbon.default.name, _Ribbon.default);
  return app;
};
var _default = exports.default = _Badge.default;