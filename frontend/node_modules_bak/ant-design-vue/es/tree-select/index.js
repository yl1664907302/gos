import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, ref, defineComponent } from 'vue';
import VcTreeSelect, { TreeNode, SHOW_ALL, SHOW_PARENT, SHOW_CHILD, treeSelectProps as vcTreeSelectProps } from '../vc-tree-select';
import classNames from '../_util/classNames';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import omit from '../_util/omit';
import PropTypes from '../_util/vue-types';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import getIcons from '../select/utils/iconUtil';
import renderSwitcherIcon from '../tree/utils/iconUtil';
import { warning } from '../vc-util/warning';
import { flattenChildren } from '../_util/props-util';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import { getTransitionDirection } from '../_util/transition';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { booleanType, stringType, objectType, someType, functionType } from '../_util/type';
// CSSINJS
import useSelectStyle from '../select/style';
import useStyle from './style';
import { useCompactItemContext } from '../space/Compact';
import { useInjectDisabled } from '../config-provider/DisabledContext';
const getTransitionName = (rootPrefixCls, motion, transitionName) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};
export function treeSelectProps() {
  return _extends(_extends({}, omit(vcTreeSelectProps(), ['showTreeIcon', 'treeMotion', 'inputIcon', 'getInputElement', 'treeLine', 'customSlots'])), {
    suffixIcon: PropTypes.any,
    size: stringType(),
    bordered: booleanType(),
    treeLine: someType([Boolean, Object]),
    replaceFields: objectType(),
    placement: stringType(),
    status: stringType(),
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    'onUpdate:value': functionType(),
    'onUpdate:treeExpandedKeys': functionType(),
    'onUpdate:searchValue': functionType()
  });
}
const TreeSelect = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATreeSelect',
  inheritAttrs: false,
  props: initDefaultProps(treeSelectProps(), {
    choiceTransitionName: '',
    listHeight: 256,
    treeIcon: false,
    listItemHeight: 26,
    bordered: true
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose,
      emit
    } = _ref;
    warning(!(props.treeData === undefined && slots.default), '`children` of TreeSelect is deprecated. Please use `treeData` instead.');
    devWarning(props.multiple !== false || !props.treeCheckable, 'TreeSelect', '`multiple` will always be `true` when `treeCheckable` is true');
    devWarning(props.replaceFields === undefined, 'TreeSelect', '`replaceFields` is deprecated, please use fieldNames instead');
    devWarning(!props.dropdownClassName, 'TreeSelect', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    const {
      prefixCls,
      renderEmpty,
      direction,
      virtual,
      dropdownMatchSelectWidth,
      size: contextSize,
      getPopupContainer,
      getPrefixCls,
      disabled
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
    const rootPrefixCls = computed(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = computed(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });
    const transitionName = computed(() => getTransitionName(rootPrefixCls.value, getTransitionDirection(placement.value), props.transitionName));
    const choiceTransitionName = computed(() => getTransitionName(rootPrefixCls.value, '', props.choiceTransitionName));
    const treePrefixCls = computed(() => getPrefixCls('select-tree', props.prefixCls));
    const treeSelectPrefixCls = computed(() => getPrefixCls('tree-select', props.prefixCls));
    // style
    const [wrapSelectSSR, hashId] = useSelectStyle(prefixCls);
    const [wrapTreeSelectSSR] = useStyle(treeSelectPrefixCls, treePrefixCls);
    const mergedDropdownClassName = computed(() => classNames(props.popupClassName || props.dropdownClassName, `${treeSelectPrefixCls.value}-dropdown`, {
      [`${treeSelectPrefixCls.value}-dropdown-rtl`]: direction.value === 'rtl'
    }, hashId.value));
    const isMultiple = computed(() => !!(props.treeCheckable || props.multiple));
    const mergedShowArrow = computed(() => props.showArrow !== undefined ? props.showArrow : props.loading || !isMultiple.value);
    const treeSelectRef = ref();
    expose({
      focus() {
        var _a, _b;
        (_b = (_a = treeSelectRef.value).focus) === null || _b === void 0 ? void 0 : _b.call(_a);
      },
      blur() {
        var _a, _b;
        (_b = (_a = treeSelectRef.value).blur) === null || _b === void 0 ? void 0 : _b.call(_a);
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
    const handleTreeExpand = keys => {
      emit('update:treeExpandedKeys', keys);
      emit('treeExpand', keys);
    };
    const handleSearch = value => {
      emit('update:searchValue', value);
      emit('search', value);
    };
    const handleBlur = e => {
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    return () => {
      var _a, _b, _c;
      const {
        notFoundContent = (_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots),
        prefixCls: customizePrefixCls,
        bordered,
        listHeight,
        listItemHeight,
        multiple,
        treeIcon,
        treeLine,
        showArrow,
        switcherIcon = (_b = slots.switcherIcon) === null || _b === void 0 ? void 0 : _b.call(slots),
        fieldNames = props.replaceFields,
        id = formItemContext.id.value,
        placeholder = (_c = slots.placeholder) === null || _c === void 0 ? void 0 : _c.call(slots)
      } = props;
      const {
        isFormItemInput,
        hasFeedback,
        feedbackIcon
      } = formItemInputContext;
      // ===================== Icons =====================
      const {
        suffixIcon,
        removeIcon,
        clearIcon
      } = getIcons(_extends(_extends({}, props), {
        multiple: isMultiple.value,
        showArrow: mergedShowArrow.value,
        hasFeedback,
        feedbackIcon,
        prefixCls: prefixCls.value
      }), slots);
      // ===================== Empty =====================
      let mergedNotFound;
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent;
      } else {
        mergedNotFound = renderEmpty('Select');
      }
      // ==================== Render =====================
      const selectProps = omit(props, ['suffixIcon', 'itemIcon', 'removeIcon', 'clearIcon', 'switcherIcon', 'bordered', 'status', 'onUpdate:value', 'onUpdate:treeExpandedKeys', 'onUpdate:searchValue']);
      const mergedClassName = classNames(!customizePrefixCls && treeSelectPrefixCls.value, {
        [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
        [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-borderless`]: !bordered,
        [`${prefixCls.value}-in-form-item`]: isFormItemInput
      }, getStatusClassNames(prefixCls.value, mergedStatus.value, hasFeedback), compactItemClassnames.value, attrs.class, hashId.value);
      const otherProps = {};
      if (props.treeData === undefined && slots.default) {
        otherProps.children = flattenChildren(slots.default());
      }
      return wrapSelectSSR(wrapTreeSelectSSR(_createVNode(VcTreeSelect, _objectSpread(_objectSpread(_objectSpread(_objectSpread({}, attrs), selectProps), {}, {
        "disabled": mergedDisabled.value,
        "virtual": virtual.value,
        "dropdownMatchSelectWidth": dropdownMatchSelectWidth.value,
        "id": id,
        "fieldNames": fieldNames,
        "ref": treeSelectRef,
        "prefixCls": prefixCls.value,
        "class": mergedClassName,
        "listHeight": listHeight,
        "listItemHeight": listItemHeight,
        "treeLine": !!treeLine,
        "inputIcon": suffixIcon,
        "multiple": multiple,
        "removeIcon": removeIcon,
        "clearIcon": clearIcon,
        "switcherIcon": nodeProps => renderSwitcherIcon(treePrefixCls.value, switcherIcon, nodeProps, slots.leafIcon, treeLine),
        "showTreeIcon": treeIcon,
        "notFoundContent": mergedNotFound,
        "getPopupContainer": getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        "treeMotion": null,
        "dropdownClassName": mergedDropdownClassName.value,
        "choiceTransitionName": choiceTransitionName.value,
        "onChange": handleChange,
        "onBlur": handleBlur,
        "onSearch": handleSearch,
        "onTreeExpand": handleTreeExpand
      }, otherProps), {}, {
        "transitionName": transitionName.value,
        "customSlots": _extends(_extends({}, slots), {
          treeCheckable: () => _createVNode("span", {
            "class": `${prefixCls.value}-tree-checkbox-inner`
          }, null)
        }),
        "maxTagPlaceholder": props.maxTagPlaceholder || slots.maxTagPlaceholder,
        "placement": placement.value,
        "showArrow": hasFeedback || showArrow,
        "placeholder": placeholder
      }), _extends(_extends({}, slots), {
        treeCheckable: () => _createVNode("span", {
          "class": `${prefixCls.value}-tree-checkbox-inner`
        }, null)
      }))));
    };
  }
});
/* istanbul ignore next */
export const TreeSelectNode = TreeNode;
export default _extends(TreeSelect, {
  TreeNode,
  SHOW_ALL: SHOW_ALL,
  SHOW_PARENT: SHOW_PARENT,
  SHOW_CHILD: SHOW_CHILD,
  install: app => {
    app.component(TreeSelect.name, TreeSelect);
    app.component(TreeSelectNode.displayName, TreeSelectNode);
    return app;
  }
});