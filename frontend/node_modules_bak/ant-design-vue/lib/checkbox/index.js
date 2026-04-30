"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CheckboxGroup", {
  enumerable: true,
  get: function () {
    return _Group.default;
  }
});
Object.defineProperty(exports, "checkboxGroupProps", {
  enumerable: true,
  get: function () {
    return _interface.checkboxGroupProps;
  }
});
Object.defineProperty(exports, "checkboxProps", {
  enumerable: true,
  get: function () {
    return _interface.checkboxProps;
  }
});
exports.default = void 0;
var _Checkbox = _interopRequireDefault(require("./Checkbox"));
var _Group = _interopRequireDefault(require("./Group"));
var _interface = require("./interface");
_Checkbox.default.Group = _Group.default;
/* istanbul ignore next */
_Checkbox.default.install = function (app) {
  app.component(_Checkbox.default.name, _Checkbox.default);
  app.component(_Group.default.name, _Group.default);
  return app;
};
var _default = exports.default = _Checkbox.default;