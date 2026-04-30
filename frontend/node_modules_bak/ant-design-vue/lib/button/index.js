"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ButtonGroup", {
  enumerable: true,
  get: function () {
    return _buttonGroup.default;
  }
});
exports.default = void 0;
var _button = _interopRequireDefault(require("./button"));
var _buttonGroup = _interopRequireDefault(require("./button-group"));
_button.default.Group = _buttonGroup.default;
/* istanbul ignore next */
_button.default.install = function (app) {
  app.component(_button.default.name, _button.default);
  app.component(_buttonGroup.default.name, _buttonGroup.default);
  return app;
};
var _default = exports.default = _button.default;