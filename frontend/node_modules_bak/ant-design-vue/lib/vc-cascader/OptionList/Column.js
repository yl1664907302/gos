"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FIX_LABEL = void 0;
exports.default = Column;
var _vue = require("vue");
var _commonUtil = require("../utils/commonUtil");
var _Checkbox = _interopRequireDefault(require("./Checkbox"));
var _useSearchOptions = require("../hooks/useSearchOptions");
var _context = require("../context");
var _vnode = require("../../_util/vnode");
const FIX_LABEL = exports.FIX_LABEL = '__cascader_fix_label__';
function Column(_ref) {
  let {
    prefixCls,
    multiple,
    options,
    activeValue,
    prevValuePath,
    onToggleOpen,
    onSelect,
    onActive,
    checkedSet,
    halfCheckedSet,
    loadingKeys,
    isSelectable
  } = _ref;
  var _a, _b, _c, _d, _e, _f;
  const menuPrefixCls = `${prefixCls}-menu`;
  const menuItemPrefixCls = `${prefixCls}-menu-item`;
  const {
    fieldNames,
    changeOnSelect,
    expandTrigger,
    expandIcon: expandIconRef,
    loadingIcon: loadingIconRef,
    dropdownMenuColumnStyle,
    customSlots
  } = (0, _context.useInjectCascader)();
  const expandIcon = (_a = expandIconRef.value) !== null && _a !== void 0 ? _a : (_c = (_b = customSlots.value).expandIcon) === null || _c === void 0 ? void 0 : _c.call(_b);
  const loadingIcon = (_d = loadingIconRef.value) !== null && _d !== void 0 ? _d : (_f = (_e = customSlots.value).loadingIcon) === null || _f === void 0 ? void 0 : _f.call(_e);
  const hoverOpen = expandTrigger.value === 'hover';
  // ============================ Render ============================
  return (0, _vue.createVNode)("ul", {
    "class": menuPrefixCls,
    "role": "menu"
  }, [options.map(option => {
    var _a;
    const {
      disabled
    } = option;
    const searchOptions = option[_useSearchOptions.SEARCH_MARK];
    const label = (_a = option[FIX_LABEL]) !== null && _a !== void 0 ? _a : option[fieldNames.value.label];
    const value = option[fieldNames.value.value];
    const isMergedLeaf = (0, _commonUtil.isLeaf)(option, fieldNames.value);
    // Get real value of option. Search option is different way.
    const fullPath = searchOptions ? searchOptions.map(opt => opt[fieldNames.value.value]) : [...prevValuePath, value];
    const fullPathKey = (0, _commonUtil.toPathKey)(fullPath);
    const isLoading = loadingKeys.includes(fullPathKey);
    // >>>>> checked
    const checked = checkedSet.has(fullPathKey);
    // >>>>> halfChecked
    const halfChecked = halfCheckedSet.has(fullPathKey);
    // >>>>> Open
    const triggerOpenPath = () => {
      if (!disabled && (!hoverOpen || !isMergedLeaf)) {
        onActive(fullPath);
      }
    };
    // >>>>> Selection
    const triggerSelect = () => {
      if (isSelectable(option)) {
        onSelect(fullPath, isMergedLeaf);
      }
    };
    // >>>>> Title
    let title;
    if (typeof option.title === 'string') {
      title = option.title;
    } else if (typeof label === 'string') {
      title = label;
    }
    // >>>>> Render
    return (0, _vue.createVNode)("li", {
      "key": fullPathKey,
      "class": [menuItemPrefixCls, {
        [`${menuItemPrefixCls}-expand`]: !isMergedLeaf,
        [`${menuItemPrefixCls}-active`]: activeValue === value,
        [`${menuItemPrefixCls}-disabled`]: disabled,
        [`${menuItemPrefixCls}-loading`]: isLoading
      }],
      "style": dropdownMenuColumnStyle.value,
      "role": "menuitemcheckbox",
      "title": title,
      "aria-checked": checked,
      "data-path-key": fullPathKey,
      "onClick": () => {
        triggerOpenPath();
        if (!multiple || isMergedLeaf) {
          triggerSelect();
        }
      },
      "onDblclick": () => {
        if (changeOnSelect.value) {
          onToggleOpen(false);
        }
      },
      "onMouseenter": () => {
        if (hoverOpen) {
          triggerOpenPath();
        }
      },
      "onMousedown": e => {
        // Prevent selector from blurring
        e.preventDefault();
      }
    }, [multiple && (0, _vue.createVNode)(_Checkbox.default, {
      "prefixCls": `${prefixCls}-checkbox`,
      "checked": checked,
      "halfChecked": halfChecked,
      "disabled": disabled,
      "onClick": e => {
        e.stopPropagation();
        triggerSelect();
      }
    }, null), (0, _vue.createVNode)("div", {
      "class": `${menuItemPrefixCls}-content`
    }, [label]), !isLoading && expandIcon && !isMergedLeaf && (0, _vue.createVNode)("div", {
      "class": `${menuItemPrefixCls}-expand-icon`
    }, [(0, _vnode.cloneElement)(expandIcon)]), isLoading && loadingIcon && (0, _vue.createVNode)("div", {
      "class": `${menuItemPrefixCls}-loading-icon`
    }, [(0, _vnode.cloneElement)(loadingIcon)])]);
  })]);
}
Column.props = ['prefixCls', 'multiple', 'options', 'activeValue', 'prevValuePath', 'onToggleOpen', 'onSelect', 'onActive', 'checkedSet', 'halfCheckedSet', 'loadingKeys', 'isSelectable'];
Column.displayName = 'Column';
Column.inheritAttrs = false;