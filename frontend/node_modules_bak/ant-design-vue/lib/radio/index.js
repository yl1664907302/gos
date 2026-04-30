"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Button", {
  enumerable: true,
  get: function () {
    return _RadioButton.default;
  }
});
Object.defineProperty(exports, "Group", {
  enumerable: true,
  get: function () {
    return _Group.default;
  }
});
Object.defineProperty(exports, "RadioButton", {
  enumerable: true,
  get: function () {
    return _RadioButton.default;
  }
});
Object.defineProperty(exports, "RadioGroup", {
  enumerable: true,
  get: function () {
    return _Group.default;
  }
});
exports.default = void 0;
var _Radio = _interopRequireDefault(require("./Radio"));
var _Group = _interopRequireDefault(require("./Group"));
var _RadioButton = _interopRequireDefault(require("./RadioButton"));
_Radio.default.Group = _Group.default;
_Radio.default.Button = _RadioButton.default;
/* istanbul ignore next */
_Radio.default.install = function (app) {
  app.component(_Radio.default.name, _Radio.default);
  app.component(_Radio.default.Group.name, _Radio.default.Group);
  app.component(_Radio.default.Button.name, _Radio.default.Button);
  return app;
};
var _default = exports.default = _Radio.default;