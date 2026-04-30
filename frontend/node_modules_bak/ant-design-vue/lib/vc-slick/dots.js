"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vnode = require("../_util/vnode");
var _innerSliderUtils = require("./utils/innerSliderUtils");
const getDotCount = function (spec) {
  let dots;
  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots = Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) + 1;
  }
  return dots;
};
const Dots = (_, _ref) => {
  let {
    attrs
  } = _ref;
  const {
    slideCount,
    slidesToScroll,
    slidesToShow,
    infinite,
    currentSlide,
    appendDots,
    customPaging,
    clickHandler,
    dotsClass,
    onMouseenter,
    onMouseover,
    onMouseleave
  } = attrs;
  const dotCount = getDotCount({
    slideCount,
    slidesToScroll,
    slidesToShow,
    infinite
  });
  // Apply join & split to Array to pre-fill it for IE8
  //
  // Credit: http://stackoverflow.com/a/13735425/1849458
  const mouseEvents = {
    onMouseenter,
    onMouseover,
    onMouseleave
  };
  let dots = [];
  for (let i = 0; i < dotCount; i++) {
    const _rightBound = (i + 1) * slidesToScroll - 1;
    const rightBound = infinite ? _rightBound : (0, _innerSliderUtils.clamp)(_rightBound, 0, slideCount - 1);
    const _leftBound = rightBound - (slidesToScroll - 1);
    const leftBound = infinite ? _leftBound : (0, _innerSliderUtils.clamp)(_leftBound, 0, slideCount - 1);
    const className = (0, _classNames.default)({
      'slick-active': infinite ? currentSlide >= leftBound && currentSlide <= rightBound : currentSlide === leftBound
    });
    const dotOptions = {
      message: 'dots',
      index: i,
      slidesToScroll,
      currentSlide
    };
    function onClick(e) {
      // In Autoplay the focus stays on clicked button even after transition
      // to next slide. That only goes away by click somewhere outside
      if (e) {
        e.preventDefault();
      }
      clickHandler(dotOptions);
    }
    dots = dots.concat((0, _vue.createVNode)("li", {
      "key": i,
      "class": className
    }, [(0, _vnode.cloneElement)(customPaging({
      i
    }), {
      onClick
    })]));
  }
  return (0, _vnode.cloneElement)(appendDots({
    dots
  }), (0, _extends2.default)({
    class: dotsClass
  }, mouseEvents));
};
Dots.inheritAttrs = false;
var _default = exports.default = Dots;