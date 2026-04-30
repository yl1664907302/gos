import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { watch, defineComponent, ref, reactive, onMounted } from 'vue';
import { initDefaultProps, findDOMNode } from '../_util/props-util';
import { withInstall } from '../_util/type';
import { getOffsetLeft } from './util';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import StarFilled from "@ant-design/icons-vue/es/icons/StarFilled";
import Tooltip from '../tooltip';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Star from './Star';
import useRefs from '../_util/hooks/useRefs';
import { useInjectFormItemContext } from '../form/FormItemContext';
import useStyle from './style';
export const rateProps = () => ({
  prefixCls: String,
  count: Number,
  value: Number,
  allowHalf: {
    type: Boolean,
    default: undefined
  },
  allowClear: {
    type: Boolean,
    default: undefined
  },
  tooltips: Array,
  disabled: {
    type: Boolean,
    default: undefined
  },
  character: PropTypes.any,
  autofocus: {
    type: Boolean,
    default: undefined
  },
  tabindex: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  direction: String,
  id: String,
  onChange: Function,
  onHoverChange: Function,
  'onUpdate:value': Function,
  onFocus: Function,
  onBlur: Function,
  onKeydown: Function
});
const Rate = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ARate',
  inheritAttrs: false,
  props: initDefaultProps(rateProps(), {
    value: 0,
    count: 5,
    allowHalf: false,
    allowClear: true,
    tabindex: 0,
    direction: 'ltr'
  }),
  // emits: ['hoverChange', 'update:value', 'change', 'focus', 'blur', 'keydown'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit,
      expose
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('rate', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const formItemContext = useInjectFormItemContext();
    const rateRef = ref();
    const [setRef, starRefs] = useRefs();
    const state = reactive({
      value: props.value,
      focused: false,
      cleanedValue: null,
      hoverValue: undefined
    });
    watch(() => props.value, () => {
      state.value = props.value;
    });
    const getStarDOM = index => {
      return findDOMNode(starRefs.value.get(index));
    };
    const getStarValue = (index, x) => {
      const reverse = direction.value === 'rtl';
      let value = index + 1;
      if (props.allowHalf) {
        const starEle = getStarDOM(index);
        const leftDis = getOffsetLeft(starEle);
        const width = starEle.clientWidth;
        if (reverse && x - leftDis > width / 2) {
          value -= 0.5;
        } else if (!reverse && x - leftDis < width / 2) {
          value -= 0.5;
        }
      }
      return value;
    };
    const changeValue = value => {
      if (props.value === undefined) {
        state.value = value;
      }
      emit('update:value', value);
      emit('change', value);
      formItemContext.onFieldChange();
    };
    const onHover = (e, index) => {
      const hoverValue = getStarValue(index, e.pageX);
      if (hoverValue !== state.cleanedValue) {
        state.hoverValue = hoverValue;
        state.cleanedValue = null;
      }
      emit('hoverChange', hoverValue);
    };
    const onMouseLeave = () => {
      state.hoverValue = undefined;
      state.cleanedValue = null;
      emit('hoverChange', undefined);
    };
    const onClick = (event, index) => {
      const {
        allowClear
      } = props;
      const newValue = getStarValue(index, event.pageX);
      let isReset = false;
      if (allowClear) {
        isReset = newValue === state.value;
      }
      onMouseLeave();
      changeValue(isReset ? 0 : newValue);
      state.cleanedValue = isReset ? newValue : null;
    };
    const onFocus = e => {
      state.focused = true;
      emit('focus', e);
    };
    const onBlur = e => {
      state.focused = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const onKeyDown = event => {
      const {
        keyCode
      } = event;
      const {
        count,
        allowHalf
      } = props;
      const reverse = direction.value === 'rtl';
      if (keyCode === KeyCode.RIGHT && state.value < count && !reverse) {
        if (allowHalf) {
          state.value += 0.5;
        } else {
          state.value += 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && state.value > 0 && !reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.RIGHT && state.value > 0 && reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === KeyCode.LEFT && state.value < count && reverse) {
        if (allowHalf) {
          state.value += 0.5;
        } else {
          state.value += 1;
        }
        changeValue(state.value);
        event.preventDefault();
      }
      emit('keydown', event);
    };
    const focus = () => {
      if (!props.disabled) {
        rateRef.value.focus();
      }
    };
    const blur = () => {
      if (!props.disabled) {
        rateRef.value.blur();
      }
    };
    expose({
      focus,
      blur
    });
    onMounted(() => {
      const {
        autofocus,
        disabled
      } = props;
      if (autofocus && !disabled) {
        focus();
      }
    });
    const characterRender = (node, _ref2) => {
      let {
        index
      } = _ref2;
      const {
        tooltips
      } = props;
      if (!tooltips) return node;
      return _createVNode(Tooltip, {
        "title": tooltips[index]
      }, {
        default: () => [node]
      });
    };
    return () => {
      const {
        count,
        allowHalf,
        disabled,
        tabindex,
        id = formItemContext.id.value
      } = props;
      const {
        class: className,
        style
      } = attrs;
      const stars = [];
      const disabledClass = disabled ? `${prefixCls.value}-disabled` : '';
      const character = props.character || slots.character || (() => _createVNode(StarFilled, null, null));
      for (let index = 0; index < count; index++) {
        stars.push(_createVNode(Star, {
          "ref": setRef(index),
          "key": index,
          "index": index,
          "count": count,
          "disabled": disabled,
          "prefixCls": `${prefixCls.value}-star`,
          "allowHalf": allowHalf,
          "value": state.hoverValue === undefined ? state.value : state.hoverValue,
          "onClick": onClick,
          "onHover": onHover,
          "character": character,
          "characterRender": characterRender,
          "focused": state.focused
        }, null));
      }
      const rateClassName = classNames(prefixCls.value, disabledClass, className, {
        [hashId.value]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      });
      return wrapSSR(_createVNode("ul", _objectSpread(_objectSpread({}, attrs), {}, {
        "id": id,
        "class": rateClassName,
        "style": style,
        "onMouseleave": disabled ? null : onMouseLeave,
        "tabindex": disabled ? -1 : tabindex,
        "onFocus": disabled ? null : onFocus,
        "onBlur": disabled ? null : onBlur,
        "onKeydown": disabled ? null : onKeyDown,
        "ref": rateRef,
        "role": "radiogroup"
      }), [stars]));
    };
  }
});
export default withInstall(Rate);