"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FormItem", {
  enumerable: true,
  get: function () {
    return _FormItem.default;
  }
});
Object.defineProperty(exports, "FormItemRest", {
  enumerable: true,
  get: function () {
    return _FormItemContext.default;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "formItemProps", {
  enumerable: true,
  get: function () {
    return _FormItem.formItemProps;
  }
});
Object.defineProperty(exports, "formProps", {
  enumerable: true,
  get: function () {
    return _Form.formProps;
  }
});
Object.defineProperty(exports, "useForm", {
  enumerable: true,
  get: function () {
    return _useForm.default;
  }
});
Object.defineProperty(exports, "useInjectFormItemContext", {
  enumerable: true,
  get: function () {
    return _FormItemContext.useInjectFormItemContext;
  }
});
var _Form = _interopRequireWildcard(require("./Form"));
var _FormItem = _interopRequireWildcard(require("./FormItem"));
var _useForm = _interopRequireDefault(require("./useForm"));
var _FormItemContext = _interopRequireWildcard(require("./FormItemContext"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_Form.default.useInjectFormItemContext = _FormItemContext.useInjectFormItemContext;
_Form.default.ItemRest = _FormItemContext.default;
/* istanbul ignore next */
_Form.default.install = function (app) {
  app.component(_Form.default.name, _Form.default);
  app.component(_Form.default.Item.name, _Form.default.Item);
  app.component(_FormItemContext.default.name, _FormItemContext.default);
  return app;
};
var _default = exports.default = _Form.default;