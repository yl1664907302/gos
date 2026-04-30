"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CardGrid", {
  enumerable: true,
  get: function () {
    return _Grid.default;
  }
});
Object.defineProperty(exports, "CardMeta", {
  enumerable: true,
  get: function () {
    return _Meta.default;
  }
});
exports.default = void 0;
var _Card = _interopRequireDefault(require("./Card"));
var _Meta = _interopRequireDefault(require("./Meta"));
var _Grid = _interopRequireDefault(require("./Grid"));
_Card.default.Meta = _Meta.default;
_Card.default.Grid = _Grid.default;
/* istanbul ignore next */
_Card.default.install = function (app) {
  app.component(_Card.default.name, _Card.default);
  app.component(_Meta.default.name, _Meta.default);
  app.component(_Grid.default.name, _Grid.default);
  return app;
};
var _default = exports.default = _Card.default;