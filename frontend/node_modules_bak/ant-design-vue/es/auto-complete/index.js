import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent, ref } from 'vue';
import Select, { selectProps } from '../select';
import { isValidElement, flattenChildren } from '../_util/props-util';
import warning from '../_util/warning';
import Option from './Option';
import OptGroup from './OptGroup';
import omit from '../_util/omit';
import useConfigInject from '../config-provider/hooks/useConfigInject';
function isSelectOptionOrSelectOptGroup(child) {
  var _a, _b;
  return ((_a = child === null || child === void 0 ? void 0 : child.type) === null || _a === void 0 ? void 0 : _a.isSelectOption) || ((_b = child === null || child === void 0 ? void 0 : child.type) === null || _b === void 0 ? void 0 : _b.isSelectOptGroup);
}
export const autoCompleteProps = () => _extends(_extends({}, omit(selectProps(), ['loading', 'mode', 'optionLabelProp', 'labelInValue'])), {
  dataSource: Array,
  dropdownMenuStyle: {
    type: Object,
    default: undefined
  },
  // optionLabelProp: String,
  dropdownMatchSelectWidth: {
    type: [Number, Boolean],
    default: true
  },
  prefixCls: String,
  showSearch: {
    type: Boolean,
    default: undefined
  },
  transitionName: String,
  choiceTransitionName: {
    type: String,
    default: 'zoom'
  },
  autofocus: {
    type: Boolean,
    default: undefined
  },
  backfill: {
    type: Boolean,
    default: undefined
  },
  // optionLabelProp: PropTypes.string.def('children'),
  filterOption: {
    type: [Boolean, Function],
    default: false
  },
  defaultActiveFirstOption: {
    type: Boolean,
    default: true
  },
  status: String
});
export const AutoCompleteOption = Option;
export const AutoCompleteOptGroup = OptGroup;
const AutoComplete = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AAutoComplete',
  inheritAttrs: false,
  props: autoCompleteProps(),
  // emits: ['change', 'select', 'focus', 'blur'],
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    warning(!('dataSource' in slots), 'AutoComplete', '`dataSource` slot is deprecated, please use props `options` instead.');
    warning(!('options' in slots), 'AutoComplete', '`options` slot is deprecated, please use props `options` instead.');
    warning(!props.dropdownClassName, 'AutoComplete', '`dropdownClassName` is deprecated, please use `popupClassName` instead.');
    const selectRef = ref();
    const getInputElement = () => {
      var _a;
      const children = flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      const element = children.length ? children[0] : undefined;
      return element;
    };
    const focus = () => {
      var _a;
      (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = selectRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    const {
      prefixCls
    } = useConfigInject('select', props);
    return () => {
      var _a, _b, _c;
      const {
        size,
        dataSource,
        notFoundContent = (_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = props;
      let optionChildren;
      const {
        class: className
      } = attrs;
      const cls = {
        [className]: !!className,
        [`${prefixCls.value}-lg`]: size === 'large',
        [`${prefixCls.value}-sm`]: size === 'small',
        [`${prefixCls.value}-show-search`]: true,
        [`${prefixCls.value}-auto-complete`]: true
      };
      if (props.options === undefined) {
        const childArray = ((_b = slots.dataSource) === null || _b === void 0 ? void 0 : _b.call(slots)) || ((_c = slots.options) === null || _c === void 0 ? void 0 : _c.call(slots)) || [];
        if (childArray.length && isSelectOptionOrSelectOptGroup(childArray[0])) {
          optionChildren = childArray;
        } else {
          optionChildren = dataSource ? dataSource.map(item => {
            if (isValidElement(item)) {
              return item;
            }
            switch (typeof item) {
              case 'string':
                return _createVNode(Option, {
                  "key": item,
                  "value": item
                }, {
                  default: () => [item]
                });
              case 'object':
                return _createVNode(Option, {
                  "key": item.value,
                  "value": item.value
                }, {
                  default: () => [item.text]
                });
              default:
                throw new Error('AutoComplete[dataSource] only supports type `string[] | Object[]`.');
            }
          }) : [];
        }
      }
      const selectProps = omit(_extends(_extends(_extends({}, props), attrs), {
        mode: Select.SECRET_COMBOBOX_MODE_DO_NOT_USE,
        // optionLabelProp,
        getInputElement,
        notFoundContent,
        // placeholder: '',
        class: cls,
        popupClassName: props.popupClassName || props.dropdownClassName,
        ref: selectRef
      }), ['dataSource', 'loading']);
      return _createVNode(Select, selectProps, _objectSpread({
        default: () => [optionChildren]
      }, omit(slots, ['default', 'dataSource', 'options'])));
    };
  }
});
/* istanbul ignore next */
export default _extends(AutoComplete, {
  Option,
  OptGroup,
  install(app) {
    app.component(AutoComplete.name, AutoComplete);
    app.component(Option.displayName, Option);
    app.component(OptGroup.displayName, OptGroup);
    return app;
  }
});