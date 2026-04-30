import _extends from "@babel/runtime/helpers/esm/extends";
import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createTextVNode as _createTextVNode, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { isValidElement, splitAttrs, filterEmpty } from '../_util/props-util';
import DownOutlined from "@ant-design/icons-vue/es/icons/DownOutlined";
import Checkbox from '../checkbox';
import Menu from '../menu';
import Dropdown from '../dropdown';
import Search from './search';
import ListBody from './ListBody';
import { watchEffect, computed, defineComponent, ref } from 'vue';
import { stringType, arrayType, booleanType } from '../_util/type';
import { groupKeysMap } from '../_util/transKeys';
const defaultRender = () => null;
function isRenderResultPlainObject(result) {
  return !!(result && !isValidElement(result) && Object.prototype.toString.call(result) === '[object Object]');
}
function getEnabledItemKeys(items) {
  return items.filter(data => !data.disabled).map(data => data.key);
}
export const transferListProps = {
  prefixCls: String,
  dataSource: arrayType([]),
  filter: String,
  filterOption: Function,
  checkedKeys: PropTypes.arrayOf(PropTypes.string),
  handleFilter: Function,
  handleClear: Function,
  renderItem: Function,
  showSearch: booleanType(false),
  searchPlaceholder: String,
  notFoundContent: PropTypes.any,
  itemUnit: String,
  itemsUnit: String,
  renderList: PropTypes.any,
  disabled: booleanType(),
  direction: stringType(),
  showSelectAll: booleanType(),
  remove: String,
  selectAll: String,
  selectCurrent: String,
  selectInvert: String,
  removeAll: String,
  removeCurrent: String,
  selectAllLabel: PropTypes.any,
  showRemove: booleanType(),
  pagination: PropTypes.any,
  onItemSelect: Function,
  onItemSelectAll: Function,
  onItemRemove: Function,
  onScroll: Function
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'TransferList',
  inheritAttrs: false,
  props: transferListProps,
  // emits: ['scroll', 'itemSelectAll', 'itemRemove', 'itemSelect'],
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const filterValue = ref('');
    const transferNode = ref();
    const defaultListBodyRef = ref();
    const renderListBody = (renderList, props) => {
      let bodyContent = renderList ? renderList(props) : null;
      const customize = !!bodyContent && filterEmpty(bodyContent).length > 0;
      if (!customize) {
        bodyContent = _createVNode(ListBody, _objectSpread(_objectSpread({}, props), {}, {
          "ref": defaultListBodyRef
        }), null);
      }
      return {
        customize,
        bodyContent
      };
    };
    const renderItemHtml = item => {
      const {
        renderItem = defaultRender
      } = props;
      const renderResult = renderItem(item);
      const isRenderResultPlain = isRenderResultPlainObject(renderResult);
      return {
        renderedText: isRenderResultPlain ? renderResult.value : renderResult,
        renderedEl: isRenderResultPlain ? renderResult.label : renderResult,
        item
      };
    };
    const filteredItems = ref([]);
    const filteredRenderItems = ref([]);
    watchEffect(() => {
      const fItems = [];
      const fRenderItems = [];
      props.dataSource.forEach(item => {
        const renderedItem = renderItemHtml(item);
        const {
          renderedText
        } = renderedItem;
        // Filter skip
        if (filterValue.value && filterValue.value.trim() && !matchFilter(renderedText, item)) {
          return null;
        }
        fItems.push(item);
        fRenderItems.push(renderedItem);
      });
      filteredItems.value = fItems;
      filteredRenderItems.value = fRenderItems;
    });
    const checkStatus = computed(() => {
      const {
        checkedKeys
      } = props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      const checkedKeysMap = groupKeysMap(checkedKeys);
      if (filteredItems.value.every(item => checkedKeysMap.has(item.key) || !!item.disabled)) {
        return 'all';
      }
      return 'part';
    });
    const enabledItemKeys = computed(() => {
      return getEnabledItemKeys(filteredItems.value);
    });
    const getNewSelectKeys = (keys, unCheckedKeys) => {
      return Array.from(new Set([...keys, ...props.checkedKeys])).filter(key => unCheckedKeys.indexOf(key) === -1);
    };
    const getCheckBox = _ref2 => {
      let {
        disabled,
        prefixCls
      } = _ref2;
      var _a;
      const checkedAll = checkStatus.value === 'all';
      const checkAllCheckbox = _createVNode(Checkbox, {
        "disabled": ((_a = props.dataSource) === null || _a === void 0 ? void 0 : _a.length) === 0 || disabled,
        "checked": checkedAll,
        "indeterminate": checkStatus.value === 'part',
        "class": `${prefixCls}-checkbox`,
        "onChange": () => {
          // Only select enabled items
          const keys = enabledItemKeys.value;
          props.onItemSelectAll(getNewSelectKeys(!checkedAll ? keys : [], checkedAll ? props.checkedKeys : []));
        }
      }, null);
      return checkAllCheckbox;
    };
    const handleFilter = e => {
      var _a;
      const {
        target: {
          value: filter
        }
      } = e;
      filterValue.value = filter;
      (_a = props.handleFilter) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const handleClear = e => {
      var _a;
      filterValue.value = '';
      (_a = props.handleClear) === null || _a === void 0 ? void 0 : _a.call(props, e);
    };
    const matchFilter = (text, item) => {
      const {
        filterOption
      } = props;
      if (filterOption) {
        return filterOption(filterValue.value, item);
      }
      return text.includes(filterValue.value);
    };
    const getSelectAllLabel = (selectedCount, totalCount) => {
      const {
        itemsUnit,
        itemUnit,
        selectAllLabel
      } = props;
      if (selectAllLabel) {
        return typeof selectAllLabel === 'function' ? selectAllLabel({
          selectedCount,
          totalCount
        }) : selectAllLabel;
      }
      const unit = totalCount > 1 ? itemsUnit : itemUnit;
      return _createVNode(_Fragment, null, [(selectedCount > 0 ? `${selectedCount}/` : '') + totalCount, _createTextVNode(" "), unit]);
    };
    const notFoundContentEle = computed(() => Array.isArray(props.notFoundContent) ? props.notFoundContent[props.direction === 'left' ? 0 : 1] : props.notFoundContent);
    const getListBody = (prefixCls, searchPlaceholder, checkedKeys, renderList, showSearch, disabled) => {
      const search = showSearch ? _createVNode("div", {
        "class": `${prefixCls}-body-search-wrapper`
      }, [_createVNode(Search, {
        "prefixCls": `${prefixCls}-search`,
        "onChange": handleFilter,
        "handleClear": handleClear,
        "placeholder": searchPlaceholder,
        "value": filterValue.value,
        "disabled": disabled
      }, null)]) : null;
      let bodyNode;
      const {
        onEvents
      } = splitAttrs(attrs);
      const {
        bodyContent,
        customize
      } = renderListBody(renderList, _extends(_extends(_extends({}, props), {
        filteredItems: filteredItems.value,
        filteredRenderItems: filteredRenderItems.value,
        selectedKeys: checkedKeys
      }), onEvents));
      // We should wrap customize list body in a classNamed div to use flex layout.
      if (customize) {
        bodyNode = _createVNode("div", {
          "class": `${prefixCls}-body-customize-wrapper`
        }, [bodyContent]);
      } else {
        bodyNode = filteredItems.value.length ? bodyContent : _createVNode("div", {
          "class": `${prefixCls}-body-not-found`
        }, [notFoundContentEle.value]);
      }
      return _createVNode("div", {
        "class": showSearch ? `${prefixCls}-body ${prefixCls}-body-with-search` : `${prefixCls}-body`,
        "ref": transferNode
      }, [search, bodyNode]);
    };
    return () => {
      var _a, _b;
      const {
        prefixCls,
        checkedKeys,
        disabled,
        showSearch,
        searchPlaceholder,
        selectAll,
        selectCurrent,
        selectInvert,
        removeAll,
        removeCurrent,
        renderList,
        onItemSelectAll,
        onItemRemove,
        showSelectAll = true,
        showRemove,
        pagination
      } = props;
      // Custom Layout
      const footerDom = (_a = slots.footer) === null || _a === void 0 ? void 0 : _a.call(slots, _extends({}, props));
      const listCls = classNames(prefixCls, {
        [`${prefixCls}-with-pagination`]: !!pagination,
        [`${prefixCls}-with-footer`]: !!footerDom
      });
      // ================================= List Body =================================
      const listBody = getListBody(prefixCls, searchPlaceholder, checkedKeys, renderList, showSearch, disabled);
      const listFooter = footerDom ? _createVNode("div", {
        "class": `${prefixCls}-footer`
      }, [footerDom]) : null;
      const checkAllCheckbox = !showRemove && !pagination && getCheckBox({
        disabled,
        prefixCls
      });
      let menu = null;
      if (showRemove) {
        menu = _createVNode(Menu, null, {
          default: () => [pagination && _createVNode(Menu.Item, {
            "key": "removeCurrent",
            "onClick": () => {
              const pageKeys = getEnabledItemKeys((defaultListBodyRef.value.items || []).map(entity => entity.item));
              onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(pageKeys);
            }
          }, {
            default: () => [removeCurrent]
          }), _createVNode(Menu.Item, {
            "key": "removeAll",
            "onClick": () => {
              onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(enabledItemKeys.value);
            }
          }, {
            default: () => [removeAll]
          })]
        });
      } else {
        menu = _createVNode(Menu, null, {
          default: () => [_createVNode(Menu.Item, {
            "key": "selectAll",
            "onClick": () => {
              const keys = enabledItemKeys.value;
              onItemSelectAll(getNewSelectKeys(keys, []));
            }
          }, {
            default: () => [selectAll]
          }), pagination && _createVNode(Menu.Item, {
            "onClick": () => {
              const pageKeys = getEnabledItemKeys((defaultListBodyRef.value.items || []).map(entity => entity.item));
              onItemSelectAll(getNewSelectKeys(pageKeys, []));
            }
          }, {
            default: () => [selectCurrent]
          }), _createVNode(Menu.Item, {
            "key": "selectInvert",
            "onClick": () => {
              let availableKeys;
              if (pagination) {
                availableKeys = getEnabledItemKeys((defaultListBodyRef.value.items || []).map(entity => entity.item));
              } else {
                availableKeys = enabledItemKeys.value;
              }
              const checkedKeySet = new Set(checkedKeys);
              const newCheckedKeys = [];
              const newUnCheckedKeys = [];
              availableKeys.forEach(key => {
                if (checkedKeySet.has(key)) {
                  newUnCheckedKeys.push(key);
                } else {
                  newCheckedKeys.push(key);
                }
              });
              onItemSelectAll(getNewSelectKeys(newCheckedKeys, newUnCheckedKeys));
            }
          }, {
            default: () => [selectInvert]
          })]
        });
      }
      const dropdown = _createVNode(Dropdown, {
        "class": `${prefixCls}-header-dropdown`,
        "overlay": menu,
        "disabled": disabled
      }, {
        default: () => [_createVNode(DownOutlined, null, null)]
      });
      return _createVNode("div", {
        "class": listCls,
        "style": attrs.style
      }, [_createVNode("div", {
        "class": `${prefixCls}-header`
      }, [showSelectAll ? _createVNode(_Fragment, null, [checkAllCheckbox, dropdown]) : null, _createVNode("span", {
        "class": `${prefixCls}-header-selected`
      }, [_createVNode("span", null, [getSelectAllLabel(checkedKeys.length, filteredItems.value.length)]), _createVNode("span", {
        "class": `${prefixCls}-header-title`
      }, [(_b = slots.titleText) === null || _b === void 0 ? void 0 : _b.call(slots)])])]), listBody, listFooter]);
    };
  }
});