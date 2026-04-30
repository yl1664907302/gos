"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Keyframes", {
  enumerable: true,
  get: function () {
    return _Keyframes.default;
  }
});
Object.defineProperty(exports, "StyleProvider", {
  enumerable: true,
  get: function () {
    return _StyleContext.StyleProvider;
  }
});
Object.defineProperty(exports, "Theme", {
  enumerable: true,
  get: function () {
    return _theme.Theme;
  }
});
exports._experimental = void 0;
Object.defineProperty(exports, "createCache", {
  enumerable: true,
  get: function () {
    return _StyleContext.createCache;
  }
});
Object.defineProperty(exports, "createTheme", {
  enumerable: true,
  get: function () {
    return _theme.createTheme;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "extractStyle", {
  enumerable: true,
  get: function () {
    return _useStyleRegister.extractStyle;
  }
});
Object.defineProperty(exports, "legacyLogicalPropertiesTransformer", {
  enumerable: true,
  get: function () {
    return _legacyLogicalProperties.default;
  }
});
Object.defineProperty(exports, "legacyNotSelectorLinter", {
  enumerable: true,
  get: function () {
    return _linters.legacyNotSelectorLinter;
  }
});
Object.defineProperty(exports, "logicalPropertiesLinter", {
  enumerable: true,
  get: function () {
    return _linters.logicalPropertiesLinter;
  }
});
Object.defineProperty(exports, "parentSelectorLinter", {
  enumerable: true,
  get: function () {
    return _linters.parentSelectorLinter;
  }
});
Object.defineProperty(exports, "px2remTransformer", {
  enumerable: true,
  get: function () {
    return _px2rem.default;
  }
});
Object.defineProperty(exports, "useCacheToken", {
  enumerable: true,
  get: function () {
    return _useCacheToken.default;
  }
});
Object.defineProperty(exports, "useStyleInject", {
  enumerable: true,
  get: function () {
    return _StyleContext.useStyleInject;
  }
});
Object.defineProperty(exports, "useStyleProvider", {
  enumerable: true,
  get: function () {
    return _StyleContext.useStyleProvider;
  }
});
Object.defineProperty(exports, "useStyleRegister", {
  enumerable: true,
  get: function () {
    return _useStyleRegister.default;
  }
});
var _useCacheToken = _interopRequireDefault(require("./hooks/useCacheToken"));
var _useStyleRegister = _interopRequireWildcard(require("./hooks/useStyleRegister"));
var _Keyframes = _interopRequireDefault(require("./Keyframes"));
var _linters = require("./linters");
var _StyleContext = require("./StyleContext");
var _theme = require("./theme");
var _legacyLogicalProperties = _interopRequireDefault(require("./transformers/legacyLogicalProperties"));
var _px2rem = _interopRequireDefault(require("./transformers/px2rem"));
var _util = require("./util");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const cssinjs = {
  Theme: _theme.Theme,
  createTheme: _theme.createTheme,
  useStyleRegister: _useStyleRegister.default,
  useCacheToken: _useCacheToken.default,
  createCache: _StyleContext.createCache,
  useStyleInject: _StyleContext.useStyleInject,
  useStyleProvider: _StyleContext.useStyleProvider,
  Keyframes: _Keyframes.default,
  extractStyle: _useStyleRegister.extractStyle,
  // Transformer
  legacyLogicalPropertiesTransformer: _legacyLogicalProperties.default,
  px2remTransformer: _px2rem.default,
  // Linters
  logicalPropertiesLinter: _linters.logicalPropertiesLinter,
  legacyNotSelectorLinter: _linters.legacyNotSelectorLinter,
  parentSelectorLinter: _linters.parentSelectorLinter,
  // cssinjs
  StyleProvider: _StyleContext.StyleProvider
};
const _experimental = exports._experimental = {
  supportModernCSS: () => (0, _util.supportWhere)() && (0, _util.supportLogicProps)()
};
var _default = exports.default = cssinjs;