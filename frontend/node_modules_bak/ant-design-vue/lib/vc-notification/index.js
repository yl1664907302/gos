"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "useNotification", {
  enumerable: true,
  get: function () {
    return _useNotification.default;
  }
});
var _Notification = _interopRequireDefault(require("./Notification"));
var _useNotification = _interopRequireDefault(require("./useNotification"));
var _default = exports.default = _Notification.default;