"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertStyles = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var InsertStyles = (0, _vue.defineComponent)({
  name: 'InsertStyles',
  setup: function setup() {
    (0, _utils.useInsertStyles)();
    return function () {
      return null;
    };
  }
});
exports.InsertStyles = InsertStyles;