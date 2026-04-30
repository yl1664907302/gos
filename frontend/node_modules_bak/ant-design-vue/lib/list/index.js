"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ListItem", {
  enumerable: true,
  get: function () {
    return _Item.default;
  }
});
Object.defineProperty(exports, "ListItemMeta", {
  enumerable: true,
  get: function () {
    return _ItemMeta.default;
  }
});
exports.listProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _spin = _interopRequireDefault(require("../spin"));
var _pagination = _interopRequireDefault(require("../pagination"));
var _grid = require("../grid");
var _Item = _interopRequireDefault(require("./Item"));
var _propsUtil = require("../_util/props-util");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _type = require("../_util/type");
var _ItemMeta = _interopRequireDefault(require("./ItemMeta"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useBreakpoint = _interopRequireDefault(require("../_util/hooks/useBreakpoint"));
var _responsiveObserve = require("../_util/responsiveObserve");
var _eagerComputed = _interopRequireDefault(require("../_util/eagerComputed"));
var _style = _interopRequireDefault(require("./style"));
var _contextKey = require("./contextKey");
// CSSINJS

const listProps = () => ({
  bordered: (0, _type.booleanType)(),
  dataSource: (0, _type.arrayType)(),
  extra: (0, _type.vNodeType)(),
  grid: (0, _type.objectType)(),
  itemLayout: String,
  loading: (0, _type.someType)([Boolean, Object]),
  loadMore: (0, _type.vNodeType)(),
  pagination: (0, _type.someType)([Boolean, Object]),
  prefixCls: String,
  rowKey: (0, _type.someType)([String, Number, Function]),
  renderItem: (0, _type.functionType)(),
  size: String,
  split: (0, _type.booleanType)(),
  header: (0, _type.vNodeType)(),
  footer: (0, _type.vNodeType)(),
  locale: (0, _type.objectType)()
});
exports.listProps = listProps;
const List = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AList',
  inheritAttrs: false,
  Item: _Item.default,
  props: (0, _initDefaultProps.default)(listProps(), {
    dataSource: [],
    bordered: false,
    split: true,
    loading: false,
    pagination: false
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    var _a, _b;
    (0, _vue.provide)(_contextKey.ListContextKey, {
      grid: (0, _vue.toRef)(props, 'grid'),
      itemLayout: (0, _vue.toRef)(props, 'itemLayout')
    });
    const defaultPaginationProps = {
      current: 1,
      total: 0
    };
    const {
      prefixCls,
      direction,
      renderEmpty
    } = (0, _useConfigInject.default)('list', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const paginationObj = (0, _vue.computed)(() => props.pagination && typeof props.pagination === 'object' ? props.pagination : {});
    const paginationCurrent = (0, _vue.ref)((_a = paginationObj.value.defaultCurrent) !== null && _a !== void 0 ? _a : 1);
    const paginationSize = (0, _vue.ref)((_b = paginationObj.value.defaultPageSize) !== null && _b !== void 0 ? _b : 10);
    (0, _vue.watch)(paginationObj, () => {
      if ('current' in paginationObj.value) {
        paginationCurrent.value = paginationObj.value.current;
      }
      if ('pageSize' in paginationObj.value) {
        paginationSize.value = paginationObj.value.pageSize;
      }
    });
    const listItemsKeys = [];
    const triggerPaginationEvent = eventName => (page, pageSize) => {
      paginationCurrent.value = page;
      paginationSize.value = pageSize;
      if (paginationObj.value[eventName]) {
        paginationObj.value[eventName](page, pageSize);
      }
    };
    const onPaginationChange = triggerPaginationEvent('onChange');
    const onPaginationShowSizeChange = triggerPaginationEvent('onShowSizeChange');
    const loadingProp = (0, _vue.computed)(() => {
      if (typeof props.loading === 'boolean') {
        return {
          spinning: props.loading
        };
      } else {
        return props.loading;
      }
    });
    const isLoading = (0, _vue.computed)(() => loadingProp.value && loadingProp.value.spinning);
    const sizeCls = (0, _vue.computed)(() => {
      let size = '';
      switch (props.size) {
        case 'large':
          size = 'lg';
          break;
        case 'small':
          size = 'sm';
          break;
        default:
          break;
      }
      return size;
    });
    const classObj = (0, _vue.computed)(() => ({
      [`${prefixCls.value}`]: true,
      [`${prefixCls.value}-vertical`]: props.itemLayout === 'vertical',
      [`${prefixCls.value}-${sizeCls.value}`]: sizeCls.value,
      [`${prefixCls.value}-split`]: props.split,
      [`${prefixCls.value}-bordered`]: props.bordered,
      [`${prefixCls.value}-loading`]: isLoading.value,
      [`${prefixCls.value}-grid`]: !!props.grid,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }));
    const paginationProps = (0, _vue.computed)(() => {
      const pp = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, defaultPaginationProps), {
        total: props.dataSource.length,
        current: paginationCurrent.value,
        pageSize: paginationSize.value
      }), props.pagination || {});
      const largestPage = Math.ceil(pp.total / pp.pageSize);
      if (pp.current > largestPage) {
        pp.current = largestPage;
      }
      return pp;
    });
    const splitDataSource = (0, _vue.computed)(() => {
      let dd = [...props.dataSource];
      if (props.pagination) {
        if (props.dataSource.length > (paginationProps.value.current - 1) * paginationProps.value.pageSize) {
          dd = [...props.dataSource].splice((paginationProps.value.current - 1) * paginationProps.value.pageSize, paginationProps.value.pageSize);
        }
      }
      return dd;
    });
    const screens = (0, _useBreakpoint.default)();
    const currentBreakpoint = (0, _eagerComputed.default)(() => {
      for (let i = 0; i < _responsiveObserve.responsiveArray.length; i += 1) {
        const breakpoint = _responsiveObserve.responsiveArray[i];
        if (screens.value[breakpoint]) {
          return breakpoint;
        }
      }
      return undefined;
    });
    const colStyle = (0, _vue.computed)(() => {
      if (!props.grid) {
        return undefined;
      }
      const columnCount = currentBreakpoint.value && props.grid[currentBreakpoint.value] ? props.grid[currentBreakpoint.value] : props.grid.column;
      if (columnCount) {
        return {
          width: `${100 / columnCount}%`,
          maxWidth: `${100 / columnCount}%`
        };
      }
      return undefined;
    });
    const renderInnerItem = (item, index) => {
      var _a;
      const renderItem = (_a = props.renderItem) !== null && _a !== void 0 ? _a : slots.renderItem;
      if (!renderItem) return null;
      let key;
      const rowKeyType = typeof props.rowKey;
      if (rowKeyType === 'function') {
        key = props.rowKey(item);
      } else if (rowKeyType === 'string' || rowKeyType === 'number') {
        key = item[props.rowKey];
      } else {
        key = item.key;
      }
      if (!key) {
        key = `list-item-${index}`;
      }
      listItemsKeys[index] = key;
      return renderItem({
        item,
        index
      });
    };
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const loadMore = (_a = props.loadMore) !== null && _a !== void 0 ? _a : (_b = slots.loadMore) === null || _b === void 0 ? void 0 : _b.call(slots);
      const footer = (_c = props.footer) !== null && _c !== void 0 ? _c : (_d = slots.footer) === null || _d === void 0 ? void 0 : _d.call(slots);
      const header = (_e = props.header) !== null && _e !== void 0 ? _e : (_f = slots.header) === null || _f === void 0 ? void 0 : _f.call(slots);
      const children = (0, _propsUtil.flattenChildren)((_g = slots.default) === null || _g === void 0 ? void 0 : _g.call(slots));
      const isSomethingAfterLastItem = !!(loadMore || props.pagination || footer);
      const classString = (0, _classNames.default)((0, _extends2.default)((0, _extends2.default)({}, classObj.value), {
        [`${prefixCls.value}-something-after-last-item`]: isSomethingAfterLastItem
      }), attrs.class, hashId.value);
      const paginationContent = props.pagination ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-pagination`
      }, [(0, _vue.createVNode)(_pagination.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, paginationProps.value), {}, {
        "onChange": onPaginationChange,
        "onShowSizeChange": onPaginationShowSizeChange
      }), null)]) : null;
      let childrenContent = isLoading.value && (0, _vue.createVNode)("div", {
        "style": {
          minHeight: '53px'
        }
      }, null);
      if (splitDataSource.value.length > 0) {
        listItemsKeys.length = 0;
        const items = splitDataSource.value.map((item, index) => renderInnerItem(item, index));
        const childrenList = items.map((child, index) => (0, _vue.createVNode)("div", {
          "key": listItemsKeys[index],
          "style": colStyle.value
        }, [child]));
        childrenContent = props.grid ? (0, _vue.createVNode)(_grid.Row, {
          "gutter": props.grid.gutter
        }, {
          default: () => [childrenList]
        }) : (0, _vue.createVNode)("ul", {
          "class": `${prefixCls.value}-items`
        }, [items]);
      } else if (!children.length && !isLoading.value) {
        childrenContent = (0, _vue.createVNode)("div", {
          "class": `${prefixCls.value}-empty-text`
        }, [((_h = props.locale) === null || _h === void 0 ? void 0 : _h.emptyText) || renderEmpty('List')]);
      }
      const paginationPosition = paginationProps.value.position || 'bottom';
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": classString
      }), [(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent, header && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-header`
      }, [header]), (0, _vue.createVNode)(_spin.default, loadingProp.value, {
        default: () => [childrenContent, children]
      }), footer && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-footer`
      }, [footer]), loadMore || (paginationPosition === 'bottom' || paginationPosition === 'both') && paginationContent]));
    };
  }
});
/* istanbul ignore next */
List.install = function (app) {
  app.component(List.name, List);
  app.component(List.Item.name, List.Item);
  app.component(List.Item.Meta.name, List.Item.Meta);
  return app;
};
var _default = exports.default = List;