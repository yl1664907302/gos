"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "DropdownButton", {
  enumerable: true,
  get: function () {
    return _dropdownButton.default;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "dropdownButtonProps", {
  enumerable: true,
  get: function () {
    return _props.dropdownButtonProps;
  }
});
Object.defineProperty(exports, "dropdownProps", {
  enumerable: true,
  get: function () {
    return _props.dropdownProps;
  }
});
var _dropdown = _interopRequireDefault(require("./dropdown"));
var _dropdownButton = _interopRequireDefault(require("./dropdown-button"));
var _props = require("./props");
_dropdown.default.Button = _dropdownButton.default;
/* istanbul ignore next */
_dropdown.default.install = function (app) {
  app.component(_dropdown.default.name, _dropdown.default);
  app.component(_dropdownButton.default.name, _dropdownButton.default);
  return app;
};
var _default = exports.default = _dropdown.default;