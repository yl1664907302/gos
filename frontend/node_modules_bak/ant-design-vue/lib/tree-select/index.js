"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.TreeSelectNode = void 0;
exports.treeSelectProps = treeSelectProps;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcTreeSelect = _interopRequireWildcard(require("../vc-tree-select"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _iconUtil = _interopRequireDefault(require("../select/utils/iconUtil"));
var _iconUtil2 = _interopRequireDefault(require("../tree/utils/iconUtil"));
var _warning = require("../vc-util/warning");
var _propsUtil = require("../_util/props-util");
var _FormItemContext = require("../form/FormItemContext");
var _transition = require("../_util/transition");
var _statusUtils = require("../_util/statusUtils");
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("../select/style"));
var _style2 = _interopRequireDefault(require("./style"));
var _Compact = require("../space/Compact");
var _DisabledContext = require("../config-provider/DisabledContext");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// CSSINJS

const getTransitionName = (rootPrefixCls, motion, transitionName) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};
function treeSelectProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _vcTreeSelect.treeSelectProps)(), ['showTreeIcon', 'treeMotion', 'inputIcon', 'getInputElement', 'treeLine', 'customSlots'])), {
    suffixIcon: _vueTypes.default.any,
    size: (0, _type.stringType)(),
    bordered: (0, _type.booleanType)(),
    treeLine: (0, _type.someType)([Boolean, Object]),
    replaceFields: (0, _type.objectType)(),
    placement: (0, _type.stringType)(),
    status: (0, _type.stringType)(),
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    'onUpdate:value': (0, _type.functionType)(),
    'onUpdate:treeExpandedKeys': (0, _type.functionType)(),
    'onUpdate:searchValue': (0, _type.functionType)()
  });
}
const TreeSelect = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATreeSelect',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(treeSelectProps(), {
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
    (0, _warning.warning)(!(props.treeData === undefined && slots.default), '`children` of TreeSelect is deprecated. Please use `treeData` instead.');
    (0, _devWarning.default)(props.multiple !== false || !props.treeCheckable, 'TreeSelect', '`multiple` will always be `true` when `treeCheckable` is true');
    (0, _devWarning.default)(props.replaceFields === undefined, 'TreeSelect', '`replaceFields` is deprecated, please use fieldNames instead');
    (0, _devWarning.default)(!props.dropdownClassName, 'TreeSelect', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
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
    } = (0, _useConfigInject.default)('select', props);
    const {
      compactSize,
      compactItemClassnames
    } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
    const mergedSize = (0, _vue.computed)(() => compactSize.value || contextSize.value);
    const contextDisabled = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : contextDisabled.value;
    });
    const rootPrefixCls = (0, _vue.computed)(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = (0, _vue.computed)(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });
    const transitionName = (0, _vue.computed)(() => getTransitionName(rootPrefixCls.value, (0, _transition.getTransitionDirection)(placement.value), props.transitionName));
    const choiceTransitionName = (0, _vue.computed)(() => getTransitionName(rootPrefixCls.value, '', props.choiceTransitionName));
    const treePrefixCls = (0, _vue.computed)(() => getPrefixCls('select-tree', props.prefixCls));
    const treeSelectPrefixCls = (0, _vue.computed)(() => getPrefixCls('tree-select', props.prefixCls));
    // style
    const [wrapSelectSSR, hashId] = (0, _style.default)(prefixCls);
    const [wrapTreeSelectSSR] = (0, _style2.default)(treeSelectPrefixCls, treePrefixCls);
    const mergedDropdownClassName = (0, _vue.computed)(() => (0, _classNames.default)(props.popupClassName || props.dropdownClassName, `${treeSelectPrefixCls.value}-dropdown`, {
      [`${treeSelectPrefixCls.value}-dropdown-rtl`]: direction.value === 'rtl'
    }, hashId.value));
    const isMultiple = (0, _vue.computed)(() => !!(props.treeCheckable || props.multiple));
    const mergedShowArrow = (0, _vue.computed)(() => props.showArrow !== undefined ? props.showArrow : props.loading || !isMultiple.value);
    const treeSelectRef = (0, _vue.ref)();
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
      } = (0, _iconUtil.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
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
      const selectProps = (0, _omit.default)(props, ['suffixIcon', 'itemIcon', 'removeIcon', 'clearIcon', 'switcherIcon', 'bordered', 'status', 'onUpdate:value', 'onUpdate:treeExpandedKeys', 'onUpdate:searchValue']);
      const mergedClassName = (0, _classNames.default)(!customizePrefixCls && treeSelectPrefixCls.value, {
        [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
        [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-borderless`]: !bordered,
        [`${prefixCls.value}-in-form-item`]: isFormItemInput
      }, (0, _statusUtils.getStatusClassNames)(prefixCls.value, mergedStatus.value, hasFeedback), compactItemClassnames.value, attrs.class, hashId.value);
      const otherProps = {};
      if (props.treeData === undefined && slots.default) {
        otherProps.children = (0, _propsUtil.flattenChildren)(slots.default());
      }
      return wrapSelectSSR(wrapTreeSelectSSR((0, _vue.createVNode)(_vcTreeSelect.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), selectProps), {}, {
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
        "switcherIcon": nodeProps => (0, _iconUtil2.default)(treePrefixCls.value, switcherIcon, nodeProps, slots.leafIcon, treeLine),
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
        "customSlots": (0, _extends2.default)((0, _extends2.default)({}, slots), {
          treeCheckable: () => (0, _vue.createVNode)("span", {
            "class": `${prefixCls.value}-tree-checkbox-inner`
          }, null)
        }),
        "maxTagPlaceholder": props.maxTagPlaceholder || slots.maxTagPlaceholder,
        "placement": placement.value,
        "showArrow": hasFeedback || showArrow,
        "placeholder": placeholder
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        treeCheckable: () => (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-tree-checkbox-inner`
        }, null)
      }))));
    };
  }
});
/* istanbul ignore next */
const TreeSelectNode = exports.TreeSelectNode = _vcTreeSelect.TreeNode;
var _default = exports.default = (0, _extends2.default)(TreeSelect, {
  TreeNode: _vcTreeSelect.TreeNode,
  SHOW_ALL: _vcTreeSelect.SHOW_ALL,
  SHOW_PARENT: _vcTreeSelect.SHOW_PARENT,
  SHOW_CHILD: _vcTreeSelect.SHOW_CHILD,
  install: app => {
    app.component(TreeSelect.name, TreeSelect);
    app.component(TreeSelectNode.displayName, TreeSelectNode);
    return app;
  }
});