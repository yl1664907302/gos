import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import VcCascader, { cascaderProps as vcCascaderProps, SHOW_CHILD, SHOW_PARENT } from '../vc-cascader';
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import LeftOutlined from "@ant-design/icons-vue/es/icons/LeftOutlined";
import getIcons from '../select/utils/iconUtil';
import { withInstall } from '../_util/type';
import omit from '../_util/omit';
import { computed, defineComponent, ref, watchEffect } from 'vue';
import PropTypes from '../_util/vue-types';
import { initDefaultProps } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import devWarning from '../vc-util/devWarning';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import { useInjectFormItemContext } from '../form';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { FormItemInputContext } from '../form/FormItemContext';
import { useCompactItemContext } from '../space/Compact';
import useSelectStyle from '../select/style';
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
function highlightKeyword(str, lowerKeyword, prefixCls) {
  const cells = str.toLowerCase().split(lowerKeyword).reduce((list, cur, index) => index === 0 ? [cur] : [...list, lowerKeyword, cur], []);
  const fillCells = [];
  let start = 0;
  cells.forEach((cell, index) => {
    const end = start + cell.length;
    let originWorld = str.slice(start, end);
    start = end;
    if (index % 2 === 1) {
      const _originWorld = function () {
        return originWorld;
      }();
      originWorld = _createVNode("span", {
        "class": `${prefixCls}-menu-item-keyword`,
        "key": "seperator"
      }, [originWorld]);
    }
    fillCells.push(originWorld);
  });
  return fillCells;
}
const defaultSearchRender = _ref => {
  let {
    inputValue,
    path,
    prefixCls,
    fieldNames
  } = _ref;
  const optionList = [];
  // We do lower here to save perf
  const lower = inputValue.toLowerCase();
  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ');
    }
    let label = node[fieldNames.label];
    const type = typeof label;
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower, prefixCls);
    }
    optionList.push(label);
  });
  return optionList;
};
export function cascaderProps() {
  return _extends(_extends({}, omit(vcCascaderProps(), ['customSlots', 'checkable', 'options'])), {
    multiple: {
      type: Boolean,
      default: undefined
    },
    size: String,
    bordered: {
      type: Boolean,
      default: undefined
    },
    placement: {
      type: String
    },
    suffixIcon: PropTypes.any,
    status: String,
    options: Array,
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    'onUpdate:value': Function
  });
}
const Cascader = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ACascader',
  inheritAttrs: false,
  props: initDefaultProps(cascaderProps(), {
    bordered: true,
    choiceTransitionName: '',
    allowClear: true
  }),
  setup(props, _ref2) {
    let {
      attrs,
      expose,
      slots,
      emit
    } = _ref2;
    // ====================== Warning ======================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(!props.dropdownClassName, 'Cascader', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
    }
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      prefixCls: cascaderPrefixCls,
      rootPrefixCls,
      getPrefixCls,
      direction,
      getPopupContainer,
      renderEmpty,
      size: contextSize,
      disabled
    } = useConfigInject('cascader', props);
    const prefixCls = computed(() => getPrefixCls('select', props.prefixCls));
    const {
      compactSize,
      compactItemClassnames
    } = useCompactItemContext(prefixCls, direction);
    const mergedSize = computed(() => compactSize.value || contextSize.value);
    const contextDisabled = useInjectDisabled();
    const mergedDisabled = computed(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : contextDisabled.value;
    });
    const [wrapSelectSSR, hashId] = useSelectStyle(prefixCls);
    const [wrapCascaderSSR] = useStyle(cascaderPrefixCls);
    const isRtl = computed(() => direction.value === 'rtl');
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      watchEffect(() => {
        devWarning(!props.multiple || !props.displayRender || !slots.displayRender, 'Cascader', '`displayRender` not work on `multiple`. Please use `tagRender` instead.');
      });
    }
    // ==================== Search =====================
    const mergedShowSearch = computed(() => {
      if (!props.showSearch) {
        return props.showSearch;
      }
      let searchConfig = {
        render: defaultSearchRender
      };
      if (typeof props.showSearch === 'object') {
        searchConfig = _extends(_extends({}, searchConfig), props.showSearch);
      }
      return searchConfig;
    });
    // =================== Dropdown ====================
    const mergedDropdownClassName = computed(() => classNames(props.popupClassName || props.dropdownClassName, `${cascaderPrefixCls.value}-dropdown`, {
      [`${cascaderPrefixCls.value}-dropdown-rtl`]: isRtl.value
    }, hashId.value));
    const selectRef = ref();
    expose({
      focus() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.focus();
      },
      blur() {
        var _a;
        (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.blur();
      }
    });
    const handleChange = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      emit('blur', ...args);
      formItemContext.onFieldBlur();
    };
    const mergedShowArrow = computed(() => props.showArrow !== undefined ? props.showArrow : props.loading || !props.multiple);
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });
    return () => {
      var _a, _b;
      const {
          notFoundContent = (_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots),
          expandIcon = (_b = slots.expandIcon) === null || _b === void 0 ? void 0 : _b.call(slots),
          multiple,
          bordered,
          allowClear,
          choiceTransitionName,
          transitionName,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["notFoundContent", "expandIcon", "multiple", "bordered", "allowClear", "choiceTransitionName", "transitionName", "id"]);
      // =================== No Found ====================
      const mergedNotFoundContent = notFoundContent || renderEmpty('Cascader');
      // ===================== Icon ======================
      let mergedExpandIcon = expandIcon;
      if (!expandIcon) {
        mergedExpandIcon = isRtl.value ? _createVNode(LeftOutlined, null, null) : _createVNode(RightOutlined, null, null);
      }
      const loadingIcon = _createVNode("span", {
        "class": `${prefixCls.value}-menu-item-loading-icon`
      }, [_createVNode(LoadingOutlined, {
        "spin": true
      }, null)]);
      // ===================== Icons =====================
      const {
        suffixIcon,
        removeIcon,
        clearIcon
      } = getIcons(_extends(_extends({}, props), {
        hasFeedback: formItemInputContext.hasFeedback,
        feedbackIcon: formItemInputContext.feedbackIcon,
        multiple,
        prefixCls: prefixCls.value,
        showArrow: mergedShowArrow.value
      }), slots);
      return wrapCascaderSSR(wrapSelectSSR(_createVNode(VcCascader, _objectSpread(_objectSpread(_objectSpread({}, restProps), attrs), {}, {
        "id": id,
        "prefixCls": prefixCls.value,
        "class": [cascaderPrefixCls.value, {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: isRtl.value,
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput
        }, getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), compactItemClassnames.value, attrs.class, hashId.value],
        "disabled": mergedDisabled.value,
        "direction": direction.value,
        "placement": placement.value,
        "notFoundContent": mergedNotFoundContent,
        "allowClear": allowClear,
        "showSearch": mergedShowSearch.value,
        "expandIcon": mergedExpandIcon,
        "inputIcon": suffixIcon,
        "removeIcon": removeIcon,
        "clearIcon": clearIcon,
        "loadingIcon": loadingIcon,
        "checkable": !!multiple,
        "dropdownClassName": mergedDropdownClassName.value,
        "dropdownPrefixCls": cascaderPrefixCls.value,
        "choiceTransitionName": getTransitionName(rootPrefixCls.value, '', choiceTransitionName),
        "transitionName": getTransitionName(rootPrefixCls.value, getTransitionDirection(placement.value), transitionName),
        "getPopupContainer": getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        "customSlots": _extends(_extends({}, slots), {
          checkable: () => _createVNode("span", {
            "class": `${cascaderPrefixCls.value}-checkbox-inner`
          }, null)
        }),
        "tagRender": props.tagRender || slots.tagRender,
        "displayRender": props.displayRender || slots.displayRender,
        "maxTagPlaceholder": props.maxTagPlaceholder || slots.maxTagPlaceholder,
        "showArrow": formItemInputContext.hasFeedback || props.showArrow,
        "onChange": handleChange,
        "onBlur": handleBlur,
        "ref": selectRef
      }), slots)));
    };
  }
});
export default withInstall(_extends(Cascader, {
  SHOW_CHILD,
  SHOW_PARENT
}));