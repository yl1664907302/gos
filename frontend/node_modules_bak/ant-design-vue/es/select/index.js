import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent, ref } from 'vue';
import classNames from '../_util/classNames';
import RcSelect, { selectProps as vcSelectProps, Option, OptGroup } from '../vc-select';
import getIcons from './utils/iconUtil';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { DefaultRenderEmpty } from '../config-provider/renderEmpty';
import omit from '../_util/omit';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import { getTransitionDirection, getTransitionName } from '../_util/transition';
import { initDefaultProps } from '../_util/props-util';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { stringType, someType, functionType, booleanType } from '../_util/type';
import { useCompactItemContext } from '../space/Compact';
// CSSINJS
import useStyle from './style';
import { useInjectDisabled } from '../config-provider/DisabledContext';
import devWarning from '../vc-util/devWarning';
export const selectProps = () => _extends(_extends({}, omit(vcSelectProps(), ['inputIcon', 'mode', 'getInputElement', 'getRawInputElement', 'backfill'])), {
  value: someType([Array, Object, String, Number]),
  defaultValue: someType([Array, Object, String, Number]),
  notFoundContent: PropTypes.any,
  suffixIcon: PropTypes.any,
  itemIcon: PropTypes.any,
  size: stringType(),
  mode: stringType(),
  bordered: booleanType(true),
  transitionName: String,
  choiceTransitionName: stringType(''),
  popupClassName: String,
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName: String,
  placement: stringType(),
  status: stringType(),
  'onUpdate:value': functionType()
});
const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const Select = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASelect',
  Option,
  OptGroup,
  inheritAttrs: false,
  props: initDefaultProps(selectProps(), {
    listHeight: 256,
    listItemHeight: 24
  }),
  SECRET_COMBOBOX_MODE_DO_NOT_USE,
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots,
      expose
    } = _ref;
    const selectRef = ref();
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const focus = () => {
      var _a;
      (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    const scrollTo = arg => {
      var _a;
      (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(arg);
    };
    const mode = computed(() => {
      const {
        mode
      } = props;
      if (mode === 'combobox') {
        return undefined;
      }
      if (mode === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
        return 'combobox';
      }
      return mode;
    });
    // ====================== Warning ======================
    if (process.env.NODE_ENV !== 'production') {
      devWarning(!props.dropdownClassName, 'Select', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
    }
    const {
      prefixCls,
      direction,
      configProvider,
      renderEmpty,
      size: contextSize,
      getPrefixCls,
      getPopupContainer,
      disabled,
      select
    } = useConfigInject('select', props);
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
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootPrefixCls = computed(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });
    const transitionName = computed(() => getTransitionName(rootPrefixCls.value, getTransitionDirection(placement.value), props.transitionName));
    const mergedClassName = computed(() => classNames({
      [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
      [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-borderless`]: !props.bordered,
      [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput
    }, getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), compactItemClassnames.value, hashId.value));
    const triggerChange = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      emit('update:value', args[0]);
      emit('change', ...args);
      formItemContext.onFieldChange();
    };
    const handleBlur = e => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    expose({
      blur,
      focus,
      scrollTo
    });
    const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags');
    const mergedShowArrow = computed(() => props.showArrow !== undefined ? props.showArrow : props.loading || !(isMultiple.value || mode.value === 'combobox'));
    return () => {
      var _a, _b, _c, _d;
      const {
        notFoundContent,
        listHeight = 256,
        listItemHeight = 24,
        popupClassName,
        dropdownClassName,
        virtual,
        dropdownMatchSelectWidth,
        id = formItemContext.id.value,
        placeholder = (_a = slots.placeholder) === null || _a === void 0 ? void 0 : _a.call(slots),
        showArrow
      } = props;
      const {
        hasFeedback,
        feedbackIcon
      } = formItemInputContext;
      const {} = configProvider;
      // ===================== Empty =====================
      let mergedNotFound;
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else if (slots.notFoundContent) {
        mergedNotFound = slots.notFoundContent();
      } else if (mode.value === 'combobox') {
        mergedNotFound = null;
      } else {
        mergedNotFound = (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Select')) || _createVNode(DefaultRenderEmpty, {
          "componentName": "Select"
        }, null);
      }
      // ===================== Icons =====================
      const {
        suffixIcon,
        itemIcon,
        removeIcon,
        clearIcon
      } = getIcons(_extends(_extends({}, props), {
        multiple: isMultiple.value,
        prefixCls: prefixCls.value,
        hasFeedback,
        feedbackIcon,
        showArrow: mergedShowArrow.value
      }), slots);
      const selectProps = omit(props, ['prefixCls', 'suffixIcon', 'itemIcon', 'removeIcon', 'clearIcon', 'size', 'bordered', 'status']);
      const rcSelectRtlDropdownClassName = classNames(popupClassName || dropdownClassName, {
        [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl'
      }, hashId.value);
      return wrapSSR(_createVNode(RcSelect, _objectSpread(_objectSpread(_objectSpread({
        "ref": selectRef,
        "virtual": virtual,
        "dropdownMatchSelectWidth": dropdownMatchSelectWidth
      }, selectProps), attrs), {}, {
        "showSearch": (_b = props.showSearch) !== null && _b !== void 0 ? _b : (_c = select === null || select === void 0 ? void 0 : select.value) === null || _c === void 0 ? void 0 : _c.showSearch,
        "placeholder": placeholder,
        "listHeight": listHeight,
        "listItemHeight": listItemHeight,
        "mode": mode.value,
        "prefixCls": prefixCls.value,
        "direction": direction.value,
        "inputIcon": suffixIcon,
        "menuItemSelectedIcon": itemIcon,
        "removeIcon": removeIcon,
        "clearIcon": clearIcon,
        "notFoundContent": mergedNotFound,
        "class": [mergedClassName.value, attrs.class],
        "getPopupContainer": getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        "dropdownClassName": rcSelectRtlDropdownClassName,
        "onChange": triggerChange,
        "onBlur": handleBlur,
        "id": id,
        "dropdownRender": selectProps.dropdownRender || slots.dropdownRender,
        "transitionName": transitionName.value,
        "children": (_d = slots.default) === null || _d === void 0 ? void 0 : _d.call(slots),
        "tagRender": props.tagRender || slots.tagRender,
        "optionLabelRender": slots.optionLabel,
        "maxTagPlaceholder": props.maxTagPlaceholder || slots.maxTagPlaceholder,
        "showArrow": hasFeedback || showArrow,
        "disabled": mergedDisabled.value
      }), {
        option: slots.option
      }));
    };
  }
});
/* istanbul ignore next */
Select.install = function (app) {
  app.component(Select.name, Select);
  app.component(Select.Option.displayName, Select.Option);
  app.component(Select.OptGroup.displayName, Select.OptGroup);
  return app;
};
export const SelectOption = Select.Option;
export const SelectOptGroup = Select.OptGroup;
export default Select;