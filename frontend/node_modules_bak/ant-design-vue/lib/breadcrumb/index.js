"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "BreadcrumbItem", {
  enumerable: true,
  get: function () {
    return _BreadcrumbItem.default;
  }
});
Object.defineProperty(exports, "BreadcrumbSeparator", {
  enumerable: true,
  get: function () {
    return _BreadcrumbSeparator.default;
  }
});
exports.default = void 0;
var _Breadcrumb = _interopRequireDefault(require("./Breadcrumb"));
var _BreadcrumbItem = _interopRequireDefault(require("./BreadcrumbItem"));
var _BreadcrumbSeparator = _interopRequireDefault(require("./BreadcrumbSeparator"));
_Breadcrumb.default.Item = _BreadcrumbItem.default;
_Breadcrumb.default.Separator = _BreadcrumbSeparator.default;
/* istanbul ignore next */
_Breadcrumb.default.install = function (app) {
  app.component(_Breadcrumb.default.name, _Breadcrumb.default);
  app.component(_BreadcrumbItem.default.name, _BreadcrumbItem.default);
  app.component(_BreadcrumbSeparator.default.name, _BreadcrumbSeparator.default);
  return app;
};
var _default = exports.default = _Breadcrumb.default;