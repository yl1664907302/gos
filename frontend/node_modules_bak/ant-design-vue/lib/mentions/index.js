"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mentionsProps = exports.default = exports.MentionsOption = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _vcMentions = _interopRequireDefault(require("../vc-mentions"));
var _mentionsProps = require("../vc-mentions/src/mentionsProps");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _propsUtil = require("../_util/props-util");
var _FormItemContext = require("../form/FormItemContext");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _Option = require("../vc-mentions/src/Option");
var _statusUtils = require("../_util/statusUtils");
var _style = _interopRequireDefault(require("./style"));
var _OverrideContext = require("../menu/src/OverrideContext");
var _warning = _interopRequireDefault(require("../_util/warning"));
var _spin = _interopRequireDefault(require("../spin"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function loadingFilterOption() {
  return true;
}
const getMentions = function () {
  let value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    prefix = '@',
    split = ' '
  } = config;
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];
  return value.split(split).map(function () {
    let str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    let hitPrefix = null;
    prefixList.some(prefixStr => {
      const startStr = str.slice(0, prefixStr.length);
      if (startStr === prefixStr) {
        hitPrefix = prefixStr;
        return true;
      }
      return false;
    });
    if (hitPrefix !== null) {
      return {
        prefix: hitPrefix,
        value: str.slice(hitPrefix.length)
      };
    }
    return null;
  }).filter(entity => !!entity && !!entity.value);
};
const mentionsProps = () => (0, _extends2.default)((0, _extends2.default)({}, _mentionsProps.mentionsProps), {
  loading: {
    type: Boolean,
    default: undefined
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  },
  onSelect: {
    type: Function
  },
  onChange: {
    type: Function
  },
  onPressenter: {
    type: Function
  },
  'onUpdate:value': {
    type: Function
  },
  notFoundContent: _vueTypes.default.any,
  defaultValue: String,
  id: String,
  status: String
});
exports.mentionsProps = mentionsProps;
const Mentions = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AMentions',
  inheritAttrs: false,
  props: mentionsProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs,
      expose
    } = _ref;
    var _a, _b, _c;
    // =================== Warning =====================
    if (process.env.NODE_ENV !== 'production') {
      (0, _devWarning.default)(!(0, _propsUtil.flattenChildren)(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []).length, 'Mentions', '`Mentions.Option` is deprecated. Please use `options` instead.');
    }
    const {
      prefixCls,
      renderEmpty,
      direction
    } = (0, _useConfigInject.default)('mentions', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const focused = (0, _vue.shallowRef)(false);
    const vcMentions = (0, _vue.shallowRef)(null);
    const value = (0, _vue.shallowRef)((_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.defaultValue) !== null && _c !== void 0 ? _c : '');
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
    (0, _OverrideContext.useProvideOverride)({
      prefixCls: (0, _vue.computed)(() => `${prefixCls.value}-menu`),
      mode: (0, _vue.computed)(() => 'vertical'),
      selectable: (0, _vue.computed)(() => false),
      onClick: () => {},
      validator: _ref2 => {
        let {
          mode
        } = _ref2;
        // Warning if use other mode
        (0, _warning.default)(!mode || mode === 'vertical', 'Mentions', `mode="${mode}" is not supported for Mentions's Menu.`);
      }
    });
    (0, _vue.watch)(() => props.value, val => {
      value.value = val;
    });
    const handleFocus = e => {
      focused.value = true;
      emit('focus', e);
    };
    const handleBlur = e => {
      focused.value = false;
      emit('blur', e);
      formItemContext.onFieldBlur();
    };
    const handleSelect = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      emit('select', ...args);
      focused.value = true;
    };
    const handleChange = val => {
      if (props.value === undefined) {
        value.value = val;
      }
      emit('update:value', val);
      emit('change', val);
      formItemContext.onFieldChange();
    };
    const getNotFoundContent = () => {
      const notFoundContent = props.notFoundContent;
      if (notFoundContent !== undefined) {
        return notFoundContent;
      }
      if (slots.notFoundContent) {
        return slots.notFoundContent();
      }
      return renderEmpty('Select');
    };
    const getOptions = () => {
      var _a;
      return (0, _propsUtil.flattenChildren)(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []).map(item => {
        var _a, _b;
        return (0, _extends2.default)((0, _extends2.default)({}, (0, _propsUtil.getOptionProps)(item)), {
          label: (_b = (_a = item.children) === null || _a === void 0 ? void 0 : _a.default) === null || _b === void 0 ? void 0 : _b.call(_a)
        });
      });
    };
    const focus = () => {
      vcMentions.value.focus();
    };
    const blur = () => {
      vcMentions.value.blur();
    };
    expose({
      focus,
      blur
    });
    const mentionsfilterOption = (0, _vue.computed)(() => props.loading ? loadingFilterOption : props.filterOption);
    return () => {
      const {
          disabled,
          getPopupContainer,
          rows = 1,
          id = formItemContext.id.value
        } = props,
        restProps = __rest(props, ["disabled", "getPopupContainer", "rows", "id"]);
      const {
        hasFeedback,
        feedbackIcon
      } = formItemInputContext;
      const {
          class: className
        } = attrs,
        otherAttrs = __rest(attrs, ["class"]);
      const otherProps = (0, _omit.default)(restProps, ['defaultValue', 'onUpdate:value', 'prefixCls']);
      const mergedClassName = (0, _classNames.default)({
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-focused`]: focused.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, (0, _statusUtils.getStatusClassNames)(prefixCls.value, mergedStatus.value), !hasFeedback && className, hashId.value);
      const mentionsProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
        prefixCls: prefixCls.value
      }, otherProps), {
        disabled,
        direction: direction.value,
        filterOption: mentionsfilterOption.value,
        getPopupContainer,
        options: props.loading ? [{
          value: 'ANTDV_SEARCHING',
          disabled: true,
          label: (0, _vue.createVNode)(_spin.default, {
            "size": "small"
          }, null)
        }] : props.options || getOptions(),
        class: mergedClassName
      }), otherAttrs), {
        rows,
        onChange: handleChange,
        onSelect: handleSelect,
        onFocus: handleFocus,
        onBlur: handleBlur,
        ref: vcMentions,
        value: value.value,
        id
      });
      const mentions = (0, _vue.createVNode)(_vcMentions.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, mentionsProps), {}, {
        "dropdownClassName": hashId.value
      }), {
        notFoundContent: getNotFoundContent,
        option: slots.option
      });
      if (hasFeedback) {
        return wrapSSR((0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${prefixCls.value}-affix-wrapper`, (0, _statusUtils.getStatusClassNames)(`${prefixCls.value}-affix-wrapper`, mergedStatus.value, hasFeedback), className, hashId.value)
        }, [mentions, (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-suffix`
        }, [feedbackIcon])]));
      }
      return wrapSSR(mentions);
    };
  }
});
/* istanbul ignore next */
const MentionsOption = exports.MentionsOption = (0, _vue.defineComponent)((0, _extends2.default)((0, _extends2.default)({
  compatConfig: {
    MODE: 3
  }
}, _Option.optionOptions), {
  name: 'AMentionsOption',
  props: _Option.optionProps
}));
var _default = exports.default = (0, _extends2.default)(Mentions, {
  Option: MentionsOption,
  getMentions,
  install: app => {
    app.component(Mentions.name, Mentions);
    app.component(MentionsOption.name, MentionsOption);
    return app;
  }
});