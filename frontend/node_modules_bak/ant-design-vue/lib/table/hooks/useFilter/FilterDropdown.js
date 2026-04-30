"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _FilterFilled = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FilterFilled"));
var _button = _interopRequireDefault(require("../../../button"));
var _menu = _interopRequireDefault(require("../../../menu"));
var _checkbox = _interopRequireDefault(require("../../../checkbox"));
var _radio = _interopRequireDefault(require("../../../radio"));
var _dropdown = _interopRequireDefault(require("../../../dropdown"));
var _empty = _interopRequireDefault(require("../../../empty"));
var _FilterWrapper = _interopRequireDefault(require("./FilterWrapper"));
var _ = require(".");
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../../../config-provider/hooks/useConfigInject"));
var _context = require("../../context");
var _FilterSearch = _interopRequireDefault(require("./FilterSearch"));
var _tree = _interopRequireDefault(require("../../../tree"));
var _devWarning = _interopRequireDefault(require("../../../vc-util/devWarning"));
var _isEqual = _interopRequireDefault(require("../../../vc-util/isEqual"));
const {
  SubMenu,
  Item: MenuItem
} = _menu.default;
function hasSubMenu(filters) {
  return filters.some(_ref => {
    let {
      children
    } = _ref;
    return children && children.length > 0;
  });
}
function searchValueMatched(searchValue, text) {
  if (typeof text === 'string' || typeof text === 'number') {
    return text === null || text === void 0 ? void 0 : text.toString().toLowerCase().includes(searchValue.trim().toLowerCase());
  }
  return false;
}
function renderFilterItems(_ref2) {
  let {
    filters,
    prefixCls,
    filteredKeys,
    filterMultiple,
    searchValue,
    filterSearch
  } = _ref2;
  return filters.map((filter, index) => {
    const key = String(filter.value);
    if (filter.children) {
      return (0, _vue.createVNode)(SubMenu, {
        "key": key || index,
        "title": filter.text,
        "popupClassName": `${prefixCls}-dropdown-submenu`
      }, {
        default: () => [renderFilterItems({
          filters: filter.children,
          prefixCls,
          filteredKeys,
          filterMultiple,
          searchValue,
          filterSearch
        })]
      });
    }
    const Component = filterMultiple ? _checkbox.default : _radio.default;
    const item = (0, _vue.createVNode)(MenuItem, {
      "key": filter.value !== undefined ? key : index
    }, {
      default: () => [(0, _vue.createVNode)(Component, {
        "checked": filteredKeys.includes(key)
      }, null), (0, _vue.createVNode)("span", null, [filter.text])]
    });
    if (searchValue.trim()) {
      if (typeof filterSearch === 'function') {
        return filterSearch(searchValue, filter) ? item : undefined;
      }
      return searchValueMatched(searchValue, filter.text) ? item : undefined;
    }
    return item;
  });
}
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'FilterDropdown',
  props: ['tablePrefixCls', 'prefixCls', 'dropdownPrefixCls', 'column', 'filterState', 'filterMultiple', 'filterMode', 'filterSearch', 'columnKey', 'triggerFilter', 'locale', 'getPopupContainer'],
  setup(props, _ref3) {
    let {
      slots
    } = _ref3;
    const contextSlots = (0, _context.useInjectSlots)();
    const filterMode = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.filterMode) !== null && _a !== void 0 ? _a : 'menu';
    });
    const filterSearch = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.filterSearch) !== null && _a !== void 0 ? _a : false;
    });
    const filterDropdownOpen = (0, _vue.computed)(() => props.column.filterDropdownOpen || props.column.filterDropdownVisible);
    const onFilterDropdownOpenChange = (0, _vue.computed)(() => props.column.onFilterDropdownOpenChange || props.column.onFilterDropdownVisibleChange);
    if (process.env.NODE_ENV !== 'production') {
      [['filterDropdownVisible', 'filterDropdownOpen', props.column.filterDropdownVisible], ['onFilterDropdownVisibleChange', 'onFilterDropdownOpenChange', props.column.onFilterDropdownVisibleChange]].forEach(_ref4 => {
        let [deprecatedName, newName, prop] = _ref4;
        (0, _devWarning.default)(prop === undefined || prop === null, 'Table', `\`${deprecatedName}\` is deprecated. Please use \`${newName}\` instead.`);
      });
    }
    const visible = (0, _vue.shallowRef)(false);
    const filtered = (0, _vue.computed)(() => {
      var _a;
      return !!(props.filterState && (((_a = props.filterState.filteredKeys) === null || _a === void 0 ? void 0 : _a.length) || props.filterState.forceFiltered));
    });
    const filterFlattenKeys = (0, _vue.computed)(() => {
      var _a;
      return (0, _.flattenKeys)((_a = props.column) === null || _a === void 0 ? void 0 : _a.filters);
    });
    const filterDropdownRef = (0, _vue.computed)(() => {
      const {
        filterDropdown,
        slots = {},
        customFilterDropdown
      } = props.column;
      return filterDropdown || slots.filterDropdown && contextSlots.value[slots.filterDropdown] || customFilterDropdown && contextSlots.value.customFilterDropdown;
    });
    const filterIconRef = (0, _vue.computed)(() => {
      const {
        filterIcon,
        slots = {}
      } = props.column;
      return filterIcon || slots.filterIcon && contextSlots.value[slots.filterIcon] || contextSlots.value.customFilterIcon;
    });
    const triggerVisible = newVisible => {
      var _a;
      visible.value = newVisible;
      (_a = onFilterDropdownOpenChange.value) === null || _a === void 0 ? void 0 : _a.call(onFilterDropdownOpenChange, newVisible);
    };
    const mergedVisible = (0, _vue.computed)(() => typeof filterDropdownOpen.value === 'boolean' ? filterDropdownOpen.value : visible.value);
    const propFilteredKeys = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.filterState) === null || _a === void 0 ? void 0 : _a.filteredKeys;
    });
    const filteredKeys = (0, _vue.shallowRef)([]);
    const onSelectKeys = _ref5 => {
      let {
        selectedKeys
      } = _ref5;
      filteredKeys.value = selectedKeys;
    };
    const onCheck = (keys, _ref6) => {
      let {
        node,
        checked
      } = _ref6;
      if (!props.filterMultiple) {
        onSelectKeys({
          selectedKeys: checked && node.key ? [node.key] : []
        });
      } else {
        onSelectKeys({
          selectedKeys: keys
        });
      }
    };
    (0, _vue.watch)(propFilteredKeys, () => {
      if (!visible.value) {
        return;
      }
      onSelectKeys({
        selectedKeys: propFilteredKeys.value || []
      });
    }, {
      immediate: true
    });
    // const expandKeys = shallowRef(filterFlattenKeys.value.slice());
    // const onExpandChange = keys => (expandKeys.value = keys);
    const openKeys = (0, _vue.shallowRef)([]);
    const openRef = (0, _vue.shallowRef)();
    const onOpenChange = keys => {
      openRef.value = setTimeout(() => {
        openKeys.value = keys;
      });
    };
    const onMenuClick = () => {
      clearTimeout(openRef.value);
    };
    (0, _vue.onBeforeUnmount)(() => {
      clearTimeout(openRef.value);
    });
    const searchValue = (0, _vue.shallowRef)('');
    const onSearch = e => {
      const {
        value
      } = e.target;
      searchValue.value = value;
    };
    // clear search value after close filter dropdown
    (0, _vue.watch)(visible, () => {
      if (!visible.value) {
        searchValue.value = '';
      }
    });
    // ======================= Submit ========================
    const internalTriggerFilter = keys => {
      const {
        column,
        columnKey,
        filterState
      } = props;
      const mergedKeys = keys && keys.length ? keys : null;
      if (mergedKeys === null && (!filterState || !filterState.filteredKeys)) {
        return null;
      }
      if ((0, _isEqual.default)(mergedKeys, filterState === null || filterState === void 0 ? void 0 : filterState.filteredKeys, true)) {
        return null;
      }
      props.triggerFilter({
        column,
        key: columnKey,
        filteredKeys: mergedKeys
      });
    };
    const onConfirm = () => {
      triggerVisible(false);
      internalTriggerFilter(filteredKeys.value);
    };
    const onReset = function () {
      let {
        confirm,
        closeDropdown
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        confirm: false,
        closeDropdown: false
      };
      if (confirm) {
        internalTriggerFilter([]);
      }
      if (closeDropdown) {
        triggerVisible(false);
      }
      searchValue.value = '';
      if (props.column.filterResetToDefaultFilteredValue) {
        filteredKeys.value = (props.column.defaultFilteredValue || []).map(key => String(key));
      } else {
        filteredKeys.value = [];
      }
    };
    const doFilter = function () {
      let {
        closeDropdown
      } = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        closeDropdown: true
      };
      if (closeDropdown) {
        triggerVisible(false);
      }
      internalTriggerFilter(filteredKeys.value);
    };
    const onVisibleChange = newVisible => {
      if (newVisible && propFilteredKeys.value !== undefined) {
        // Sync filteredKeys on appear in controlled mode (propFilteredKeys.value !== undefiend)
        filteredKeys.value = propFilteredKeys.value || [];
      }
      triggerVisible(newVisible);
      // Default will filter when closed
      if (!newVisible && !filterDropdownRef.value) {
        onConfirm();
      }
    };
    const {
      direction
    } = (0, _useConfigInject.default)('', props);
    const onCheckAll = e => {
      if (e.target.checked) {
        const allFilterKeys = filterFlattenKeys.value;
        filteredKeys.value = allFilterKeys;
      } else {
        filteredKeys.value = [];
      }
    };
    const getTreeData = _ref7 => {
      let {
        filters
      } = _ref7;
      return (filters || []).map((filter, index) => {
        const key = String(filter.value);
        const item = {
          title: filter.text,
          key: filter.value !== undefined ? key : index
        };
        if (filter.children) {
          item.children = getTreeData({
            filters: filter.children
          });
        }
        return item;
      });
    };
    const getFilterData = node => {
      var _a;
      return (0, _extends2.default)((0, _extends2.default)({}, node), {
        text: node.title,
        value: node.key,
        children: ((_a = node.children) === null || _a === void 0 ? void 0 : _a.map(item => getFilterData(item))) || []
      });
    };
    const treeData = (0, _vue.computed)(() => getTreeData({
      filters: props.column.filters
    }));
    // ======================== Style ========================
    const dropdownMenuClass = (0, _vue.computed)(() => (0, _classNames.default)({
      [`${props.dropdownPrefixCls}-menu-without-submenu`]: !hasSubMenu(props.column.filters || [])
    }));
    const getFilterComponent = () => {
      const selectedKeys = filteredKeys.value;
      const {
        column,
        locale,
        tablePrefixCls,
        filterMultiple,
        dropdownPrefixCls,
        getPopupContainer,
        prefixCls
      } = props;
      if ((column.filters || []).length === 0) {
        return (0, _vue.createVNode)(_empty.default, {
          "image": _empty.default.PRESENTED_IMAGE_SIMPLE,
          "description": locale.filterEmptyText,
          "imageStyle": {
            height: 24
          },
          "style": {
            margin: 0,
            padding: '16px 0'
          }
        }, null);
      }
      if (filterMode.value === 'tree') {
        return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_FilterSearch.default, {
          "filterSearch": filterSearch.value,
          "value": searchValue.value,
          "onChange": onSearch,
          "tablePrefixCls": tablePrefixCls,
          "locale": locale
        }, null), (0, _vue.createVNode)("div", {
          "class": `${tablePrefixCls}-filter-dropdown-tree`
        }, [filterMultiple ? (0, _vue.createVNode)(_checkbox.default, {
          "class": `${tablePrefixCls}-filter-dropdown-checkall`,
          "onChange": onCheckAll,
          "checked": selectedKeys.length === filterFlattenKeys.value.length,
          "indeterminate": selectedKeys.length > 0 && selectedKeys.length < filterFlattenKeys.value.length
        }, {
          default: () => [locale.filterCheckall]
        }) : null, (0, _vue.createVNode)(_tree.default, {
          "checkable": true,
          "selectable": false,
          "blockNode": true,
          "multiple": filterMultiple,
          "checkStrictly": !filterMultiple,
          "class": `${dropdownPrefixCls}-menu`,
          "onCheck": onCheck,
          "checkedKeys": selectedKeys,
          "selectedKeys": selectedKeys,
          "showIcon": false,
          "treeData": treeData.value,
          "autoExpandParent": true,
          "defaultExpandAll": true,
          "filterTreeNode": searchValue.value.trim() ? node => {
            if (typeof filterSearch.value === 'function') {
              return filterSearch.value(searchValue.value, getFilterData(node));
            }
            return searchValueMatched(searchValue.value, node.title);
          } : undefined
        }, null)])]);
      }
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)(_FilterSearch.default, {
        "filterSearch": filterSearch.value,
        "value": searchValue.value,
        "onChange": onSearch,
        "tablePrefixCls": tablePrefixCls,
        "locale": locale
      }, null), (0, _vue.createVNode)(_menu.default, {
        "multiple": filterMultiple,
        "prefixCls": `${dropdownPrefixCls}-menu`,
        "class": dropdownMenuClass.value,
        "onClick": onMenuClick,
        "onSelect": onSelectKeys,
        "onDeselect": onSelectKeys,
        "selectedKeys": selectedKeys,
        "getPopupContainer": getPopupContainer,
        "openKeys": openKeys.value,
        "onOpenChange": onOpenChange
      }, {
        default: () => renderFilterItems({
          filters: column.filters || [],
          filterSearch: filterSearch.value,
          prefixCls,
          filteredKeys: filteredKeys.value,
          filterMultiple,
          searchValue: searchValue.value
        })
      })]);
    };
    const resetDisabled = (0, _vue.computed)(() => {
      const selectedKeys = filteredKeys.value;
      if (props.column.filterResetToDefaultFilteredValue) {
        return (0, _isEqual.default)((props.column.defaultFilteredValue || []).map(key => String(key)), selectedKeys, true);
      }
      return selectedKeys.length === 0;
    });
    return () => {
      var _a;
      const {
        tablePrefixCls,
        prefixCls,
        column,
        dropdownPrefixCls,
        locale,
        getPopupContainer
      } = props;
      let dropdownContent;
      if (typeof filterDropdownRef.value === 'function') {
        dropdownContent = filterDropdownRef.value({
          prefixCls: `${dropdownPrefixCls}-custom`,
          setSelectedKeys: selectedKeys => onSelectKeys({
            selectedKeys
          }),
          selectedKeys: filteredKeys.value,
          confirm: doFilter,
          clearFilters: onReset,
          filters: column.filters,
          visible: mergedVisible.value,
          column: column.__originColumn__,
          close: () => {
            triggerVisible(false);
          }
        });
      } else if (filterDropdownRef.value) {
        dropdownContent = filterDropdownRef.value;
      } else {
        dropdownContent = (0, _vue.createVNode)(_vue.Fragment, null, [getFilterComponent(), (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-dropdown-btns`
        }, [(0, _vue.createVNode)(_button.default, {
          "type": "link",
          "size": "small",
          "disabled": resetDisabled.value,
          "onClick": () => onReset()
        }, {
          default: () => [locale.filterReset]
        }), (0, _vue.createVNode)(_button.default, {
          "type": "primary",
          "size": "small",
          "onClick": onConfirm
        }, {
          default: () => [locale.filterConfirm]
        })])]);
      }
      const menu = (0, _vue.createVNode)(_FilterWrapper.default, {
        "class": `${prefixCls}-dropdown`
      }, {
        default: () => [dropdownContent]
      });
      let filterIcon;
      if (typeof filterIconRef.value === 'function') {
        filterIcon = filterIconRef.value({
          filtered: filtered.value,
          column: column.__originColumn__
        });
      } else if (filterIconRef.value) {
        filterIcon = filterIconRef.value;
      } else {
        filterIcon = (0, _vue.createVNode)(_FilterFilled.default, null, null);
      }
      return (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-column`
      }, [(0, _vue.createVNode)("span", {
        "class": `${tablePrefixCls}-column-title`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), (0, _vue.createVNode)(_dropdown.default, {
        "overlay": menu,
        "trigger": ['click'],
        "open": mergedVisible.value,
        "onOpenChange": onVisibleChange,
        "getPopupContainer": getPopupContainer,
        "placement": direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight'
      }, {
        default: () => [(0, _vue.createVNode)("span", {
          "role": "button",
          "tabindex": -1,
          "class": (0, _classNames.default)(`${prefixCls}-trigger`, {
            active: filtered.value
          }),
          "onClick": e => {
            e.stopPropagation();
          }
        }, [filterIcon])]
      })]);
    };
  }
});