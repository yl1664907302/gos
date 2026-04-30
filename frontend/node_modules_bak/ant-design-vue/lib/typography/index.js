"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TypographyLink", {
  enumerable: true,
  get: function () {
    return _Link.default;
  }
});
Object.defineProperty(exports, "TypographyParagraph", {
  enumerable: true,
  get: function () {
    return _Paragraph.default;
  }
});
Object.defineProperty(exports, "TypographyText", {
  enumerable: true,
  get: function () {
    return _Text.default;
  }
});
Object.defineProperty(exports, "TypographyTitle", {
  enumerable: true,
  get: function () {
    return _Title.default;
  }
});
exports.default = void 0;
var _Base = _interopRequireDefault(require("./Base"));
var _Link = _interopRequireDefault(require("./Link"));
var _Paragraph = _interopRequireDefault(require("./Paragraph"));
var _Text = _interopRequireDefault(require("./Text"));
var _Title = _interopRequireDefault(require("./Title"));
var _Typography = _interopRequireDefault(require("./Typography"));
_Typography.default.Text = _Text.default;
_Typography.default.Title = _Title.default;
_Typography.default.Paragraph = _Paragraph.default;
_Typography.default.Link = _Link.default;
_Typography.default.Base = _Base.default;
_Typography.default.install = function (app) {
  app.component(_Typography.default.name, _Typography.default);
  app.component(_Typography.default.Text.displayName, _Text.default);
  app.component(_Typography.default.Title.displayName, _Title.default);
  app.component(_Typography.default.Paragraph.displayName, _Paragraph.default);
  app.component(_Typography.default.Link.displayName, _Link.default);
  return app;
};
var _default = exports.default = _Typography.default;