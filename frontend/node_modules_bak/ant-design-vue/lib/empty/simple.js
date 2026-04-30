"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _tinycolor = require("@ctrl/tinycolor");
var _internal = require("../theme/internal");
const Simple = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  setup() {
    const [, token] = (0, _internal.useToken)();
    const color = (0, _vue.computed)(() => {
      const {
        colorFill,
        colorFillTertiary,
        colorFillQuaternary,
        colorBgContainer
      } = token.value;
      return {
        borderColor: new _tinycolor.TinyColor(colorFill).onBackground(colorBgContainer).toHexString(),
        shadowColor: new _tinycolor.TinyColor(colorFillTertiary).onBackground(colorBgContainer).toHexString(),
        contentColor: new _tinycolor.TinyColor(colorFillQuaternary).onBackground(colorBgContainer).toHexString()
      };
    });
    return () => (0, _vue.createVNode)("svg", {
      "width": "64",
      "height": "41",
      "viewBox": "0 0 64 41",
      "xmlns": "http://www.w3.org/2000/svg"
    }, [(0, _vue.createVNode)("g", {
      "transform": "translate(0 1)",
      "fill": "none",
      "fill-rule": "evenodd"
    }, [(0, _vue.createVNode)("ellipse", {
      "fill": color.value.shadowColor,
      "cx": "32",
      "cy": "33",
      "rx": "32",
      "ry": "7"
    }, null), (0, _vue.createVNode)("g", {
      "fill-rule": "nonzero",
      "stroke": color.value.borderColor
    }, [(0, _vue.createVNode)("path", {
      "d": "M55 12.76L44.854 1.258C44.367.474 43.656 0 42.907 0H21.093c-.749 0-1.46.474-1.947 1.257L9 12.761V22h46v-9.24z"
    }, null), (0, _vue.createVNode)("path", {
      "d": "M41.613 15.931c0-1.605.994-2.93 2.227-2.931H55v18.137C55 33.26 53.68 35 52.05 35h-40.1C10.32 35 9 33.259 9 31.137V13h11.16c1.233 0 2.227 1.323 2.227 2.928v.022c0 1.605 1.005 2.901 2.237 2.901h14.752c1.232 0 2.237-1.308 2.237-2.913v-.007z",
      "fill": color.value.contentColor
    }, null)])])]);
  }
});
Simple.PRESENTED_IMAGE_SIMPLE = true;
var _default = exports.default = Simple;