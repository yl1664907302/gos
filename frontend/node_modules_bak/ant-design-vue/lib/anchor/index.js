"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "AnchorLink", {
  enumerable: true,
  get: function () {
    return _AnchorLink.default;
  }
});
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function () {
    return _AnchorLink.default;
  }
});
exports.default = void 0;
var _Anchor = _interopRequireDefault(require("./Anchor"));
var _AnchorLink = _interopRequireDefault(require("./AnchorLink"));
_Anchor.default.Link = _AnchorLink.default;
/* istanbul ignore next */
_Anchor.default.install = function (app) {
  app.component(_Anchor.default.name, _Anchor.default);
  app.component(_Anchor.default.Link.name, _Anchor.default.Link);
  return app;
};
var _default = exports.default = _Anchor.default;