"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cascaderProps = cascaderProps;
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcCascader = _interopRequireWildcard(require("../vc-cascader"));
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _LeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LeftOutlined"));
var _iconUtil = _interopRequireDefault(require("../select/utils/iconUtil"));
var _type = require("../_util/type");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _transition = require("../_util/transition");
var _form = require("../form");
var _statusUtils = require("../_util/statusUtils");
var _FormItemContext = require("../form/FormItemContext");
var _Compact = require("../space/Compact");
var _style = _interopRequireDefault(require("../select/style"));
var _style2 = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
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
      originWorld = (0, _vue.createVNode)("span", {
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
function cascaderProps() {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _vcCascader.cascaderProps)(), ['customSlots', 'checkable', 'options'])), {
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
    suffixIcon: _vueTypes.default.any,
    status: String,
    options: Array,
    popupClassName: String,
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: String,
    'onUpdate:value': Function
  });
}
const Cascader = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACascader',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(cascaderProps(), {
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
      (0, _devWarning.default)(!props.dropdownClassName, 'Cascader', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
    }
    const formItemContext = (0, _form.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
    const {
      prefixCls: cascaderPrefixCls,
      rootPrefixCls,
      getPrefixCls,
      direction,
      getPopupContainer,
      renderEmpty,
      size: contextSize,
      disabled
    } = (0, _useConfigInject.default)('cascader', props);
    const prefixCls = (0, _vue.computed)(() => getPrefixCls('select', props.prefixCls));
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
    const [wrapSelectSSR, hashId] = (0, _style.default)(prefixCls);
    const [wrapCascaderSSR] = (0, _style2.default)(cascaderPrefixCls);
    const isRtl = (0, _vue.computed)(() => direction.value === 'rtl');
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      (0, _vue.watchEffect)(() => {
        (0, _devWarning.default)(!props.multiple || !props.displayRender || !slots.displayRender, 'Cascader', '`displayRender` not work on `multiple`. Please use `tagRender` instead.');
      });
    }
    // ==================== Search =====================
    const mergedShowSearch = (0, _vue.computed)(() => {
      if (!props.showSearch) {
        return props.showSearch;
      }
      let searchConfig = {
        render: defaultSearchRender
      };
      if (typeof props.showSearch === 'object') {
        searchConfig = (0, _extends2.default)((0, _extends2.default)({}, searchConfig), props.showSearch);
      }
      return searchConfig;
    });
    // =================== Dropdown ====================
    const mergedDropdownClassName = (0, _vue.computed)(() => (0, _classNames.default)(props.popupClassName || props.dropdownClassName, `${cascaderPrefixCls.value}-dropdown`, {
      [`${cascaderPrefixCls.value}-dropdown-rtl`]: isRtl.value
    }, hashId.value));
    const selectRef = (0, _vue.ref)();
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
    const mergedShowArrow = (0, _vue.computed)(() => props.showArrow !== undefined ? props.showArrow : props.loading || !props.multiple);
    const placement = (0, _vue.computed)(() => {
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
        mergedExpandIcon = isRtl.value ? (0, _vue.createVNode)(_LeftOutlined.default, null, null) : (0, _vue.createVNode)(_RightOutlined.default, null, null);
      }
      const loadingIcon = (0, _vue.createVNode)("span", {
        "class": `${prefixCls.value}-menu-item-loading-icon`
      }, [(0, _vue.createVNode)(_LoadingOutlined.default, {
        "spin": true
      }, null)]);
      // ===================== Icons =====================
      const {
        suffixIcon,
        removeIcon,
        clearIcon
      } = (0, _iconUtil.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
        hasFeedback: formItemInputContext.hasFeedback,
        feedbackIcon: formItemInputContext.feedbackIcon,
        multiple,
        prefixCls: prefixCls.value,
        showArrow: mergedShowArrow.value
      }), slots);
      return wrapCascaderSSR(wrapSelectSSR((0, _vue.createVNode)(_vcCascader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), attrs), {}, {
        "id": id,
        "prefixCls": prefixCls.value,
        "class": [cascaderPrefixCls.value, {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: isRtl.value,
          [`${prefixCls.value}-borderless`]: !bordered,
          [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput
        }, (0, _statusUtils.getStatusClassNames)(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), compactItemClassnames.value, attrs.class, hashId.value],
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
        "choiceTransitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, '', choiceTransitionName),
        "transitionName": (0, _transition.getTransitionName)(rootPrefixCls.value, (0, _transition.getTransitionDirection)(placement.value), transitionName),
        "getPopupContainer": getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        "customSlots": (0, _extends2.default)((0, _extends2.default)({}, slots), {
          checkable: () => (0, _vue.createVNode)("span", {
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
var _default = exports.default = (0, _type.withInstall)((0, _extends2.default)(Cascader, {
  SHOW_CHILD: _vcCascader.SHOW_CHILD,
  SHOW_PARENT: _vcCascader.SHOW_PARENT
}));