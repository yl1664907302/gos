"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
const defaultProps = {
  accessibility: {
    type: Boolean,
    default: true
  },
  // 自定义高度
  adaptiveHeight: {
    type: Boolean,
    default: false
  },
  afterChange: _vueTypes.default.any.def(null),
  arrows: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: false
  },
  autoplaySpeed: _vueTypes.default.number.def(3000),
  beforeChange: _vueTypes.default.any.def(null),
  centerMode: {
    type: Boolean,
    default: false
  },
  centerPadding: _vueTypes.default.string.def('50px'),
  cssEase: _vueTypes.default.string.def('ease'),
  dots: {
    type: Boolean,
    default: false
  },
  dotsClass: _vueTypes.default.string.def('slick-dots'),
  draggable: {
    type: Boolean,
    default: true
  },
  unslick: {
    type: Boolean,
    default: false
  },
  easing: _vueTypes.default.string.def('linear'),
  edgeFriction: _vueTypes.default.number.def(0.35),
  fade: {
    type: Boolean,
    default: false
  },
  focusOnSelect: {
    type: Boolean,
    default: false
  },
  infinite: {
    type: Boolean,
    default: true
  },
  initialSlide: _vueTypes.default.number.def(0),
  lazyLoad: _vueTypes.default.any.def(null),
  verticalSwiping: {
    type: Boolean,
    default: false
  },
  asNavFor: _vueTypes.default.any.def(null),
  // 圆点hover是否暂停
  pauseOnDotsHover: {
    type: Boolean,
    default: false
  },
  // focus是否暂停
  pauseOnFocus: {
    type: Boolean,
    default: false
  },
  // hover是否暂停
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  responsive: _vueTypes.default.array,
  rows: _vueTypes.default.number.def(1),
  rtl: {
    type: Boolean,
    default: false
  },
  slide: _vueTypes.default.string.def('div'),
  slidesPerRow: _vueTypes.default.number.def(1),
  slidesToScroll: _vueTypes.default.number.def(1),
  slidesToShow: _vueTypes.default.number.def(1),
  speed: _vueTypes.default.number.def(500),
  swipe: {
    type: Boolean,
    default: true
  },
  swipeEvent: _vueTypes.default.any.def(null),
  swipeToSlide: {
    type: Boolean,
    default: false
  },
  touchMove: {
    type: Boolean,
    default: true
  },
  touchThreshold: _vueTypes.default.number.def(5),
  useCSS: {
    type: Boolean,
    default: true
  },
  useTransform: {
    type: Boolean,
    default: true
  },
  variableWidth: {
    type: Boolean,
    default: false
  },
  vertical: {
    type: Boolean,
    default: false
  },
  waitForAnimate: {
    type: Boolean,
    default: true
  },
  children: _vueTypes.default.array,
  __propsSymbol__: _vueTypes.default.any
};
var _default = exports.default = defaultProps;