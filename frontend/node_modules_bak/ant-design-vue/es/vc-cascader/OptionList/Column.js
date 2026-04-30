import { createVNode as _createVNode } from "vue";
import { isLeaf, toPathKey } from '../utils/commonUtil';
import Checkbox from './Checkbox';
import { SEARCH_MARK } from '../hooks/useSearchOptions';
import { useInjectCascader } from '../context';
import { cloneElement } from '../../_util/vnode';
export const FIX_LABEL = '__cascader_fix_label__';
export default function Column(_ref) {
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
  } = useInjectCascader();
  const expandIcon = (_a = expandIconRef.value) !== null && _a !== void 0 ? _a : (_c = (_b = customSlots.value).expandIcon) === null || _c === void 0 ? void 0 : _c.call(_b);
  const loadingIcon = (_d = loadingIconRef.value) !== null && _d !== void 0 ? _d : (_f = (_e = customSlots.value).loadingIcon) === null || _f === void 0 ? void 0 : _f.call(_e);
  const hoverOpen = expandTrigger.value === 'hover';
  // ============================ Render ============================
  return _createVNode("ul", {
    "class": menuPrefixCls,
    "role": "menu"
  }, [options.map(option => {
    var _a;
    const {
      disabled
    } = option;
    const searchOptions = option[SEARCH_MARK];
    const label = (_a = option[FIX_LABEL]) !== null && _a !== void 0 ? _a : option[fieldNames.value.label];
    const value = option[fieldNames.value.value];
    const isMergedLeaf = isLeaf(option, fieldNames.value);
    // Get real value of option. Search option is different way.
    const fullPath = searchOptions ? searchOptions.map(opt => opt[fieldNames.value.value]) : [...prevValuePath, value];
    const fullPathKey = toPathKey(fullPath);
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
    return _createVNode("li", {
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
    }, [multiple && _createVNode(Checkbox, {
      "prefixCls": `${prefixCls}-checkbox`,
      "checked": checked,
      "halfChecked": halfChecked,
      "disabled": disabled,
      "onClick": e => {
        e.stopPropagation();
        triggerSelect();
      }
    }, null), _createVNode("div", {
      "class": `${menuItemPrefixCls}-content`
    }, [label]), !isLoading && expandIcon && !isMergedLeaf && _createVNode("div", {
      "class": `${menuItemPrefixCls}-expand-icon`
    }, [cloneElement(expandIcon)]), isLoading && loadingIcon && _createVNode("div", {
      "class": `${menuItemPrefixCls}-loading-icon`
    }, [cloneElement(loadingIcon)])]);
  })]);
}
Column.props = ['prefixCls', 'multiple', 'options', 'activeValue', 'prevValuePath', 'onToggleOpen', 'onSelect', 'onActive', 'checkedSet', 'halfCheckedSet', 'loadingKeys', 'isSelectable'];
Column.displayName = 'Column';
Column.inheritAttrs = false;