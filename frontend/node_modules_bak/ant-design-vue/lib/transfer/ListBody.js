"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferListBodyProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _ListItem = _interopRequireDefault(require("./ListItem"));
var _pagination = _interopRequireDefault(require("../pagination"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _type = require("../_util/type");
const transferListBodyProps = exports.transferListBodyProps = {
  prefixCls: String,
  filteredRenderItems: _vueTypes.default.array.def([]),
  selectedKeys: _vueTypes.default.array,
  disabled: (0, _type.booleanType)(),
  showRemove: (0, _type.booleanType)(),
  pagination: _vueTypes.default.any,
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
    return (0, _extends2.default)((0, _extends2.default)({}, defaultPagination), pagination);
  }
  return defaultPagination;
}
const ListBody = (0, _vue.defineComponent)({
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
    const current = (0, _vue.ref)(1);
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
    const mergedPagination = (0, _vue.computed)(() => parsePagination(props.pagination));
    (0, _vue.watch)([mergedPagination, () => props.filteredRenderItems], () => {
      if (mergedPagination.value) {
        // Calculate the page number
        const maxPageCount = Math.ceil(props.filteredRenderItems.length / mergedPagination.value.pageSize);
        current.value = Math.min(current.value, maxPageCount);
      }
    }, {
      immediate: true
    });
    const items = (0, _vue.computed)(() => {
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
        paginationNode = (0, _vue.createVNode)(_pagination.default, {
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
        return (0, _vue.createVNode)(_ListItem.default, {
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
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("ul", {
        "class": (0, _classNames.default)(`${prefixCls}-content`, {
          [`${prefixCls}-content-show-remove`]: showRemove
        }),
        "onScroll": handleScroll
      }, [itemsList]), paginationNode]);
    };
  }
});
var _default = exports.default = ListBody;