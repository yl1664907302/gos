"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = require("vue");

var _utils = require("../utils");

var _Context = require("./Context");

var _InsertStyle = require("./InsertStyle");

var _excluded = ["class", "component", "viewBox", "spin", "rotate", "tabindex", "onClick"];

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? Object(arguments[i]) : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var Icon = function Icon(props, context) {
  var _classString;

  var attrs = context.attrs,
      slots = context.slots;

  var _props$attrs = _objectSpread({}, props, attrs),
      cls = _props$attrs["class"],
      Component = _props$attrs.component,
      viewBox = _props$attrs.viewBox,
      spin = _props$attrs.spin,
      rotate = _props$attrs.rotate,
      tabindex = _props$attrs.tabindex,
      onClick = _props$attrs.onClick,
      restProps = _objectWithoutProperties(_props$attrs, _excluded);

  var _useInjectIconContext = (0, _Context.useInjectIconContext)(),
      prefixCls = _useInjectIconContext.prefixCls,
      rootClassName = _useInjectIconContext.rootClassName;

  var children = slots["default"] && slots["default"]();
  var hasChildren = children && children.length;
  var slotsComponent = slots.component;
  (0, _utils.warning)(Boolean(Component || hasChildren || slotsComponent), 'Should have `component` prop/slot or `children`.');
  var classString = (_classString = {}, _defineProperty(_classString, rootClassName.value, !!rootClassName.value), _defineProperty(_classString, prefixCls.value, true), _classString);

  var svgClassString = _defineProperty({}, "".concat(prefixCls.value, "-spin"), spin === '' || !!spin);

  var svgStyle = rotate ? {
    msTransform: "rotate(".concat(rotate, "deg)"),
    transform: "rotate(".concat(rotate, "deg)")
  } : undefined;

  var innerSvgProps = _objectSpread({}, _utils.svgBaseProps, {
    viewBox: viewBox,
    "class": svgClassString,
    style: svgStyle
  });

  if (!viewBox) {
    delete innerSvgProps.viewBox;
  }

  var renderInnerNode = function renderInnerNode() {
    if (Component) {
      return (0, _vue.createVNode)(Component, innerSvgProps, {
        "default": function _default() {
          return [children];
        }
      });
    }

    if (slotsComponent) {
      return slotsComponent(innerSvgProps);
    }

    if (hasChildren) {
      (0, _utils.warning)(Boolean(viewBox) || children.length === 1 && children[0] && children[0].type === 'use', 'Make sure that you provide correct `viewBox`' + ' prop (default `0 0 1024 1024`) to the icon.');
      return (0, _vue.createVNode)("svg", _objectSpread({}, innerSvgProps, {
        "viewBox": viewBox
      }), [children]);
    }

    return null;
  };

  var iconTabIndex = tabindex;

  if (iconTabIndex === undefined && onClick) {
    iconTabIndex = -1;
    restProps.tabindex = iconTabIndex;
  }

  return (0, _vue.createVNode)("span", _objectSpread({
    "role": "img"
  }, restProps, {
    "onClick": onClick,
    "class": [classString, cls]
  }), [renderInnerNode(), (0, _vue.createVNode)(_InsertStyle.InsertStyles, null, null)]);
};

Icon.props = {
  spin: Boolean,
  rotate: Number,
  viewBox: String,
  ariaLabel: String
};
Icon.inheritAttrs = false;
Icon.displayName = 'Icon';
var _default2 = Icon;
exports["default"] = _default2;