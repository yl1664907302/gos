import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import FilterFilled from "@ant-design/icons-vue/es/icons/FilterFilled";
import Button from '../../../button';
import Menu from '../../../menu';
import Checkbox from '../../../checkbox';
import Radio from '../../../radio';
import Dropdown from '../../../dropdown';
import Empty from '../../../empty';
import FilterDropdownMenuWrapper from './FilterWrapper';
import { flattenKeys } from '.';
import { computed, defineComponent, onBeforeUnmount, shallowRef, watch } from 'vue';
import classNames from '../../../_util/classNames';
import useConfigInject from '../../../config-provider/hooks/useConfigInject';
import { useInjectSlots } from '../../context';
import FilterSearch from './FilterSearch';
import Tree from '../../../tree';
import devWarning from '../../../vc-util/devWarning';
import isEqual from '../../../vc-util/isEqual';
const {
  SubMenu,
  Item: MenuItem
} = Menu;
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
      return _createVNode(SubMenu, {
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
    const Component = filterMultiple ? Checkbox : Radio;
    const item = _createVNode(MenuItem, {
      "key": filter.value !== undefined ? key : index
    }, {
      default: () => [_createVNode(Component, {
        "checked": filteredKeys.includes(key)
      }, null), _createVNode("span", null, [filter.text])]
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
export default defineComponent({
  name: 'FilterDropdown',
  props: ['tablePrefixCls', 'prefixCls', 'dropdownPrefixCls', 'column', 'filterState', 'filterMultiple', 'filterMode', 'filterSearch', 'columnKey', 'triggerFilter', 'locale', 'getPopupContainer'],
  setup(props, _ref3) {
    let {
      slots
    } = _ref3;
    const contextSlots = useInjectSlots();
    const filterMode = computed(() => {
      var _a;
      return (_a = props.filterMode) !== null && _a !== void 0 ? _a : 'menu';
    });
    const filterSearch = computed(() => {
      var _a;
      return (_a = props.filterSearch) !== null && _a !== void 0 ? _a : false;
    });
    const filterDropdownOpen = computed(() => props.column.filterDropdownOpen || props.column.filterDropdownVisible);
    const onFilterDropdownOpenChange = computed(() => props.column.onFilterDropdownOpenChange || props.column.onFilterDropdownVisibleChange);
    if (process.env.NODE_ENV !== 'production') {
      [['filterDropdownVisible', 'filterDropdownOpen', props.column.filterDropdownVisible], ['onFilterDropdownVisibleChange', 'onFilterDropdownOpenChange', props.column.onFilterDropdownVisibleChange]].forEach(_ref4 => {
        let [deprecatedName, newName, prop] = _ref4;
        devWarning(prop === undefined || prop === null, 'Table', `\`${deprecatedName}\` is deprecated. Please use \`${newName}\` instead.`);
      });
    }
    const visible = shallowRef(false);
    const filtered = computed(() => {
      var _a;
      return !!(props.filterState && (((_a = props.filterState.filteredKeys) === null || _a === void 0 ? void 0 : _a.length) || props.filterState.forceFiltered));
    });
    const filterFlattenKeys = computed(() => {
      var _a;
      return flattenKeys((_a = props.column) === null || _a === void 0 ? void 0 : _a.filters);
    });
    const filterDropdownRef = computed(() => {
      const {
        filterDropdown,
        slots = {},
        customFilterDropdown
      } = props.column;
      return filterDropdown || slots.filterDropdown && contextSlots.value[slots.filterDropdown] || customFilterDropdown && contextSlots.value.customFilterDropdown;
    });
    const filterIconRef = computed(() => {
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
    const mergedVisible = computed(() => typeof filterDropdownOpen.value === 'boolean' ? filterDropdownOpen.value : visible.value);
    const propFilteredKeys = computed(() => {
      var _a;
      return (_a = props.filterState) === null || _a === void 0 ? void 0 : _a.filteredKeys;
    });
    const filteredKeys = shallowRef([]);
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
    watch(propFilteredKeys, () => {
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
    const openKeys = shallowRef([]);
    const openRef = shallowRef();
    const onOpenChange = keys => {
      openRef.value = setTimeout(() => {
        openKeys.value = keys;
      });
    };
    const onMenuClick = () => {
      clearTimeout(openRef.value);
    };
    onBeforeUnmount(() => {
      clearTimeout(openRef.value);
    });
    const searchValue = shallowRef('');
    const onSearch = e => {
      const {
        value
      } = e.target;
      searchValue.value = value;
    };
    // clear search value after close filter dropdown
    watch(visible, () => {
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
      if (isEqual(mergedKeys, filterState === null || filterState === void 0 ? void 0 : filterState.filteredKeys, true)) {
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
    } = useConfigInject('', props);
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
      return _extends(_extends({}, node), {
        text: node.title,
        value: node.key,
        children: ((_a = node.children) === null || _a === void 0 ? void 0 : _a.map(item => getFilterData(item))) || []
      });
    };
    const treeData = computed(() => getTreeData({
      filters: props.column.filters
    }));
    // ======================== Style ========================
    const dropdownMenuClass = computed(() => classNames({
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
        return _createVNode(Empty, {
          "image": Empty.PRESENTED_IMAGE_SIMPLE,
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
        return _createVNode(_Fragment, null, [_createVNode(FilterSearch, {
          "filterSearch": filterSearch.value,
          "value": searchValue.value,
          "onChange": onSearch,
          "tablePrefixCls": tablePrefixCls,
          "locale": locale
        }, null), _createVNode("div", {
          "class": `${tablePrefixCls}-filter-dropdown-tree`
        }, [filterMultiple ? _createVNode(Checkbox, {
          "class": `${tablePrefixCls}-filter-dropdown-checkall`,
          "onChange": onCheckAll,
          "checked": selectedKeys.length === filterFlattenKeys.value.length,
          "indeterminate": selectedKeys.length > 0 && selectedKeys.length < filterFlattenKeys.value.length
        }, {
          default: () => [locale.filterCheckall]
        }) : null, _createVNode(Tree, {
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
      return _createVNode(_Fragment, null, [_createVNode(FilterSearch, {
        "filterSearch": filterSearch.value,
        "value": searchValue.value,
        "onChange": onSearch,
        "tablePrefixCls": tablePrefixCls,
        "locale": locale
      }, null), _createVNode(Menu, {
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
    const resetDisabled = computed(() => {
      const selectedKeys = filteredKeys.value;
      if (props.column.filterResetToDefaultFilteredValue) {
        return isEqual((props.column.defaultFilteredValue || []).map(key => String(key)), selectedKeys, true);
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
        dropdownContent = _createVNode(_Fragment, null, [getFilterComponent(), _createVNode("div", {
          "class": `${prefixCls}-dropdown-btns`
        }, [_createVNode(Button, {
          "type": "link",
          "size": "small",
          "disabled": resetDisabled.value,
          "onClick": () => onReset()
        }, {
          default: () => [locale.filterReset]
        }), _createVNode(Button, {
          "type": "primary",
          "size": "small",
          "onClick": onConfirm
        }, {
          default: () => [locale.filterConfirm]
        })])]);
      }
      const menu = _createVNode(FilterDropdownMenuWrapper, {
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
        filterIcon = _createVNode(FilterFilled, null, null);
      }
      return _createVNode("div", {
        "class": `${prefixCls}-column`
      }, [_createVNode("span", {
        "class": `${tablePrefixCls}-column-title`
      }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), _createVNode(Dropdown, {
        "overlay": menu,
        "trigger": ['click'],
        "open": mergedVisible.value,
        "onOpenChange": onVisibleChange,
        "getPopupContainer": getPopupContainer,
        "placement": direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight'
      }, {
        default: () => [_createVNode("span", {
          "role": "button",
          "tabindex": -1,
          "class": classNames(`${prefixCls}-trigger`, {
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