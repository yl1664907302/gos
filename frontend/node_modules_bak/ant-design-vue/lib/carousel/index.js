"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.carouselProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcSlick = _interopRequireDefault(require("../vc-slick"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

// Carousel
const carouselProps = () => ({
  effect: (0, _type.stringType)(),
  dots: (0, _type.booleanType)(true),
  vertical: (0, _type.booleanType)(),
  autoplay: (0, _type.booleanType)(),
  easing: String,
  beforeChange: (0, _type.functionType)(),
  afterChange: (0, _type.functionType)(),
  // style: PropTypes.React.CSSProperties,
  prefixCls: String,
  accessibility: (0, _type.booleanType)(),
  nextArrow: _vueTypes.default.any,
  prevArrow: _vueTypes.default.any,
  pauseOnHover: (0, _type.booleanType)(),
  // className: String,
  adaptiveHeight: (0, _type.booleanType)(),
  arrows: (0, _type.booleanType)(false),
  autoplaySpeed: Number,
  centerMode: (0, _type.booleanType)(),
  centerPadding: String,
  cssEase: String,
  dotsClass: String,
  draggable: (0, _type.booleanType)(false),
  fade: (0, _type.booleanType)(),
  focusOnSelect: (0, _type.booleanType)(),
  infinite: (0, _type.booleanType)(),
  initialSlide: Number,
  lazyLoad: (0, _type.stringType)(),
  rtl: (0, _type.booleanType)(),
  slide: String,
  slidesToShow: Number,
  slidesToScroll: Number,
  speed: Number,
  swipe: (0, _type.booleanType)(),
  swipeToSlide: (0, _type.booleanType)(),
  swipeEvent: (0, _type.functionType)(),
  touchMove: (0, _type.booleanType)(),
  touchThreshold: Number,
  variableWidth: (0, _type.booleanType)(),
  useCSS: (0, _type.booleanType)(),
  slickGoTo: Number,
  responsive: Array,
  dotPosition: (0, _type.stringType)(),
  verticalSwiping: (0, _type.booleanType)(false)
});
exports.carouselProps = carouselProps;
const Carousel = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACarousel',
  inheritAttrs: false,
  props: carouselProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const slickRef = (0, _vue.ref)();
    const goTo = function (slide) {
      let dontAnimate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _a;
      (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.slickGoTo(slide, dontAnimate);
    };
    expose({
      goTo,
      autoplay: palyType => {
        var _a, _b;
        (_b = (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.innerSlider) === null || _b === void 0 ? void 0 : _b.handleAutoPlay(palyType);
      },
      prev: () => {
        var _a;
        (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.slickPrev();
      },
      next: () => {
        var _a;
        (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.slickNext();
      },
      innerSlider: (0, _vue.computed)(() => {
        var _a;
        return (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.innerSlider;
      })
    });
    (0, _vue.watchEffect)(() => {
      (0, _warning.default)(props.vertical === undefined, 'Carousel', '`vertical` is deprecated, please use `dotPosition` instead.');
    });
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('carousel', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const dotPosition = (0, _vue.computed)(() => {
      if (props.dotPosition) return props.dotPosition;
      if (props.vertical !== undefined) return props.vertical ? 'right' : 'bottom';
      return 'bottom';
    });
    const vertical = (0, _vue.computed)(() => dotPosition.value === 'left' || dotPosition.value === 'right');
    const dsClass = (0, _vue.computed)(() => {
      const dotsClass = 'slick-dots';
      return (0, _classNames.default)({
        [dotsClass]: true,
        [`${dotsClass}-${dotPosition.value}`]: true,
        [`${props.dotsClass}`]: !!props.dotsClass
      });
    });
    return () => {
      const {
        dots,
        arrows,
        draggable,
        effect
      } = props;
      const {
          class: cls,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      const fade = effect === 'fade' ? true : props.fade;
      const className = (0, _classNames.default)(prefixCls.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-vertical`]: vertical.value,
        [`${cls}`]: !!cls
      }, hashId.value);
      return wrapSSR((0, _vue.createVNode)("div", {
        "class": className,
        "style": style
      }, [(0, _vue.createVNode)(_vcSlick.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": slickRef
      }, props), restAttrs), {}, {
        "dots": !!dots,
        "dotsClass": dsClass.value,
        "arrows": arrows,
        "draggable": draggable,
        "fade": fade,
        "vertical": vertical.value
      }), slots)]));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Carousel);