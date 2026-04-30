"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _TransBtn = _interopRequireDefault(require("./TransBtn"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _propsUtil = require("../_util/props-util");
var _createRef = _interopRequireDefault(require("../_util/createRef"));
var _vcVirtualList = _interopRequireDefault(require("../vc-virtual-list"));
var _useMemo = _interopRequireDefault(require("../_util/hooks/useMemo"));
var _platformUtil = require("./utils/platformUtil");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _useBaseProps = _interopRequireDefault(require("./hooks/useBaseProps"));
var _SelectContext = _interopRequireDefault(require("./SelectContext"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function isTitleType(content) {
  return typeof content === 'string' || typeof content === 'number';
}
/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
const OptionList = (0, _vue.defineComponent)({
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
    const baseProps = (0, _useBaseProps.default)();
    const props = (0, _SelectContext.default)();
    const itemPrefixCls = (0, _vue.computed)(() => `${baseProps.prefixCls}-item`);
    const memoFlattenOptions = (0, _useMemo.default)(() => props.flattenOptions, [() => baseProps.open, () => props.flattenOptions], next => next[0]);
    // =========================== List ===========================
    const listRef = (0, _createRef.default)();
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
    const state = (0, _vue.reactive)({
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
    (0, _vue.watch)([() => memoFlattenOptions.value.length, () => baseProps.searchValue], () => {
      setActive(props.defaultActiveFirstOption !== false ? getEnabledActiveIndex(0) : -1);
    }, {
      immediate: true
    });
    // https://github.com/ant-design/ant-design/issues/34975
    const isSelected = value => props.rawValues.has(value) && baseProps.mode !== 'combobox';
    // Auto scroll to item position in single mode
    (0, _vue.watch)([() => baseProps.open, () => baseProps.searchValue], () => {
      if (!baseProps.multiple && baseProps.open && props.rawValues.size === 1) {
        const value = Array.from(props.rawValues)[0];
        const index = (0, _vue.toRaw)(memoFlattenOptions.value).findIndex(_ref2 => {
          let {
            data
          } = _ref2;
          return data[props.fieldNames.value] === value;
        });
        if (index !== -1) {
          setActive(index);
          (0, _vue.nextTick)(() => {
            scrollIntoView(index);
          });
        }
      }
      // Force trigger scrollbar visible when open
      if (baseProps.open) {
        (0, _vue.nextTick)(() => {
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
      const attrs = (0, _pickAttrs.default)(itemData, true);
      const mergedLabel = getLabel(item);
      return item ? (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
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
        case _KeyCode.default.N:
        case _KeyCode.default.P:
        case _KeyCode.default.UP:
        case _KeyCode.default.DOWN:
          {
            let offset = 0;
            if (which === _KeyCode.default.UP) {
              offset = -1;
            } else if (which === _KeyCode.default.DOWN) {
              offset = 1;
            } else if ((0, _platformUtil.isPlatformMac)() && ctrlKey) {
              if (which === _KeyCode.default.N) {
                offset = 1;
              } else if (which === _KeyCode.default.P) {
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
        case _KeyCode.default.ENTER:
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
        case _KeyCode.default.ESC:
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
        return (0, _vue.createVNode)("div", {
          "role": "listbox",
          "id": `${id}_list`,
          "class": `${itemPrefixCls.value}-empty`,
          "onMousedown": onListMouseDown
        }, [notFoundContent]);
      }
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("div", {
        "role": "listbox",
        "id": `${id}_list`,
        "style": {
          height: 0,
          width: 0,
          overflow: 'hidden'
        }
      }, [renderItem(activeIndex - 1), renderItem(activeIndex), renderItem(activeIndex + 1)]), (0, _vue.createVNode)(_vcVirtualList.default, {
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
            return (0, _vue.createVNode)("div", {
              "class": (0, _classNames.default)(itemPrefixCls.value, `${itemPrefixCls.value}-group`),
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
          const passedProps = (0, _omit.default)(otherProps, omitFieldNameList);
          // Option
          const selected = isSelected(value);
          const optionPrefixCls = `${itemPrefixCls.value}-option`;
          const optionClassName = (0, _classNames.default)(itemPrefixCls.value, optionPrefixCls, cls, className, {
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
          return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, passedProps), {}, {
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
          }), [(0, _vue.createVNode)("div", {
            "class": `${optionPrefixCls}-content`
          }, [renderOption ? renderOption(data) : content]), (0, _propsUtil.isValidElement)(menuItemSelectedIcon) || selected, iconVisible && (0, _vue.createVNode)(_TransBtn.default, {
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
var _default = exports.default = OptionList;