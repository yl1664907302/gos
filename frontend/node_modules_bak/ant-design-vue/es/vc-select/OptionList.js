import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import TransBtn from './TransBtn';
import KeyCode from '../_util/KeyCode';
import classNames from '../_util/classNames';
import pickAttrs from '../_util/pickAttrs';
import { isValidElement } from '../_util/props-util';
import createRef from '../_util/createRef';
import { computed, defineComponent, nextTick, reactive, toRaw, watch } from 'vue';
import List from '../vc-virtual-list';
import useMemo from '../_util/hooks/useMemo';
import { isPlatformMac } from './utils/platformUtil';
import omit from '../_util/omit';
import useBaseProps from './hooks/useBaseProps';
import useSelectProps from './SelectContext';
function isTitleType(content) {
  return typeof content === 'string' || typeof content === 'number';
}
/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'OptionList',
  inheritAttrs: false,
  setup(_, _ref) {
    let {
      expose,
      slots
    } = _ref;
    const baseProps = useBaseProps();
    const props = useSelectProps();
    const itemPrefixCls = computed(() => `${baseProps.prefixCls}-item`);
    const memoFlattenOptions = useMemo(() => props.flattenOptions, [() => baseProps.open, () => props.flattenOptions], next => next[0]);
    // =========================== List ===========================
    const listRef = createRef();
    const onListMouseDown = event => {
      event.preventDefault();
    };
    const scrollIntoView = args => {
      if (listRef.current) {
        listRef.current.scrollTo(typeof args === 'number' ? {
          index: args
        } : args);
      }
    };
    // ========================== Active ==========================
    const getEnabledActiveIndex = function (index) {
      let offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      const len = memoFlattenOptions.value.length;
      for (let i = 0; i < len; i += 1) {
        const current = (index + i * offset + len) % len;
        const {
          group,
          data
        } = memoFlattenOptions.value[current];
        if (!group && !data.disabled) {
          return current;
        }
      }
      return -1;
    };
    const state = reactive({
      activeIndex: getEnabledActiveIndex(0)
    });
    const setActive = function (index) {
      let fromKeyboard = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      state.activeIndex = index;
      const info = {
        source: fromKeyboard ? 'keyboard' : 'mouse'
      };
      // Trigger active event
      const flattenItem = memoFlattenOptions.value[index];
      if (!flattenItem) {
        props.onActiveValue(null, -1, info);
        return;
      }
      props.onActiveValue(flattenItem.value, index, info);
    };
    // Auto active first item when list length or searchValue changed
    watch([() => memoFlattenOptions.value.length, () => baseProps.searchValue], () => {
      setActive(props.defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
    }, {
      immediate: true
    });
    // https://github.com/ant-design/ant-design/issues/34975
    const isSelected = value => props.rawValues.has(value) && baseProps.mode !== 'combobox';
    // Auto scroll to item position in single mode
    watch([() => baseProps.open, () => baseProps.searchValue], () => {
      if (!baseProps.multiple && baseProps.open && props.rawValues.size === 1) {
        const value = Array.from(props.rawValues)[0];
        const index = toRaw(memoFlattenOptions.value).findIndex(_ref2 => {
          let {
            data
          } = _ref2;
          return data[props.fieldNames.value] === value;
        });
        if (index !== -1) {
          setActive(index);
          nextTick(() => {
            scrollIntoView(index);
          });
        }
      }
      // Force trigger scrollbar visible when open
      if (baseProps.open) {
        nextTick(() => {
          var _a;
          (_a = listRef.current) === null || _a === void 0 ? void 0 : _a.scrollTo(undefined);
        });
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    // ========================== Values ==========================
    const onSelectValue = value => {
      if (value !== undefined) {
        props.onSelect(value, {
          selected: !props.rawValues.has(value)
        });
      }
      // Single mode should always close by select
      if (!baseProps.multiple) {
        baseProps.toggleOpen(false);
      }
    };
    const getLabel = item => typeof item.label === 'function' ? item.label() : item.label;
    function renderItem(index) {
      const item = memoFlattenOptions.value[index];
      if (!item) return null;
      const itemData = item.data || {};
      const {
        value
      } = itemData;
      const {
        group
      } = item;
      const attrs = pickAttrs(itemData, true);
      const mergedLabel = getLabel(item);
      return item ? _createVNode("div", _objectSpread(_objectSpread({
        "aria-label": typeof mergedLabel === 'string' && !group ? mergedLabel : null
      }, attrs), {}, {
        "key": index,
        "role": group ? 'presentation' : 'option',
        "id": `${baseProps.id}_list_${index}`,
        "aria-selected": isSelected(value)
      }), [value]) : null;
    }
    const onKeydown = event => {
      const {
        which,
        ctrlKey
      } = event;
      switch (which) {
        // >>> Arrow keys & ctrl + n/p on Mac
        case KeyCode.N:
        case KeyCode.P:
        case KeyCode.UP:
        case KeyCode.DOWN:
          {
            let offset = 0;
            if (which === KeyCode.UP) {
              offset = -1;
            } else if (which === KeyCode.DOWN) {
              offset = 1;
            } else if (isPlatformMac() && ctrlKey) {
              if (which === KeyCode.N) {
                offset = 1;
              } else if (which === KeyCode.P) {
                offset = -1;
              }
            }
            if (offset !== 0) {
              const nextActiveIndex = getEnabledActiveIndex(state.activeIndex + offset, offset);
              scrollIntoView(nextActiveIndex);
              setActive(nextActiveIndex, true);
            }
            break;
          }
        // >>> Select
        case KeyCode.ENTER:
          {
            // value
            const item = memoFlattenOptions.value[state.activeIndex];
            if (item && !item.data.disabled) {
              onSelectValue(item.value);
            } else {
              onSelectValue(undefined);
            }
            if (baseProps.open) {
              event.preventDefault();
            }
            break;
          }
        // >>> Close
        case KeyCode.ESC:
          {
            baseProps.toggleOpen(false);
            if (baseProps.open) {
              event.stopPropagation();
            }
          }
      }
    };
    const onKeyup = () => {};
    const scrollTo = index => {
      scrollIntoView(index);
    };
    expose({
      onKeydown,
      onKeyup,
      scrollTo
    });
    return () => {
      // const {
      //   renderItem,
      //   listRef,
      //   onListMouseDown,
      //   itemPrefixCls,
      //   setActive,
      //   onSelectValue,
      //   memoFlattenOptions,
      //   $slots,
      // } = this as any;
      const {
        id,
        notFoundContent,
        onPopupScroll
      } = baseProps;
      const {
        menuItemSelectedIcon,
        fieldNames,
        virtual,
        listHeight,
        listItemHeight
      } = props;
      const renderOption = slots.option;
      const {
        activeIndex
      } = state;
      const omitFieldNameList = Object.keys(fieldNames).map(key => fieldNames[key]);
      // ========================== Render ==========================
      if (memoFlattenOptions.value.length === 0) {
        return _createVNode("div", {
          "role": "listbox",
          "id": `${id}_list`,
          "class": `${itemPrefixCls.value}-empty`,
          "onMousedown": onListMouseDown
        }, [notFoundContent]);
      }
      return _createVNode(_Fragment, null, [_createVNode("div", {
        "role": "listbox",
        "id": `${id}_list`,
        "style": {
          height: 0,
          width: 0,
          overflow: 'hidden'
        }
      }, [renderItem(activeIndex - 1), renderItem(activeIndex), renderItem(activeIndex + 1)]), _createVNode(List, {
        "itemKey": "key",
        "ref": listRef,
        "data": memoFlattenOptions.value,
        "height": listHeight,
        "itemHeight": listItemHeight,
        "fullHeight": false,
        "onMousedown": onListMouseDown,
        "onScroll": onPopupScroll,
        "virtual": virtual
      }, {
        default: (item, itemIndex) => {
          var _a;
          const {
            group,
            groupOption,
            data,
            value
          } = item;
          const {
            key
          } = data;
          const label = typeof item.label === 'function' ? item.label() : item.label;
          // Group
          if (group) {
            const groupTitle = (_a = data.title) !== null && _a !== void 0 ? _a : isTitleType(label) && label;
            return _createVNode("div", {
              "class": classNames(itemPrefixCls.value, `${itemPrefixCls.value}-group`),
              "title": groupTitle
            }, [renderOption ? renderOption(data) : label !== undefined ? label : key]);
          }
          const {
              disabled,
              title,
              children,
              style,
              class: cls,
              className
            } = data,
            otherProps = __rest(data, ["disabled", "title", "children", "style", "class", "className"]);
          const passedProps = omit(otherProps, omitFieldNameList);
          // Option
          const selected = isSelected(value);
          const optionPrefixCls = `${itemPrefixCls.value}-option`;
          const optionClassName = classNames(itemPrefixCls.value, optionPrefixCls, cls, className, {
            [`${optionPrefixCls}-grouped`]: groupOption,
            [`${optionPrefixCls}-active`]: activeIndex === itemIndex && !disabled,
            [`${optionPrefixCls}-disabled`]: disabled,
            [`${optionPrefixCls}-selected`]: selected
          });
          const mergedLabel = getLabel(item);
          const iconVisible = !menuItemSelectedIcon || typeof menuItemSelectedIcon === 'function' || selected;
          // https://github.com/ant-design/ant-design/issues/34145
          const content = typeof mergedLabel === 'number' ? mergedLabel : mergedLabel || value;
          // https://github.com/ant-design/ant-design/issues/26717
          let optionTitle = isTitleType(content) ? content.toString() : undefined;
          if (title !== undefined) {
            optionTitle = title;
          }
          return _createVNode("div", _objectSpread(_objectSpread({}, passedProps), {}, {
            "aria-selected": selected,
            "class": optionClassName,
            "title": optionTitle,
            "onMousemove": e => {
              if (otherProps.onMousemove) {
                otherProps.onMousemove(e);
              }
              if (activeIndex === itemIndex || disabled) {
                return;
              }
              setActive(itemIndex);
            },
            "onClick": e => {
              if (!disabled) {
                onSelectValue(value);
              }
              if (otherProps.onClick) {
                otherProps.onClick(e);
              }
            },
            "style": style
          }), [_createVNode("div", {
            "class": `${optionPrefixCls}-content`
          }, [renderOption ? renderOption(data) : content]), isValidElement(menuItemSelectedIcon) || selected, iconVisible && _createVNode(TransBtn, {
            "class": `${itemPrefixCls.value}-option-state`,
            "customizeIcon": menuItemSelectedIcon,
            "customizeIconProps": {
              isSelected: selected
            }
          }, {
            default: () => [selected ? '✓' : null]
          })]);
        }
      })]);
    };
  }
});
export default OptionList;