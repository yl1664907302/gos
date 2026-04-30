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
import { computed, watch, shallowRef, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import VcMentions from '../vc-mentions';
import { mentionsProps as baseMentionsProps } from '../vc-mentions/src/mentionsProps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { flattenChildren, getOptionProps } from '../_util/props-util';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import omit from '../_util/omit';
import { optionProps, optionOptions } from '../vc-mentions/src/Option';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import useStyle from './style';
import { useProvideOverride } from '../menu/src/OverrideContext';
import warning from '../_util/warning';
import Spin from '../spin';
import devWarning from '../vc-util/devWarning';
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
export const mentionsProps = () => _extends(_extends({}, baseMentionsProps), {
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
  notFoundContent: PropTypes.any,
  defaultValue: String,
  id: String,
  status: String
});
const Mentions = defineComponent({
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
      devWarning(!flattenChildren(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []).length, 'Mentions', '`Mentions.Option` is deprecated. Please use `options` instead.');
    }
    const {
      prefixCls,
      renderEmpty,
      direction
    } = useConfigInject('mentions', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const focused = shallowRef(false);
    const vcMentions = shallowRef(null);
    const value = shallowRef((_c = (_b = props.value) !== null && _b !== void 0 ? _b : props.defaultValue) !== null && _c !== void 0 ? _c : '');
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    useProvideOverride({
      prefixCls: computed(() => `${prefixCls.value}-menu`),
      mode: computed(() => 'vertical'),
      selectable: computed(() => false),
      onClick: () => {},
      validator: _ref2 => {
        let {
          mode
        } = _ref2;
        // Warning if use other mode
        warning(!mode || mode === 'vertical', 'Mentions', `mode="${mode}" is not supported for Mentions's Menu.`);
      }
    });
    watch(() => props.value, val => {
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
      return flattenChildren(((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || []).map(item => {
        var _a, _b;
        return _extends(_extends({}, getOptionProps(item)), {
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
    const mentionsfilterOption = computed(() => props.loading ? loadingFilterOption : props.filterOption);
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
      const otherProps = omit(restProps, ['defaultValue', 'onUpdate:value', 'prefixCls']);
      const mergedClassName = classNames({
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-focused`]: focused.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, getStatusClassNames(prefixCls.value, mergedStatus.value), !hasFeedback && className, hashId.value);
      const mentionsProps = _extends(_extends(_extends(_extends({
        prefixCls: prefixCls.value
      }, otherProps), {
        disabled,
        direction: direction.value,
        filterOption: mentionsfilterOption.value,
        getPopupContainer,
        options: props.loading ? [{
          value: 'ANTDV_SEARCHING',
          disabled: true,
          label: _createVNode(Spin, {
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
      const mentions = _createVNode(VcMentions, _objectSpread(_objectSpread({}, mentionsProps), {}, {
        "dropdownClassName": hashId.value
      }), {
        notFoundContent: getNotFoundContent,
        option: slots.option
      });
      if (hasFeedback) {
        return wrapSSR(_createVNode("div", {
          "class": classNames(`${prefixCls.value}-affix-wrapper`, getStatusClassNames(`${prefixCls.value}-affix-wrapper`, mergedStatus.value, hasFeedback), className, hashId.value)
        }, [mentions, _createVNode("span", {
          "class": `${prefixCls.value}-suffix`
        }, [feedbackIcon])]));
      }
      return wrapSSR(mentions);
    };
  }
});
/* istanbul ignore next */
export const MentionsOption = defineComponent(_extends(_extends({
  compatConfig: {
    MODE: 3
  }
}, optionOptions), {
  name: 'AMentionsOption',
  props: optionProps
}));
export default _extends(Mentions, {
  Option: MentionsOption,
  getMentions,
  install: app => {
    app.component(Mentions.name, Mentions);
    app.component(MentionsOption.name, MentionsOption);
    return app;
  }
});