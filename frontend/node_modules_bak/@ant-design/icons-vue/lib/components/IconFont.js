"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = create;

var _vue = require("vue");

var _Icon = _interopRequireDefault(require("./Icon"));

var _excluded = ["type"];

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var customCache = new Set();

function isValidCustomScriptUrl(scriptUrl) {
  return typeof scriptUrl === 'string' && scriptUrl.length && !customCache.has(scriptUrl);
}

function createScriptUrlElements(scriptUrls) {
  var index = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var currentScriptUrl = scriptUrls[index];

  if (isValidCustomScriptUrl(currentScriptUrl)) {
    var script = document.createElement('script');
    script.setAttribute('src', currentScriptUrl);
    script.setAttribute('data-namespace', currentScriptUrl);

    if (scriptUrls.length > index + 1) {
      script.onload = function () {
        createScriptUrlElements(scriptUrls, index + 1);
      };

      script.onerror = function () {
        createScriptUrlElements(scriptUrls, index + 1);
      };
    }

    customCache.add(currentScriptUrl);
    document.body.appendChild(script);
  }
}

function create() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var scriptUrl = options.scriptUrl,
      _options$extraCommonP = options.extraCommonProps,
      extraCommonProps = _options$extraCommonP === void 0 ? {} : _options$extraCommonP;
  /**
   * DOM API required.
   * Make sure in browser environment.
   * The Custom Icon will create a <script/>
   * that loads SVG symbols and insert the SVG Element into the document body.
   */

  if (typeof document !== 'undefined' && typeof window !== 'undefined' && typeof document.createElement === 'function') {
    if (Array.isArray(scriptUrl)) {
      // 因为iconfont资源会把svg插入before，所以前加载相同type会覆盖后加载，为了数组覆盖顺序，倒叙插入
      createScriptUrlElements(scriptUrl.reverse());
    } else {
      createScriptUrlElements([scriptUrl]);
    }
  }

  var Iconfont = function Iconfont(props, context) {
    var attrs = context.attrs,
        slots = context.slots;

    var _props$attrs = _objectSpread({}, props, attrs),
        type = _props$attrs.type,
        restProps = _objectWithoutProperties(_props$attrs, _excluded);

    var children = slots["default"] && slots["default"](); // children > type

    var content = null;

    if (type) {
      content = (0, _vue.createVNode)("use", {
        "xlink:href": "#".concat(type)
      }, null);
    }

    if (children && children.length) {
      content = children;
    }

    var iconProps = _objectSpread({}, extraCommonProps, restProps);

    return (0, _vue.createVNode)(_Icon["default"], iconProps, {
      "default": function _default() {
        return [content];
      }
    });
  };

  Iconfont.props = {
    spin: Boolean,
    rotate: Number,
    type: String
  };
  Iconfont.inheritAttrs = false;
  Iconfont.displayName = 'Iconfont';
  return Iconfont;
}