"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectProps = exports.default = exports.SelectOption = exports.SelectOptGroup = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcSelect = _interopRequireWildcard(require("../vc-select"));
var _iconUtil = _interopRequireDefault(require("./utils/iconUtil"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _renderEmpty = require("../config-provider/renderEmpty");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _FormItemContext = require("../form/FormItemContext");
var _transition = require("../_util/transition");
var _propsUtil = require("../_util/props-util");
var _statusUtils = require("../_util/statusUtils");
var _type = require("../_util/type");
var _Compact = require("../space/Compact");
var _style = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
// CSSINJS

const selectProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)((0, _vcSelect.selectProps)(), ['inputIcon', 'mode', 'getInputElement', 'getRawInputElement', 'backfill'])), {
  value: (0, _type.someType)([Array, Object, String, Number]),
  defaultValue: (0, _type.someType)([Array, Object, String, Number]),
  notFoundContent: _vueTypes.default.any,
  suffixIcon: _vueTypes.default.any,
  itemIcon: _vueTypes.default.any,
  size: (0, _type.stringType)(),
  mode: (0, _type.stringType)(),
  bordered: (0, _type.booleanType)(true),
  transitionName: String,
  choiceTransitionName: (0, _type.stringType)(''),
  popupClassName: String,
  /** @deprecated Please use `popupClassName` instead */
  dropdownClassName: String,
  placement: (0, _type.stringType)(),
  status: (0, _type.stringType)(),
  'onUpdate:value': (0, _type.functionType)()
});
exports.selectProps = selectProps;
const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
const Select = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASelect',
  Option: _vcSelect.Option,
  OptGroup: _vcSelect.OptGroup,
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)(selectProps(), {
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
    const selectRef = (0, _vue.ref)();
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
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
    const mode = (0, _vue.computed)(() => {
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
      (0, _devWarning.default)(!props.dropdownClassName, 'Select', '`dropdownClassName` is deprecated. Please use `popupClassName` instead.');
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
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const rootPrefixCls = (0, _vue.computed)(() => getPrefixCls());
    // ===================== Placement =====================
    const placement = (0, _vue.computed)(() => {
      if (props.placement !== undefined) {
        return props.placement;
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft';
    });
    const transitionName = (0, _vue.computed)(() => (0, _transition.getTransitionName)(rootPrefixCls.value, (0, _transition.getTransitionDirection)(placement.value), props.transitionName));
    const mergedClassName = (0, _vue.computed)(() => (0, _classNames.default)({
      [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
      [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-borderless`]: !props.bordered,
      [`${prefixCls.value}-in-form-item`]: formItemInputContext.isFormItemInput
    }, (0, _statusUtils.getStatusClassNames)(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), compactItemClassnames.value, hashId.value));
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
    const isMultiple = (0, _vue.computed)(() => mode.value === 'multiple' || mode.value === 'tags');
    const mergedShowArrow = (0, _vue.computed)(() => props.showArrow !== undefined ? props.showArrow : props.loading || !(isMultiple.value || mode.value === 'combobox'));
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
        mergedNotFound = (renderEmpty === null || renderEmpty === void 0 ? void 0 : renderEmpty('Select')) || (0, _vue.createVNode)(_renderEmpty.DefaultRenderEmpty, {
          "componentName": "Select"
        }, null);
      }
      // ===================== Icons =====================
      const {
        suffixIcon,
        itemIcon,
        removeIcon,
        clearIcon
      } = (0, _iconUtil.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
        multiple: isMultiple.value,
        prefixCls: prefixCls.value,
        hasFeedback,
        feedbackIcon,
        showArrow: mergedShowArrow.value
      }), slots);
      const selectProps = (0, _omit.default)(props, ['prefixCls', 'suffixIcon', 'itemIcon', 'removeIcon', 'clearIcon', 'size', 'bordered', 'status']);
      const rcSelectRtlDropdownClassName = (0, _classNames.default)(popupClassName || dropdownClassName, {
        [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl'
      }, hashId.value);
      return wrapSSR((0, _vue.createVNode)(_vcSelect.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({
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
const SelectOption = exports.SelectOption = Select.Option;
const SelectOptGroup = exports.SelectOptGroup = Select.OptGroup;
var _default = exports.default = Select;