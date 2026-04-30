import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent, onBeforeMount, ref, computed, onMounted, nextTick, watch } from 'vue';
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import PropTypes from '../_util/vue-types';
import KeyCode from '../_util/KeyCode';
import Wave from '../_util/wave';
import warning from '../_util/warning';
import { tuple, withInstall } from '../_util/type';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
export const SwitchSizes = tuple('small', 'default');
export const switchProps = () => ({
  id: String,
  prefixCls: String,
  size: PropTypes.oneOf(SwitchSizes),
  disabled: {
    type: Boolean,
    default: undefined
  },
  checkedChildren: PropTypes.any,
  unCheckedChildren: PropTypes.any,
  tabindex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  autofocus: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  checked: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.looseBool]),
  checkedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.looseBool]).def(true),
  unCheckedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.looseBool]).def(false),
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
const Switch = defineComponent({
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
    const formItemContext = useInjectFormItemContext();
    const disabledContext = useInjectDisabled();
    const mergedDisabled = computed(() => {
      var _a;
      return (_a = props.disabled) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    onBeforeMount(() => {
      warning(!('defaultChecked' in attrs), 'Switch', `'defaultChecked' is deprecated, please use 'v-model:checked'`);
      warning(!('value' in attrs), 'Switch', '`value` is not validate prop, do you mean `checked`?');
    });
    const checked = ref(props.checked !== undefined ? props.checked : attrs.defaultChecked);
    const checkedStatus = computed(() => checked.value === props.checkedValue);
    watch(() => props.checked, () => {
      checked.value = props.checked;
    });
    const {
      prefixCls,
      direction,
      size
    } = useConfigInject('switch', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const refSwitchNode = ref();
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
    onMounted(() => {
      nextTick(() => {
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
      if (e.keyCode === KeyCode.LEFT) {
        setChecked(props.unCheckedValue, e);
      } else if (e.keyCode === KeyCode.RIGHT) {
        setChecked(props.checkedValue, e);
      }
      emit('keydown', e);
    };
    const handleMouseUp = e => {
      var _a;
      (_a = refSwitchNode.value) === null || _a === void 0 ? void 0 : _a.blur();
      emit('mouseup', e);
    };
    const classNames = computed(() => ({
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
      return wrapSSR(_createVNode(Wave, null, {
        default: () => [_createVNode("button", _objectSpread(_objectSpread(_objectSpread({}, omit(props, ['prefixCls', 'checkedChildren', 'unCheckedChildren', 'checked', 'autofocus', 'checkedValue', 'unCheckedValue', 'id', 'onChange', 'onUpdate:checked'])), attrs), {}, {
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
        }), [_createVNode("div", {
          "class": `${prefixCls.value}-handle`
        }, [props.loading ? _createVNode(LoadingOutlined, {
          "class": `${prefixCls.value}-loading-icon`
        }, null) : null]), _createVNode("span", {
          "class": `${prefixCls.value}-inner`
        }, [_createVNode("span", {
          "class": `${prefixCls.value}-inner-checked`
        }, [getPropsSlot(slots, props, 'checkedChildren')]), _createVNode("span", {
          "class": `${prefixCls.value}-inner-unchecked`
        }, [getPropsSlot(slots, props, 'unCheckedChildren')])])])]
      }));
    };
  }
});
export default withInstall(Switch);