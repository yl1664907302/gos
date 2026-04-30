"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSlider;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../../../_util/vue-types"));
var _addEventListener = _interopRequireDefault(require("../../../vc-util/Dom/addEventListener"));
var _warning = _interopRequireDefault(require("../../../_util/warning"));
var _propsUtil = require("../../../_util/props-util");
var _Steps = _interopRequireDefault(require("./Steps"));
var _Marks = _interopRequireDefault(require("./Marks"));
var _Handle = _interopRequireDefault(require("../Handle"));
var utils = _interopRequireWildcard(require("../utils"));
var _BaseMixin = _interopRequireDefault(require("../../../_util/BaseMixin"));
var _supportsPassive = _interopRequireDefault(require("../../../_util/supportsPassive"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function noop() {}
function createSlider(Component) {
  // const displayName = `ComponentEnhancer(${Component.displayName})`
  const propTypes = {
    id: String,
    min: Number,
    max: Number,
    step: Number,
    marks: _vueTypes.default.object,
    included: {
      type: Boolean,
      default: undefined
    },
    prefixCls: String,
    disabled: {
      type: Boolean,
      default: undefined
    },
    handle: Function,
    dots: {
      type: Boolean,
      default: undefined
    },
    vertical: {
      type: Boolean,
      default: undefined
    },
    reverse: {
      type: Boolean,
      default: undefined
    },
    minimumTrackStyle: _vueTypes.default.object,
    maximumTrackStyle: _vueTypes.default.object,
    handleStyle: _vueTypes.default.oneOfType([_vueTypes.default.object, _vueTypes.default.arrayOf(_vueTypes.default.object)]),
    trackStyle: _vueTypes.default.oneOfType([_vueTypes.default.object, _vueTypes.default.arrayOf(_vueTypes.default.object)]),
    railStyle: _vueTypes.default.object,
    dotStyle: _vueTypes.default.object,
    activeDotStyle: _vueTypes.default.object,
    autofocus: {
      type: Boolean,
      default: undefined
    },
    draggableTrack: {
      type: Boolean,
      default: undefined
    }
  };
  return (0, _vue.defineComponent)({
    compatConfig: {
      MODE: 3
    },
    name: 'CreateSlider',
    mixins: [_BaseMixin.default, Component],
    inheritAttrs: false,
    props: (0, _propsUtil.initDefaultProps)(propTypes, {
      prefixCls: 'rc-slider',
      min: 0,
      max: 100,
      step: 1,
      marks: {},
      included: true,
      disabled: false,
      dots: false,
      vertical: false,
      reverse: false,
      trackStyle: [{}],
      handleStyle: [{}],
      railStyle: {},
      dotStyle: {},
      activeDotStyle: {}
    }),
    emits: ['change', 'blur', 'focus'],
    data() {
      const {
        step,
        max,
        min
      } = this;
      const isPointDiffEven = isFinite(max - min) ? (max - min) % step === 0 : true; // eslint-disable-line
      (0, _warning.default)(step && Math.floor(step) === step ? isPointDiffEven : true, `Slider[max] - Slider[min] (${max - min}) should be a multiple of Slider[step] (${step})`);
      this.handlesRefs = {};
      return {};
    },
    mounted() {
      this.$nextTick(() => {
        // Snapshot testing cannot handle refs, so be sure to null-check this.
        this.document = this.sliderRef && this.sliderRef.ownerDocument;
        // this.setHandleRefs()
        const {
          autofocus,
          disabled
        } = this;
        if (autofocus && !disabled) {
          this.focus();
        }
      });
    },
    beforeUnmount() {
      this.$nextTick(() => {
        // if (super.componentWillUnmount) super.componentWillUnmount()
        this.removeDocumentEvents();
      });
    },
    methods: {
      defaultHandle(_a) {
        var {
            index,
            directives,
            className,
            style
          } = _a,
          restProps = __rest(_a, ["index", "directives", "className", "style"]);
        delete restProps.dragging;
        if (restProps.value === null) {
          return null;
        }
        const handleProps = (0, _extends2.default)((0, _extends2.default)({}, restProps), {
          class: className,
          style,
          key: index
        });
        return (0, _vue.createVNode)(_Handle.default, handleProps, null);
      },
      onDown(e, position) {
        let p = position;
        const {
          draggableTrack,
          vertical: isVertical
        } = this.$props;
        const {
          bounds
        } = this.$data;
        const value = draggableTrack && this.positionGetValue ? this.positionGetValue(p) || [] : [];
        const inPoint = utils.isEventFromHandle(e, this.handlesRefs);
        this.dragTrack = draggableTrack && bounds.length >= 2 && !inPoint && !value.map((n, i) => {
          const v = !i ? n >= bounds[i] : true;
          return i === value.length - 1 ? n <= bounds[i] : v;
        }).some(c => !c);
        if (this.dragTrack) {
          this.dragOffset = p;
          this.startBounds = [...bounds];
        } else {
          if (!inPoint) {
            this.dragOffset = 0;
          } else {
            const handlePosition = utils.getHandleCenterPosition(isVertical, e.target);
            this.dragOffset = p - handlePosition;
            p = handlePosition;
          }
          this.onStart(p);
        }
      },
      onMouseDown(e) {
        if (e.button !== 0) {
          return;
        }
        this.removeDocumentEvents();
        const isVertical = this.$props.vertical;
        const position = utils.getMousePosition(isVertical, e);
        this.onDown(e, position);
        this.addDocumentMouseEvents();
      },
      onTouchStart(e) {
        if (utils.isNotTouchEvent(e)) return;
        const isVertical = this.vertical;
        const position = utils.getTouchPosition(isVertical, e);
        this.onDown(e, position);
        this.addDocumentTouchEvents();
        utils.pauseEvent(e);
      },
      onFocus(e) {
        const {
          vertical
        } = this;
        if (utils.isEventFromHandle(e, this.handlesRefs) && !this.dragTrack) {
          const handlePosition = utils.getHandleCenterPosition(vertical, e.target);
          this.dragOffset = 0;
          this.onStart(handlePosition);
          utils.pauseEvent(e);
          this.$emit('focus', e);
        }
      },
      onBlur(e) {
        if (!this.dragTrack) {
          this.onEnd();
        }
        this.$emit('blur', e);
      },
      onMouseUp() {
        if (this.handlesRefs[this.prevMovedHandleIndex]) {
          this.handlesRefs[this.prevMovedHandleIndex].clickFocus();
        }
      },
      onMouseMove(e) {
        if (!this.sliderRef) {
          this.onEnd();
          return;
        }
        const position = utils.getMousePosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset, this.dragTrack, this.startBounds);
      },
      onTouchMove(e) {
        if (utils.isNotTouchEvent(e) || !this.sliderRef) {
          this.onEnd();
          return;
        }
        const position = utils.getTouchPosition(this.vertical, e);
        this.onMove(e, position - this.dragOffset, this.dragTrack, this.startBounds);
      },
      onKeyDown(e) {
        if (this.sliderRef && utils.isEventFromHandle(e, this.handlesRefs)) {
          this.onKeyboard(e);
        }
      },
      onClickMarkLabel(e, value) {
        e.stopPropagation();
        this.onChange({
          sValue: value
        });
        this.setState({
          sValue: value
        }, () => this.onEnd(true));
      },
      getSliderStart() {
        const slider = this.sliderRef;
        const {
          vertical,
          reverse
        } = this;
        const rect = slider.getBoundingClientRect();
        if (vertical) {
          return reverse ? rect.bottom : rect.top;
        }
        return window.scrollX + (reverse ? rect.right : rect.left);
      },
      getSliderLength() {
        const slider = this.sliderRef;
        if (!slider) {
          return 0;
        }
        const coords = slider.getBoundingClientRect();
        return this.vertical ? coords.height : coords.width;
      },
      addDocumentTouchEvents() {
        // just work for Chrome iOS Safari and Android Browser
        this.onTouchMoveListener = (0, _addEventListener.default)(this.document, 'touchmove', this.onTouchMove);
        this.onTouchUpListener = (0, _addEventListener.default)(this.document, 'touchend', this.onEnd);
      },
      addDocumentMouseEvents() {
        this.onMouseMoveListener = (0, _addEventListener.default)(this.document, 'mousemove', this.onMouseMove);
        this.onMouseUpListener = (0, _addEventListener.default)(this.document, 'mouseup', this.onEnd);
      },
      removeDocumentEvents() {
        /* eslint-disable no-unused-expressions */
        this.onTouchMoveListener && this.onTouchMoveListener.remove();
        this.onTouchUpListener && this.onTouchUpListener.remove();
        this.onMouseMoveListener && this.onMouseMoveListener.remove();
        this.onMouseUpListener && this.onMouseUpListener.remove();
        /* eslint-enable no-unused-expressions */
      },
      focus() {
        var _a;
        if (this.$props.disabled) {
          return;
        }
        (_a = this.handlesRefs[0]) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        if (this.$props.disabled) {
          return;
        }
        Object.keys(this.handlesRefs).forEach(key => {
          var _a, _b;
          (_b = (_a = this.handlesRefs[key]) === null || _a === void 0 ? void 0 : _a.blur) === null || _b === void 0 ? void 0 : _b.call(_a);
        });
      },
      calcValue(offset) {
        const {
          vertical,
          min,
          max
        } = this;
        const ratio = Math.abs(Math.max(offset, 0) / this.getSliderLength());
        const value = vertical ? (1 - ratio) * (max - min) + min : ratio * (max - min) + min;
        return value;
      },
      calcValueByPos(position) {
        const sign = this.reverse ? -1 : +1;
        const pixelOffset = sign * (position - this.getSliderStart());
        const nextValue = this.trimAlignValue(this.calcValue(pixelOffset));
        return nextValue;
      },
      calcOffset(value) {
        const {
          min,
          max
        } = this;
        const ratio = (value - min) / (max - min);
        return Math.max(0, ratio * 100);
      },
      saveSlider(slider) {
        this.sliderRef = slider;
      },
      saveHandle(index, handle) {
        this.handlesRefs[index] = handle;
      }
    },
    render() {
      const {
        prefixCls,
        marks,
        dots,
        step,
        included,
        disabled,
        vertical,
        reverse,
        min,
        max,
        maximumTrackStyle,
        railStyle,
        dotStyle,
        activeDotStyle,
        id
      } = this;
      const {
        class: className,
        style
      } = this.$attrs;
      const {
        tracks,
        handles
      } = this.renderSlider();
      const sliderClassName = (0, _classNames.default)(prefixCls, className, {
        [`${prefixCls}-with-marks`]: Object.keys(marks).length,
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-vertical`]: vertical,
        [`${prefixCls}-horizontal`]: !vertical
      });
      const markProps = {
        vertical,
        marks,
        included,
        lowerBound: this.getLowerBound(),
        upperBound: this.getUpperBound(),
        max,
        min,
        reverse,
        class: `${prefixCls}-mark`,
        onClickLabel: disabled ? noop : this.onClickMarkLabel
      };
      const touchEvents = {
        [_supportsPassive.default ? 'onTouchstartPassive' : 'onTouchstart']: disabled ? noop : this.onTouchStart
      };
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "id": id,
        "ref": this.saveSlider,
        "tabindex": "-1",
        "class": sliderClassName
      }, touchEvents), {}, {
        "onMousedown": disabled ? noop : this.onMouseDown,
        "onMouseup": disabled ? noop : this.onMouseUp,
        "onKeydown": disabled ? noop : this.onKeyDown,
        "onFocus": disabled ? noop : this.onFocus,
        "onBlur": disabled ? noop : this.onBlur,
        "style": style
      }), [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-rail`,
        "style": (0, _extends2.default)((0, _extends2.default)({}, maximumTrackStyle), railStyle)
      }, null), tracks, (0, _vue.createVNode)(_Steps.default, {
        "prefixCls": prefixCls,
        "vertical": vertical,
        "reverse": reverse,
        "marks": marks,
        "dots": dots,
        "step": step,
        "included": included,
        "lowerBound": this.getLowerBound(),
        "upperBound": this.getUpperBound(),
        "max": max,
        "min": min,
        "dotStyle": dotStyle,
        "activeDotStyle": activeDotStyle
      }, null), handles, (0, _vue.createVNode)(_Marks.default, markProps, {
        mark: this.$slots.mark
      }), (0, _propsUtil.getSlot)(this)]);
    }
  });
}