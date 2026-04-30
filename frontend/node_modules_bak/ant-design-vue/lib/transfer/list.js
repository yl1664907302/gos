"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferListProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _DownOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DownOutlined"));
var _checkbox = _interopRequireDefault(require("../checkbox"));
var _menu = _interopRequireDefault(require("../menu"));
var _dropdown = _interopRequireDefault(require("../dropdown"));
var _search = _interopRequireDefault(require("./search"));
var _ListBody = _interopRequireDefault(require("./ListBody"));
var _type = require("../_util/type");
var _transKeys = require("../_util/transKeys");
const defaultRender = () => null;
function isRenderResultPlainObject(result) {
  return !!(result && !(0, _propsUtil.isValidElement)(result) && Object.prototype.toString.call(result) === '[object Object]');
}
function getEnabledItemKeys(items) {
  return items.filter(data => !data.disabled).map(data => data.key);
}
const transferListProps = exports.transferListProps = {
  prefixCls: String,
  dataSource: (0, _type.arrayType)([]),
  filter: String,
  filterOption: Function,
  checkedKeys: _vueTypes.default.arrayOf(_vueTypes.default.string),
  handleFilter: Function,
  handleClear: Function,
  renderItem: Function,
  showSearch: (0, _type.booleanType)(false),
  searchPlaceholder: String,
  notFoundContent: _vueTypes.default.any,
  itemUnit: String,
  itemsUnit: String,
  renderList: _vueTypes.default.any,
  disabled: (0, _type.booleanType)(),
  direction: (0, _type.stringType)(),
  showSelectAll: (0, _type.booleanType)(),
  remove: String,
  selectAll: String,
  selectCurrent: String,
  selectInvert: String,
  removeAll: String,
  removeCurrent: String,
  selectAllLabel: _vueTypes.default.any,
  showRemove: (0, _type.booleanType)(),
  pagination: _vueTypes.default.any,
  onItemSelect: Function,
  onItemSelectAll: Function,
  onItemRemove: Function,
  onScroll: Function
};
var _default = exports.default = (0, _vue.defineComponent)({
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
    const filterValue = (0, _vue.ref)('');
    const transferNode = (0, _vue.ref)();
    const defaultListBodyRef = (0, _vue.ref)();
    const renderListBody = (renderList, props) => {
      let bodyContent = renderList ? renderList(props) : null;
      const customize = !!bodyContent && (0, _propsUtil.filterEmpty)(bodyContent).length > 0;
      if (!customize) {
        bodyContent = (0, _vue.createVNode)(_ListBody.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
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
    const filteredItems = (0, _vue.ref)([]);
    const filteredRenderItems = (0, _vue.ref)([]);
    (0, _vue.watchEffect)(() => {
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
    const checkStatus = (0, _vue.computed)(() => {
      const {
        checkedKeys
      } = props;
      if (checkedKeys.length === 0) {
        return 'none';
      }
      const checkedKeysMap = (0, _transKeys.groupKeysMap)(checkedKeys);
      if (filteredItems.value.every(item => checkedKeysMap.has(item.key) || !!item.disabled)) {
        return 'all';
      }
      return 'part';
    });
    const enabledItemKeys = (0, _vue.computed)(() => {
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
      const checkAllCheckbox = (0, _vue.createVNode)(_checkbox.default, {
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
      return (0, _vue.createVNode)(_vue.Fragment, null, [(selectedCount > 0 ? `${selectedCount}/` : '') + totalCount, (0, _vue.createTextVNode)(" "), unit]);
    };
    const notFoundContentEle = (0, _vue.computed)(() => Array.isArray(props.notFoundContent) ? props.notFoundContent[props.direction === 'left' ? 0 : 1] : props.notFoundContent);
    const getListBody = (prefixCls, searchPlaceholder, checkedKeys, renderList, showSearch, disabled) => {
      const search = showSearch ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-body-search-wrapper`
      }, [(0, _vue.createVNode)(_search.default, {
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
      } = (0, _propsUtil.splitAttrs)(attrs);
      const {
        bodyContent,
        customize
      } = renderListBody(renderList, (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, props), {
        filteredItems: filteredItems.value,
        filteredRenderItems: filteredRenderItems.value,
        selectedKeys: checkedKeys
      }), onEvents));
      // We should wrap customize list body in a classNamed div to use flex layout.
      if (customize) {
        bodyNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-body-customize-wrapper`
        }, [bodyContent]);
      } else {
        bodyNode = filteredItems.value.length ? bodyContent : (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-body-not-found`
        }, [notFoundContentEle.value]);
      }
      return (0, _vue.createVNode)("div", {
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
      const footerDom = (_a = slots.footer) === null || _a === void 0 ? void 0 : _a.call(slots, (0, _extends2.default)({}, props));
      const listCls = (0, _classNames.default)(prefixCls, {
        [`${prefixCls}-with-pagination`]: !!pagination,
        [`${prefixCls}-with-footer`]: !!footerDom
      });
      // ================================= List Body =================================
      const listBody = getListBody(prefixCls, searchPlaceholder, checkedKeys, renderList, showSearch, disabled);
      const listFooter = footerDom ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-footer`
      }, [footerDom]) : null;
      const checkAllCheckbox = !showRemove && !pagination && getCheckBox({
        disabled,
        prefixCls
      });
      let menu = null;
      if (showRemove) {
        menu = (0, _vue.createVNode)(_menu.default, null, {
          default: () => [pagination && (0, _vue.createVNode)(_menu.default.Item, {
            "key": "removeCurrent",
            "onClick": () => {
              const pageKeys = getEnabledItemKeys((defaultListBodyRef.value.items || []).map(entity => entity.item));
              onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(pageKeys);
            }
          }, {
            default: () => [removeCurrent]
          }), (0, _vue.createVNode)(_menu.default.Item, {
            "key": "removeAll",
            "onClick": () => {
              onItemRemove === null || onItemRemove === void 0 ? void 0 : onItemRemove(enabledItemKeys.value);
            }
          }, {
            default: () => [removeAll]
          })]
        });
      } else {
        menu = (0, _vue.createVNode)(_menu.default, null, {
          default: () => [(0, _vue.createVNode)(_menu.default.Item, {
            "key": "selectAll",
            "onClick": () => {
              const keys = enabledItemKeys.value;
              onItemSelectAll(getNewSelectKeys(keys, []));
            }
          }, {
            default: () => [selectAll]
          }), pagination && (0, _vue.createVNode)(_menu.default.Item, {
            "onClick": () => {
              const pageKeys = getEnabledItemKeys((defaultListBodyRef.value.items || []).map(entity => entity.item));
              onItemSelectAll(getNewSelectKeys(pageKeys, []));
            }
          }, {
            default: () => [selectCurrent]
          }), (0, _vue.createVNode)(_menu.default.Item, {
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
      const dropdown = (0, _vue.createVNode)(_dropdown.default, {
        "class": `${prefixCls}-header-dropdown`,
        "overlay": menu,
        "disabled": disabled
      }, {
        default: () => [(0, _vue.createVNode)(_DownOutlined.default, null, null)]
      });
      return (0, _vue.createVNode)("div", {
        "class": listCls,
        "style": attrs.style
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-header`
      }, [showSelectAll ? (0, _vue.createVNode)(_vue.Fragment, null, [checkAllCheckbox, dropdown]) : null, (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-header-selected`
      }, [(0, _vue.createVNode)("span", null, [getSelectAllLabel(checkedKeys.length, filteredItems.value.length)]), (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-header-title`
      }, [(_b = slots.titleText) === null || _b === void 0 ? void 0 : _b.call(slots)])])]), listBody, listFooter]);
    };
  }
});