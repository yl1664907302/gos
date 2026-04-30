"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warn = warn;
exports.warning = warning;
exports.isIconDefinition = isIconDefinition;
exports.normalizeAttrs = normalizeAttrs;
exports.generate = generate;
exports.getSecondaryColor = getSecondaryColor;
exports.normalizeTwoToneColors = normalizeTwoToneColors;
exports.useInsertStyles = exports.iconStyles = exports.svgBaseProps = void 0;

var _vue = require("vue");

var _colors = require("@ant-design/colors");

var _Context = require("./components/Context");

var _dynamicCSS = require("./dynamicCSS");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function warn(valid, message) {
  // Support uglify
  if (process.env.NODE_ENV !== 'production' && !valid && console !== undefined) {
    console.error("Warning: ".concat(message));
  }
}

function warning(valid, message) {
  warn(valid, "[@ant-design/icons-vue] ".concat(message));
}

function camelCase(input) {
  return input.replace(/-(.)/g, function (_match, g) {
    return g.toUpperCase();
  });
} // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types


function isIconDefinition(target) {
  return typeof target === 'object' && typeof target.name === 'string' && typeof target.theme === 'string' && (typeof target.icon === 'object' || typeof target.icon === 'function');
}

function normalizeAttrs() {
  var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return Object.keys(attrs).reduce(function (acc, key) {
    var val = attrs[key];

    switch (key) {
      case 'class':
        acc.className = val;
        delete acc["class"];
        break;

      default:
        delete acc[key];
        acc[camelCase(key)] = val;
    }

    return acc;
  }, {});
}

function generate(node, key, rootProps) {
  if (!rootProps) {
    return (0, _vue.h)(node.tag, _objectSpread({
      key: key
    }, node.attrs), (node.children || []).map(function (child, index) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }

  return (0, _vue.h)(node.tag, _objectSpread({
    key: key
  }, rootProps, node.attrs), (node.children || []).map(function (child, index) {
    return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
  }));
}

function getSecondaryColor(primaryColor) {
  // choose the second color
  return (0, _colors.generate)(primaryColor)[0];
}

function normalizeTwoToneColors(twoToneColor) {
  if (!twoToneColor) {
    return [];
  }

  return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
} // These props make sure that the SVG behaviours like general text.
// Reference: https://blog.prototypr.io/align-svg-icons-to-text-and-say-goodbye-to-font-icons-d44b3d7b26b4


var svgBaseProps = {
  width: '1em',
  height: '1em',
  fill: 'currentColor',
  'aria-hidden': 'true',
  focusable: 'false'
};
exports.svgBaseProps = svgBaseProps;
var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
exports.iconStyles = iconStyles;

function getRoot(ele) {
  return ele && ele.getRootNode && ele.getRootNode();
}
/**
 * Check if is in shadowRoot
 */


function inShadow(ele) {
  if (!(0, _dynamicCSS.canUseDom)()) {
    return false;
  }

  return getRoot(ele) instanceof ShadowRoot;
}
/**
 * Return shadowRoot if possible
 */


function getShadowRoot(ele) {
  return inShadow(ele) ? getRoot(ele) : null;
}

var useInsertStyles = function useInsertStyles() {
  var _useInjectIconContext = (0, _Context.useInjectIconContext)(),
      prefixCls = _useInjectIconContext.prefixCls,
      csp = _useInjectIconContext.csp;

  var instance = (0, _vue.getCurrentInstance)();
  var mergedStyleStr = iconStyles;

  if (prefixCls) {
    mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls.value);
  }

  (0, _vue.nextTick)(function () {
    if (!(0, _dynamicCSS.canUseDom)()) {
      return;
    }

    var ele = instance.vnode.el;
    var shadowRoot = getShadowRoot(ele);
    (0, _dynamicCSS.updateCSS)(mergedStyleStr, '@ant-design-vue-icons', {
      prepend: true,
      csp: csp.value,
      attachTo: shadowRoot
    });
  });
};

exports.useInsertStyles = useInsertStyles;