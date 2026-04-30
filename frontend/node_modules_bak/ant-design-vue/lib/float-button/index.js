"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BackTop", {
  enumerable: true,
  get: function () {
    return _BackTop.default;
  }
});
Object.defineProperty(exports, "FloatButtonGroup", {
  enumerable: true,
  get: function () {
    return _FloatButtonGroup.default;
  }
});
exports.default = void 0;
var _FloatButton = _interopRequireDefault(require("./FloatButton"));
var _FloatButtonGroup = _interopRequireDefault(require("./FloatButtonGroup"));
var _BackTop = _interopRequireDefault(require("./BackTop"));
_FloatButton.default.Group = _FloatButtonGroup.default;
_FloatButton.default.BackTop = _BackTop.default;
/* istanbul ignore next */
_FloatButton.default.install = function (app) {
  app.component(_FloatButton.default.name, _FloatButton.default);
  app.component(_FloatButtonGroup.default.name, _FloatButtonGroup.default);
  app.component(_BackTop.default.name, _BackTop.default);
  return app;
};
var _default = exports.default = _FloatButton.default;