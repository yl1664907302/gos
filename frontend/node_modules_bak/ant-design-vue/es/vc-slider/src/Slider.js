import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import PropTypes from '../../_util/vue-types';
import BaseMixin from '../../_util/BaseMixin';
import { hasProp } from '../../_util/props-util';
import Track from './common/Track';
import createSlider from './common/createSlider';
import * as utils from './utils';
import { defineComponent } from 'vue';
const Slider = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Slider',
  mixins: [BaseMixin],
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
    tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
      const isNotControlled = !hasProp(this, 'value');
      const nextState = state.sValue > this.max ? _extends(_extends({}, state), {
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
      const mergedProps = _extends(_extends({}, this.$props), nextProps);
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
      return _createVNode(Track, {
        "class": `${prefixCls}-track`,
        "vertical": vertical,
        "included": included,
        "offset": offset,
        "reverse": reverse,
        "length": length,
        "style": _extends(_extends({}, minimumTrackStyle), mergedTrackStyle)
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
export default createSlider(Slider);