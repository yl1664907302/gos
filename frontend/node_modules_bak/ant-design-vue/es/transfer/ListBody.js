import _extends from "@babel/runtime/helpers/esm/extends";
import { Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { defineComponent, computed, ref, watch } from 'vue';
import classNames from '../_util/classNames';
import ListItem from './ListItem';
import Pagination from '../pagination';
import PropTypes from '../_util/vue-types';
import { booleanType } from '../_util/type';
export const transferListBodyProps = {
  prefixCls: String,
  filteredRenderItems: PropTypes.array.def([]),
  selectedKeys: PropTypes.array,
  disabled: booleanType(),
  showRemove: booleanType(),
  pagination: PropTypes.any,
  onItemSelect: Function,
  onScroll: Function,
  onItemRemove: Function
};
function parsePagination(pagination) {
  if (!pagination) {
    return null;
  }
  const defaultPagination = {
    pageSize: 10,
    simple: true,
    showSizeChanger: false,
    showLessItems: false
  };
  if (typeof pagination === 'object') {
    return _extends(_extends({}, defaultPagination), pagination);
  }
  return defaultPagination;
}
const ListBody = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ListBody',
  inheritAttrs: false,
  props: transferListBodyProps,
  emits: ['itemSelect', 'itemRemove', 'scroll'],
  setup(props, _ref) {
    let {
      emit,
      expose
    } = _ref;
    const current = ref(1);
    const handleItemSelect = item => {
      const {
        selectedKeys
      } = props;
      const checked = selectedKeys.indexOf(item.key) >= 0;
      emit('itemSelect', item.key, !checked);
    };
    const handleItemRemove = item => {
      emit('itemRemove', [item.key]);
    };
    const handleScroll = e => {
      emit('scroll', e);
    };
    const mergedPagination = computed(() => parsePagination(props.pagination));
    watch([mergedPagination, () => props.filteredRenderItems], () => {
      if (mergedPagination.value) {
        // Calculate the page number
        const maxPageCount = Math.ceil(props.filteredRenderItems.length / mergedPagination.value.pageSize);
        current.value = Math.min(current.value, maxPageCount);
      }
    }, {
      immediate: true
    });
    const items = computed(() => {
      const {
        filteredRenderItems
      } = props;
      let displayItems = filteredRenderItems;
      if (mergedPagination.value) {
        displayItems = filteredRenderItems.slice((current.value - 1) * mergedPagination.value.pageSize, current.value * mergedPagination.value.pageSize);
      }
      return displayItems;
    });
    const onPageChange = cur => {
      current.value = cur;
    };
    expose({
      items
    });
    return () => {
      const {
        prefixCls,
        filteredRenderItems,
        selectedKeys,
        disabled: globalDisabled,
        showRemove
      } = props;
      let paginationNode = null;
      if (mergedPagination.value) {
        paginationNode = _createVNode(Pagination, {
          "simple": mergedPagination.value.simple,
          "showSizeChanger": mergedPagination.value.showSizeChanger,
          "showLessItems": mergedPagination.value.showLessItems,
          "size": "small",
          "disabled": globalDisabled,
          "class": `${prefixCls}-pagination`,
          "total": filteredRenderItems.length,
          "pageSize": mergedPagination.value.pageSize,
          "current": current.value,
          "onChange": onPageChange
        }, null);
      }
      const itemsList = items.value.map(_ref2 => {
        let {
          renderedEl,
          renderedText,
          item
        } = _ref2;
        const {
          disabled
        } = item;
        const checked = selectedKeys.indexOf(item.key) >= 0;
        return _createVNode(ListItem, {
          "disabled": globalDisabled || disabled,
          "key": item.key,
          "item": item,
          "renderedText": renderedText,
          "renderedEl": renderedEl,
          "checked": checked,
          "prefixCls": prefixCls,
          "onClick": handleItemSelect,
          "onRemove": handleItemRemove,
          "showRemove": showRemove
        }, null);
      });
      return _createVNode(_Fragment, null, [_createVNode("ul", {
        "class": classNames(`${prefixCls}-content`, {
          [`${prefixCls}-content-show-remove`]: showRemove
        }),
        "onScroll": handleScroll
      }, [itemsList]), paginationNode]);
    };
  }
});
export default ListBody;