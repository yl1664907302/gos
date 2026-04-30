import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import classnames from '../_util/classNames';
import { cloneElement } from '../_util/vnode';
import { canGoNext } from './utils/innerSliderUtils';
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
    prevArrow = cloneElement(attrs.prevArrow(_extends(_extends({}, prevArrowProps), customProps)), {
      key: '0',
      class: prevClasses,
      style: {
        display: 'block'
      },
      onClick: prevHandler
    }, false);
  } else {
    prevArrow = _createVNode("button", _objectSpread({
      "key": "0",
      "type": "button"
    }, prevArrowProps), [' ', _createTextVNode("Previous")]);
  }
  return prevArrow;
};
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
  if (!canGoNext(attrs)) {
    nextClasses['slick-disabled'] = true;
    nextHandler = noop;
  }
  const nextArrowProps = {
    key: '1',
    'data-role': 'none',
    class: classnames(nextClasses),
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
    nextArrow = cloneElement(attrs.nextArrow(_extends(_extends({}, nextArrowProps), customProps)), {
      key: '1',
      class: classnames(nextClasses),
      style: {
        display: 'block'
      },
      onClick: nextHandler
    }, false);
  } else {
    nextArrow = _createVNode("button", _objectSpread({
      "key": "1",
      "type": "button"
    }, nextArrowProps), [' ', _createTextVNode("Next")]);
  }
  return nextArrow;
};
NextArrow.inheritAttrs = false;
export { PrevArrow, NextArrow };