"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultWindow = exports.defaultNavigator = exports.defaultLocation = exports.defaultDocument = void 0;
var _is = require("./is");
const defaultWindow = exports.defaultWindow = _is.isClient ? window : undefined;
const defaultDocument = exports.defaultDocument = _is.isClient ? window.document : undefined;
const defaultNavigator = exports.defaultNavigator = _is.isClient ? window.navigator : undefined;
const defaultLocation = exports.defaultLocation = _is.isClient ? window.location : undefined;