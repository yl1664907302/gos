import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { ref, computed, watchEffect, defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import warning from '../_util/warning';
import classNames from '../_util/classNames';
import SlickCarousel from '../vc-slick';
import { withInstall, booleanType, functionType, stringType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
// CSSINJS
import useStyle from './style';
// Carousel
export const carouselProps = () => ({
  effect: stringType(),
  dots: booleanType(true),
  vertical: booleanType(),
  autoplay: booleanType(),
  easing: String,
  beforeChange: functionType(),
  afterChange: functionType(),
  // style: PropTypes.React.CSSProperties,
  prefixCls: String,
  accessibility: booleanType(),
  nextArrow: PropTypes.any,
  prevArrow: PropTypes.any,
  pauseOnHover: booleanType(),
  // className: String,
  adaptiveHeight: booleanType(),
  arrows: booleanType(false),
  autoplaySpeed: Number,
  centerMode: booleanType(),
  centerPadding: String,
  cssEase: String,
  dotsClass: String,
  draggable: booleanType(false),
  fade: booleanType(),
  focusOnSelect: booleanType(),
  infinite: booleanType(),
  initialSlide: Number,
  lazyLoad: stringType(),
  rtl: booleanType(),
  slide: String,
  slidesToShow: Number,
  slidesToScroll: Number,
  speed: Number,
  swipe: booleanType(),
  swipeToSlide: booleanType(),
  swipeEvent: functionType(),
  touchMove: booleanType(),
  touchThreshold: Number,
  variableWidth: booleanType(),
  useCSS: booleanType(),
  slickGoTo: Number,
  responsive: Array,
  dotPosition: stringType(),
  verticalSwiping: booleanType(false)
});
const Carousel = defineComponent({
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
    const slickRef = ref();
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
      innerSlider: computed(() => {
        var _a;
        return (_a = slickRef.value) === null || _a === void 0 ? void 0 : _a.innerSlider;
      })
    });
    watchEffect(() => {
      warning(props.vertical === undefined, 'Carousel', '`vertical` is deprecated, please use `dotPosition` instead.');
    });
    const {
      prefixCls,
      direction
    } = useConfigInject('carousel', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const dotPosition = computed(() => {
      if (props.dotPosition) return props.dotPosition;
      if (props.vertical !== undefined) return props.vertical ? 'right' : 'bottom';
      return 'bottom';
    });
    const vertical = computed(() => dotPosition.value === 'left' || dotPosition.value === 'right');
    const dsClass = computed(() => {
      const dotsClass = 'slick-dots';
      return classNames({
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
      const className = classNames(prefixCls.value, {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-vertical`]: vertical.value,
        [`${cls}`]: !!cls
      }, hashId.value);
      return wrapSSR(_createVNode("div", {
        "class": className,
        "style": style
      }, [_createVNode(SlickCarousel, _objectSpread(_objectSpread(_objectSpread({
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
export default withInstall(Carousel);