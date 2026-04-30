"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _BaseMixin = _interopRequireDefault(require("../../_util/BaseMixin"));
var _propsUtil = require("../../_util/props-util");
var _Track = _interopRequireDefault(require("./common/Track"));
var _createSlider = _interopRequireDefault(require("./common/createSlider"));
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Slider = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Slider',
  mixins: [_BaseMixin.default],
  inheritAttrs: false,
  props: {
    defaultValue: Number,
    value: Number,
    disabled: {
      type: Boolean,
      default: undefined
    },
    autofocus: {
      type: Boolean,
      default: undefined
    },
    tabindex: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
    reverse: {
      type: Boolean,
      default: undefined
    },
    min: Number,
    max: Number,
    ariaLabelForHandle: String,
    ariaLabelledByForHandle: String,
    ariaValueTextFormatterForHandle: String,
    startPoint: Number
  },
  emits: ['beforeChange', 'afterChange', 'change'],
  data() {
    const defaultValue = this.defaultValue !== undefined ? this.defaultValue : this.min;
    const value = this.value !== undefined ? this.value : defaultValue;
    return {
      sValue: this.trimAlignValue(value),
      dragging: false
    };
  },
  watch: {
    value: {
      handler(val) {
        this.setChangeValue(val);
      },
      deep: true
    },
    min() {
      const {
        sValue
      } = this;
      this.setChangeValue(sValue);
    },
    max() {
      const {
        sValue
      } = this;
      this.setChangeValue(sValue);
    }
  },
  methods: {
    setChangeValue(value) {
      const newValue = value !== undefined ? value : this.sValue;
      const nextValue = this.trimAlignValue(newValue, this.$props);
      if (nextValue === this.sValue) return;
      this.setState({
        sValue: nextValue
      });
      if (utils.isValueOutOfRange(newValue, this.$props)) {
        this.$emit('change', nextValue);
      }
    },
    onChange(state) {
      const isNotControlled = !(0, _propsUtil.hasProp)(this, 'value');
      const nextState = state.sValue > this.max ? (0, _extends2.default)((0, _extends2.default)({}, state), {
        sValue: this.max
      }) : state;
      if (isNotControlled) {
        this.setState(nextState);
      }
      const changedValue = nextState.sValue;
      this.$emit('change', changedValue);
    },
    onStart(position) {
      this.setState({
        dragging: true
      });
      const {
        sValue
      } = this;
      this.$emit('beforeChange', sValue);
      const value = this.calcValueByPos(position);
      this.startValue = value;
      this.startPosition = position;
      if (value === sValue) return;
      this.prevMovedHandleIndex = 0;
      this.onChange({
        sValue: value
      });
    },
    onEnd(force) {
      const {
        dragging
      } = this;
      this.removeDocumentEvents();
      if (dragging || force) {
        this.$emit('afterChange', this.sValue);
      }
      this.setState({
        dragging: false
      });
    },
    onMove(e, position) {
      utils.pauseEvent(e);
      const {
        sValue
      } = this;
      const value = this.calcValueByPos(position);
      if (value === sValue) return;
      this.onChange({
        sValue: value
      });
    },
    onKeyboard(e) {
      const {
        reverse,
        vertical
      } = this.$props;
      const valueMutator = utils.getKeyboardValueMutator(e, vertical, reverse);
      if (valueMutator) {
        utils.pauseEvent(e);
        const {
          sValue
        } = this;
        const mutatedValue = valueMutator(sValue, this.$props);
        const value = this.trimAlignValue(mutatedValue);
        if (value === sValue) return;
        this.onChange({
          sValue: value
        });
        this.$emit('afterChange', value);
        this.onEnd();
      }
    },
    getLowerBound() {
      const minPoint = this.$props.startPoint || this.$props.min;
      return this.$data.sValue > minPoint ? minPoint : this.$data.sValue;
    },
    getUpperBound() {
      if (this.$data.sValue < this.$props.startPoint) {
        return this.$props.startPoint;
      }
      return this.$data.sValue;
    },
    trimAlignValue(v) {
      let nextProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      if (v === null) {
        return null;
      }
      const mergedProps = (0, _extends2.default)((0, _extends2.default)({}, this.$props), nextProps);
      const val = utils.ensureValueInRange(v, mergedProps);
      return utils.ensureValuePrecision(val, mergedProps);
    },
    getTrack(_ref) {
      let {
        prefixCls,
        reverse,
        vertical,
        included,
        minimumTrackStyle,
        mergedTrackStyle,
        length,
        offset
      } = _ref;
      return (0, _vue.createVNode)(_Track.default, {
        "class": `${prefixCls}-track`,
        "vertical": vertical,
        "included": included,
        "offset": offset,
        "reverse": reverse,
        "length": length,
        "style": (0, _extends2.default)((0, _extends2.default)({}, minimumTrackStyle), mergedTrackStyle)
      }, null);
    },
    renderSlider() {
      const {
        prefixCls,
        vertical,
        included,
        disabled,
        minimumTrackStyle,
        trackStyle,
        handleStyle,
        tabindex,
        ariaLabelForHandle,
        ariaLabelledByForHandle,
        ariaValueTextFormatterForHandle,
        min,
        max,
        startPoint,
        reverse,
        handle,
        defaultHandle
      } = this;
      const handleGenerator = handle || defaultHandle;
      const {
        sValue,
        dragging
      } = this;
      const offset = this.calcOffset(sValue);
      const handles = handleGenerator({
        class: `${prefixCls}-handle`,
        prefixCls,
        vertical,
        offset,
        value: sValue,
        dragging,
        disabled,
        min,
        max,
        reverse,
        index: 0,
        tabindex,
        ariaLabel: ariaLabelForHandle,
        ariaLabelledBy: ariaLabelledByForHandle,
        ariaValueTextFormatter: ariaValueTextFormatterForHandle,
        style: handleStyle[0] || handleStyle,
        ref: h => this.saveHandle(0, h),
        onFocus: this.onFocus,
        onBlur: this.onBlur
      });
      const trackOffset = startPoint !== undefined ? this.calcOffset(startPoint) : 0;
      const mergedTrackStyle = trackStyle[0] || trackStyle;
      return {
        tracks: this.getTrack({
          prefixCls,
          reverse,
          vertical,
          included,
          offset: trackOffset,
          minimumTrackStyle,
          mergedTrackStyle,
          length: offset - trackOffset
        }),
        handles
      };
    }
  }
});
var _default = exports.default = (0, _createSlider.default)(Slider);