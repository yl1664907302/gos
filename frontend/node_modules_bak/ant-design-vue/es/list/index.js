import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { provide, defineComponent, ref, watch, computed, toRef } from 'vue';
import classNames from '../_util/classNames';
import Spin from '../spin';
import Pagination from '../pagination';
import { Row } from '../grid';
import Item from './Item';
import { flattenChildren } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { arrayType, someType, booleanType, objectType, vNodeType, functionType } from '../_util/type';
import ItemMeta from './ItemMeta';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { responsiveArray } from '../_util/responsiveObserve';
import eagerComputed from '../_util/eagerComputed';
// CSSINJS
import useStyle from './style';
export const listProps = () => ({
  bordered: booleanType(),
  dataSource: arrayType(),
  extra: vNodeType(),
  grid: objectType(),
  itemLayout: String,
  loading: someType([Boolean, Object]),
  loadMore: vNodeType(),
  pagination: someType([Boolean, Object]),
  prefixCls: String,
  rowKey: someType([String, Number, Function]),
  renderItem: functionType(),
  size: String,
  split: booleanType(),
  header: vNodeType(),
  footer: vNodeType(),
  locale: objectType()
});
import { ListContextKey } from './contextKey';
const List = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AList',
  inheritAttrs: false,
  Item,
  props: initDefaultProps(listProps(), {
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
    provide(ListContextKey, {
      grid: toRef(props, 'grid'),
      itemLayout: toRef(props, 'itemLayout')
    });
    const defaultPaginationProps = {
      current: 1,
      total: 0
    };
    const {
      prefixCls,
      direction,
      renderEmpty
    } = useConfigInject('list', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const paginationObj = computed(() => props.pagination && typeof props.pagination === 'object' ? props.pagination : {});
    const paginationCurrent = ref((_a = paginationObj.value.defaultCurrent) !== null && _a !== void 0 ? _a : 1);
    const paginationSize = ref((_b = paginationObj.value.defaultPageSize) !== null && _b !== void 0 ? _b : 10);
    watch(paginationObj, () => {
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
    const loadingProp = computed(() => {
      if (typeof props.loading === 'boolean') {
        return {
          spinning: props.loading
        };
      } else {
        return props.loading;
      }
    });
    const isLoading = computed(() => loadingProp.value && loadingProp.value.spinning);
    const sizeCls = computed(() => {
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
    const classObj = computed(() => ({
      [`${prefixCls.value}`]: true,
      [`${prefixCls.value}-vertical`]: props.itemLayout === 'vertical',
      [`${prefixCls.value}-${sizeCls.value}`]: sizeCls.value,
      [`${prefixCls.value}-split`]: props.split,
      [`${prefixCls.value}-bordered`]: props.bordered,
      [`${prefixCls.value}-loading`]: isLoading.value,
      [`${prefixCls.value}-grid`]: !!props.grid,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }));
    const paginationProps = computed(() => {
      const pp = _extends(_extends(_extends({}, defaultPaginationProps), {
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
    const splitDataSource = computed(() => {
      let dd = [...props.dataSource];
      if (props.pagination) {
        if (props.dataSource.length > (paginationProps.value.current - 1) * paginationProps.value.pageSize) {
          dd = [...props.dataSource].splice((paginationProps.value.current - 1) * paginationProps.value.pageSize, paginationProps.value.pageSize);
        }
      }
      return dd;
    });
    const screens = useBreakpoint();
    const currentBreakpoint = eagerComputed(() => {
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint = responsiveArray[i];
        if (screens.value[breakpoint]) {
          return breakpoint;
        }
      }
      return undefined;
    });
    const colStyle = computed(() => {
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
      const children = flattenChildren((_g = slots.default) === null || _g === void 0 ? void 0 : _g.call(slots));
      const isSomethingAfterLastItem = !!(loadMore || props.pagination || footer);
      const classString = classNames(_extends(_extends({}, classObj.value), {
        [`${prefixCls.value}-something-after-last-item`]: isSomethingAfterLastItem
      }), attrs.class, hashId.value);
      const paginationContent = props.pagination ? _createVNode("div", {
        "class": `${prefixCls.value}-pagination`
      }, [_createVNode(Pagination, _objectSpread(_objectSpread({}, paginationProps.value), {}, {
        "onChange": onPaginationChange,
        "onShowSizeChange": onPaginationShowSizeChange
      }), null)]) : null;
      let childrenContent = isLoading.value && _createVNode("div", {
        "style": {
          minHeight: '53px'
        }
      }, null);
      if (splitDataSource.value.length > 0) {
        listItemsKeys.length = 0;
        const items = splitDataSource.value.map((item, index) => renderInnerItem(item, index));
        const childrenList = items.map((child, index) => _createVNode("div", {
          "key": listItemsKeys[index],
          "style": colStyle.value
        }, [child]));
        childrenContent = props.grid ? _createVNode(Row, {
          "gutter": props.grid.gutter
        }, {
          default: () => [childrenList]
        }) : _createVNode("ul", {
          "class": `${prefixCls.value}-items`
        }, [items]);
      } else if (!children.length && !isLoading.value) {
        childrenContent = _createVNode("div", {
          "class": `${prefixCls.value}-empty-text`
        }, [((_h = props.locale) === null || _h === void 0 ? void 0 : _h.emptyText) || renderEmpty('List')]);
      }
      const paginationPosition = paginationProps.value.position || 'bottom';
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classString
      }), [(paginationPosition === 'top' || paginationPosition === 'both') && paginationContent, header && _createVNode("div", {
        "class": `${prefixCls.value}-header`
      }, [header]), _createVNode(Spin, loadingProp.value, {
        default: () => [childrenContent, children]
      }), footer && _createVNode("div", {
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
export { ItemMeta as ListItemMeta, Item as ListItem };
export default List;