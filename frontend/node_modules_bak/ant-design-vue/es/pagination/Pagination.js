import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, toRef, defineComponent } from 'vue';
import LeftOutlined from "@ant-design/icons-vue/es/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import DoubleLeftOutlined from "@ant-design/icons-vue/es/icons/DoubleLeftOutlined";
import DoubleRightOutlined from "@ant-design/icons-vue/es/icons/DoubleRightOutlined";
import MiniSelect, { MiddleSelect } from './Select';
import { useLocaleReceiver } from '../locale-provider/LocaleReceiver';
import VcPagination from '../vc-pagination';
import enUS from '../vc-pagination/locale/en_US';
import classNames from '../_util/classNames';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import { booleanType, arrayType, stringType, functionType, someType } from '../_util/type';
// CSSINJS
import useStyle from './style';
export const paginationProps = () => ({
  total: Number,
  defaultCurrent: Number,
  disabled: booleanType(),
  current: Number,
  defaultPageSize: Number,
  pageSize: Number,
  hideOnSinglePage: booleanType(),
  showSizeChanger: booleanType(),
  pageSizeOptions: arrayType(),
  buildOptionText: functionType(),
  showQuickJumper: someType([Boolean, Object]),
  showTotal: functionType(),
  size: stringType(),
  simple: booleanType(),
  locale: Object,
  prefixCls: String,
  selectPrefixCls: String,
  totalBoundaryShowSizeChanger: Number,
  selectComponentClass: String,
  itemRender: functionType(),
  role: String,
  responsive: Boolean,
  showLessItems: booleanType(),
  onChange: functionType(),
  onShowSizeChange: functionType(),
  'onUpdate:current': functionType(),
  'onUpdate:pageSize': functionType()
});
export const paginationConfig = () => _extends(_extends({}, paginationProps()), {
  position: stringType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'APagination',
  inheritAttrs: false,
  props: paginationProps(),
  // emits: ['change', 'showSizeChange', 'update:current', 'update:pageSize'],
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      configProvider,
      direction,
      size
    } = useConfigInject('pagination', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const selectPrefixCls = computed(() => configProvider.getPrefixCls('select', props.selectPrefixCls));
    const breakpoint = useBreakpoint();
    const [locale] = useLocaleReceiver('Pagination', enUS, toRef(props, 'locale'));
    const getIconsProps = pre => {
      const ellipsis = _createVNode("span", {
        "class": `${pre}-item-ellipsis`
      }, [_createTextVNode("\u2022\u2022\u2022")]);
      const prevIcon = _createVNode("button", {
        "class": `${pre}-item-link`,
        "type": "button",
        "tabindex": -1
      }, [direction.value === 'rtl' ? _createVNode(RightOutlined, null, null) : _createVNode(LeftOutlined, null, null)]);
      const nextIcon = _createVNode("button", {
        "class": `${pre}-item-link`,
        "type": "button",
        "tabindex": -1
      }, [direction.value === 'rtl' ? _createVNode(LeftOutlined, null, null) : _createVNode(RightOutlined, null, null)]);
      const jumpPrevIcon = _createVNode("a", {
        "rel": "nofollow",
        "class": `${pre}-item-link`
      }, [_createVNode("div", {
        "class": `${pre}-item-container`
      }, [direction.value === 'rtl' ? _createVNode(DoubleRightOutlined, {
        "class": `${pre}-item-link-icon`
      }, null) : _createVNode(DoubleLeftOutlined, {
        "class": `${pre}-item-link-icon`
      }, null), ellipsis])]);
      const jumpNextIcon = _createVNode("a", {
        "rel": "nofollow",
        "class": `${pre}-item-link`
      }, [_createVNode("div", {
        "class": `${pre}-item-container`
      }, [direction.value === 'rtl' ? _createVNode(DoubleLeftOutlined, {
        "class": `${pre}-item-link-icon`
      }, null) : _createVNode(DoubleRightOutlined, {
        "class": `${pre}-item-link-icon`
      }, null), ellipsis])]);
      return {
        prevIcon,
        nextIcon,
        jumpPrevIcon,
        jumpNextIcon
      };
    };
    return () => {
      var _a;
      const {
          itemRender = slots.itemRender,
          buildOptionText = slots.buildOptionText,
          selectComponentClass,
          responsive
        } = props,
        restProps = __rest(props, ["itemRender", "buildOptionText", "selectComponentClass", "responsive"]);
      const isSmall = size.value === 'small' || !!(((_a = breakpoint.value) === null || _a === void 0 ? void 0 : _a.xs) && !size.value && responsive);
      const paginationProps = _extends(_extends(_extends(_extends(_extends({}, restProps), getIconsProps(prefixCls.value)), {
        prefixCls: prefixCls.value,
        selectPrefixCls: selectPrefixCls.value,
        selectComponentClass: selectComponentClass || (isSmall ? MiniSelect : MiddleSelect),
        locale: locale.value,
        buildOptionText
      }), attrs), {
        class: classNames({
          [`${prefixCls.value}-mini`]: isSmall,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value),
        itemRender
      });
      return wrapSSR(_createVNode(VcPagination, paginationProps, null));
    };
  }
});