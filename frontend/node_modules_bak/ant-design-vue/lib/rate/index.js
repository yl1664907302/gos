"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rateProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _util = require("./util");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _StarFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/StarFilled"));
var _tooltip = _interopRequireDefault(require("../tooltip"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _Star = _interopRequireDefault(require("./Star"));
var _useRefs = _interopRequireDefault(require("../_util/hooks/useRefs"));
var _FormItemContext = require("../form/FormItemContext");
var _style = _interopRequireDefault(require("./style"));
const rateProps = () => ({
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
  character: _vueTypes.default.any,
  autofocus: {
    type: Boolean,
    default: undefined
  },
  tabindex: _vueTypes.default.oneOfType([_vueTypes.default.number, _vueTypes.default.string]),
  direction: String,
  id: String,
  onChange: Function,
  onHoverChange: Function,
  'onUpdate:value': Function,
  onFocus: Function,
  onBlur: Function,
  onKeydown: Function
});
exports.rateProps = rateProps;
const Rate = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ARate',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(rateProps(), {
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
    } = (0, _useConfigInject.default)('rate', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const rateRef = (0, _vue.ref)();
    const [setRef, starRefs] = (0, _useRefs.default)();
    const state = (0, _vue.reactive)({
      value: props.value,
      focused: false,
      cleanedValue: null,
      hoverValue: undefined
    });
    (0, _vue.watch)(() => props.value, () => {
      state.value = props.value;
    });
    const getStarDOM = index => {
      return (0, _propsUtil.findDOMNode)(starRefs.value.get(index));
    };
    const getStarValue = (index, x) => {
      const reverse = direction.value === 'rtl';
      let value = index + 1;
      if (props.allowHalf) {
        const starEle = getStarDOM(index);
        const leftDis = (0, _util.getOffsetLeft)(starEle);
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
      if (keyCode === _KeyCode.default.RIGHT && state.value < count && !reverse) {
        if (allowHalf) {
          state.value += 0.5;
        } else {
          state.value += 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === _KeyCode.default.LEFT && state.value > 0 && !reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === _KeyCode.default.RIGHT && state.value > 0 && reverse) {
        if (allowHalf) {
          state.value -= 0.5;
        } else {
          state.value -= 1;
        }
        changeValue(state.value);
        event.preventDefault();
      } else if (keyCode === _KeyCode.default.LEFT && state.value < count && reverse) {
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
    (0, _vue.onMounted)(() => {
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
      return (0, _vue.createVNode)(_tooltip.default, {
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
      const character = props.character || slots.character || (() => (0, _vue.createVNode)(_StarFilled.default, null, null));
      for (let index = 0; index < count; index++) {
        stars.push((0, _vue.createVNode)(_Star.default, {
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
      const rateClassName = (0, _classNames.default)(prefixCls.value, disabledClass, className, {
        [hashId.value]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      });
      return wrapSSR((0, _vue.createVNode)("ul", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
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
var _default = exports.default = (0, _type.withInstall)(Rate);