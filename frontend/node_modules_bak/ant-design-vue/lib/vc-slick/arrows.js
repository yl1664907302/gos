"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrevArrow = exports.NextArrow = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vnode = require("../_util/vnode");
var _innerSliderUtils = require("./utils/innerSliderUtils");
function noop() {}
function handler(options, handle, e) {
  if (e) {
    e.preventDefault();
  }
  handle(options, e);
}
const PrevArrow = (_, _ref) => {
  let {
    attrs
  } = _ref;
  const {
    clickHandler,
    infinite,
    currentSlide,
    slideCount,
    slidesToShow
  } = attrs;
  const prevClasses = {
    'slick-arrow': true,
    'slick-prev': true
  };
  let prevHandler = function (e) {
    handler({
      message: 'previous'
    }, clickHandler, e);
  };
  if (!infinite && (currentSlide === 0 || slideCount <= slidesToShow)) {
    prevClasses['slick-disabled'] = true;
    prevHandler = noop;
  }
  const prevArrowProps = {
    key: '0',
    'data-role': 'none',
    class: prevClasses,
    style: {
      display: 'block'
    },
    onClick: prevHandler
  };
  const customProps = {
    currentSlide,
    slideCount
  };
  let prevArrow;
  if (attrs.prevArrow) {
    prevArrow = (0, _vnode.cloneElement)(attrs.prevArrow((0, _extends2.default)((0, _extends2.default)({}, prevArrowProps), customProps)), {
      key: '0',
      class: prevClasses,
      style: {
        display: 'block'
      },
      onClick: prevHandler
    }, false);
  } else {
    prevArrow = (0, _vue.createVNode)("button", (0, _objectSpread2.default)({
      "key": "0",
      "type": "button"
    }, prevArrowProps), [' ', (0, _vue.createTextVNode)("Previous")]);
  }
  return prevArrow;
};
exports.PrevArrow = PrevArrow;
PrevArrow.inheritAttrs = false;
const NextArrow = (_, _ref2) => {
  let {
    attrs
  } = _ref2;
  const {
    clickHandler,
    currentSlide,
    slideCount
  } = attrs;
  const nextClasses = {
    'slick-arrow': true,
    'slick-next': true
  };
  let nextHandler = function (e) {
    handler({
      message: 'next'
    }, clickHandler, e);
  };
  if (!(0, _innerSliderUtils.canGoNext)(attrs)) {
    nextClasses['slick-disabled'] = true;
    nextHandler = noop;
  }
  const nextArrowProps = {
    key: '1',
    'data-role': 'none',
    class: (0, _classNames.default)(nextClasses),
    style: {
      display: 'block'
    },
    onClick: nextHandler
  };
  const customProps = {
    currentSlide,
    slideCount
  };
  let nextArrow;
  if (attrs.nextArrow) {
    nextArrow = (0, _vnode.cloneElement)(attrs.nextArrow((0, _extends2.default)((0, _extends2.default)({}, nextArrowProps), customProps)), {
      key: '1',
      class: (0, _classNames.default)(nextClasses),
      style: {
        display: 'block'
      },
      onClick: nextHandler
    }, false);
  } else {
    nextArrow = (0, _vue.createVNode)("button", (0, _objectSpread2.default)({
      "key": "1",
      "type": "button"
    }, nextArrowProps), [' ', (0, _vue.createTextVNode)("Next")]);
  }
  return nextArrow;
};
exports.NextArrow = NextArrow;
NextArrow.inheritAttrs = false;