"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.switchProps = exports.default = exports.SwitchSizes = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _wave = _interopRequireDefault(require("../_util/wave"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _type = require("../_util/type");
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _FormItemContext = require("../form/FormItemContext");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _style = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
const SwitchSizes = exports.SwitchSizes = (0, _type.tuple)('small', 'default');
const switchProps = () => ({
  id: String,
  prefixCls: String,
  size: _vueTypes.default.oneOf(SwitchSizes),
  disabled: {
    type: Boolean,
    default: undefined
  },
  checkedChildren: _vueTypes.default.any,
  unCheckedChildren: _vueTypes.default.any,
  tabindex: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number]),
  autofocus: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  checked: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number, _vueTypes.default.looseBool]),
  checkedValue: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number, _vueTypes.default.looseBool]).def(true),
  unCheckedValue: _vueTypes.default.oneOfType([_vueTypes.default.string, _vueTypes.default.number, _vueTypes.default.looseBool]).def(false),
  onChange: {
    type: Function
  },
  onClick: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onMouseup: {
    type: Function
  },
  'onUpdate:checked': {
    type: Function
  },
  onBlur: Function,
  onFocus: Function
});
exports.switchProps = switchProps;
const Switch = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASwitch',
  __ANT_SWITCH: true,
  inheritAttrs: false,
  props: switchProps(),
  slots: Object,
  // emits: ['update:checked', 'mouseup', 'change', 'click', 'keydown', 'blur'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose,
      emit
    } = _ref;
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const disabledContext = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.disabled) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    (0, _vue.onBeforeMount)(() => {
      (0, _warning.default)(!('defaultChecked' in attrs), 'Switch', `'defaultChecked' is deprecated, please use 'v-model:checked'`);
      (0, _warning.default)(!('value' in attrs), 'Switch', '`value` is not validate prop, do you mean `checked`?');
    });
    const checked = (0, _vue.ref)(props.checked !== undefined ? props.checked : attrs.defaultChecked);
    const checkedStatus = (0, _vue.computed)(() => checked.value === props.checkedValue);
    (0, _vue.watch)(() => props.checked, () => {
      checked.value = props.checked;
    });
    const {
      prefixCls,
      direction,
      size
    } = (0, _useConfigInject.default)('switch', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const refSwitchNode = (0, _vue.ref)();
    const focus = () => {
      var _a;
      (_a = refSwitchNode.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = refSwitchNode.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        if (props.autofocus && !mergedDisabled.value) {
          refSwitchNode.value.focus();
        }
      });
    });
    const setChecked = (check, e) => {
      if (mergedDisabled.value) {
        return;
      }
      emit('update:checked', check);
      emit('change', check, e);
      formItemContext.onFieldChange();
    };
    const handleBlur = e => {
      emit('blur', e);
    };
    const handleClick = e => {
      focus();
      const newChecked = checkedStatus.value ? props.unCheckedValue : props.checkedValue;
      setChecked(newChecked, e);
      emit('click', newChecked, e);
    };
    const handleKeyDown = e => {
      if (e.keyCode === _KeyCode.default.LEFT) {
        setChecked(props.unCheckedValue, e);
      } else if (e.keyCode === _KeyCode.default.RIGHT) {
        setChecked(props.checkedValue, e);
      }
      emit('keydown', e);
    };
    const handleMouseUp = e => {
      var _a;
      (_a = refSwitchNode.value) === null || _a === void 0 ? void 0 : _a.blur();
      emit('mouseup', e);
    };
    const classNames = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-small`]: size.value === 'small',
      [`${prefixCls.value}-loading`]: props.loading,
      [`${prefixCls.value}-checked`]: checkedStatus.value,
      [`${prefixCls.value}-disabled`]: mergedDisabled.value,
      [prefixCls.value]: true,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [hashId.value]: true
    }));
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)(_wave.default, null, {
        default: () => [(0, _vue.createVNode)("button", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(props, ['prefixCls', 'checkedChildren', 'unCheckedChildren', 'checked', 'autofocus', 'checkedValue', 'unCheckedValue', 'id', 'onChange', 'onUpdate:checked'])), attrs), {}, {
          "id": (_a = props.id) !== null && _a !== void 0 ? _a : formItemContext.id.value,
          "onKeydown": handleKeyDown,
          "onClick": handleClick,
          "onBlur": handleBlur,
          "onMouseup": handleMouseUp,
          "type": "button",
          "role": "switch",
          "aria-checked": checked.value,
          "disabled": mergedDisabled.value || props.loading,
          "class": [attrs.class, classNames.value],
          "ref": refSwitchNode
        }), [(0, _vue.createVNode)("div", {
          "class": `${prefixCls.value}-handle`
        }, [props.loading ? (0, _vue.createVNode)(_LoadingOutlined.default, {
          "class": `${prefixCls.value}-loading-icon`
        }, null) : null]), (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-inner`
        }, [(0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-inner-checked`
        }, [(0, _propsUtil.getPropsSlot)(slots, props, 'checkedChildren')]), (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-inner-unchecked`
        }, [(0, _propsUtil.getPropsSlot)(slots, props, 'unCheckedChildren')])])])]
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Switch);