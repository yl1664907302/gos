import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent, shallowRef, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import { filterEmpty, flattenChildren, isEmptyContent } from '../_util/props-util';
import ArrowLeftOutlined from "@ant-design/icons-vue/es/icons/ArrowLeftOutlined";
import ArrowRightOutlined from "@ant-design/icons-vue/es/icons/ArrowRightOutlined";
import Breadcrumb from '../breadcrumb';
import Avatar from '../avatar';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { objectType, vNodeType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import ResizeObserver from '../vc-resize-observer';
import useDestroyed from '../_util/hooks/useDestroyed';
import Space from '../space';
// CSSINJS
import useStyle from './style';
export const pageHeaderProps = () => ({
  backIcon: vNodeType(),
  prefixCls: String,
  title: vNodeType(),
  subTitle: vNodeType(),
  breadcrumb: PropTypes.object,
  tags: vNodeType(),
  footer: vNodeType(),
  extra: vNodeType(),
  avatar: objectType(),
  ghost: {
    type: Boolean,
    default: undefined
  },
  onBack: Function
});
const PageHeader = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'APageHeader',
  inheritAttrs: false,
  props: pageHeaderProps(),
  // emits: ['back'],
  slots: Object,
  setup(props, _ref) {
    let {
      emit,
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction,
      pageHeader
    } = useConfigInject('page-header', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const compact = shallowRef(false);
    const isDestroyed = useDestroyed();
    const onResize = _ref2 => {
      let {
        width
      } = _ref2;
      if (!isDestroyed.value) {
        compact.value = width < 768;
      }
    };
    const ghost = computed(() => {
      var _a, _b, _c;
      return (_c = (_a = props.ghost) !== null && _a !== void 0 ? _a : (_b = pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.value) === null || _b === void 0 ? void 0 : _b.ghost) !== null && _c !== void 0 ? _c : true;
    });
    const getBackIcon = () => {
      var _a, _b, _c;
      return (_c = (_a = props.backIcon) !== null && _a !== void 0 ? _a : (_b = slots.backIcon) === null || _b === void 0 ? void 0 : _b.call(slots)) !== null && _c !== void 0 ? _c : direction.value === 'rtl' ? _createVNode(ArrowRightOutlined, null, null) : _createVNode(ArrowLeftOutlined, null, null);
    };
    const renderBack = backIcon => {
      if (!backIcon || !props.onBack) {
        return null;
      }
      return _createVNode(LocaleReceiver, {
        "componentName": "PageHeader",
        "children": _ref3 => {
          let {
            back
          } = _ref3;
          return _createVNode("div", {
            "class": `${prefixCls.value}-back`
          }, [_createVNode(TransButton, {
            "onClick": e => {
              emit('back', e);
            },
            "class": `${prefixCls.value}-back-button`,
            "aria-label": back
          }, {
            default: () => [backIcon]
          })]);
        }
      }, null);
    };
    const renderBreadcrumb = () => {
      var _a;
      return props.breadcrumb ? _createVNode(Breadcrumb, props.breadcrumb, null) : (_a = slots.breadcrumb) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
    const renderTitle = () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j;
      const {
        avatar
      } = props;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const subTitle = (_c = props.subTitle) !== null && _c !== void 0 ? _c : (_d = slots.subTitle) === null || _d === void 0 ? void 0 : _d.call(slots);
      const tags = (_e = props.tags) !== null && _e !== void 0 ? _e : (_f = slots.tags) === null || _f === void 0 ? void 0 : _f.call(slots);
      const extra = (_g = props.extra) !== null && _g !== void 0 ? _g : (_h = slots.extra) === null || _h === void 0 ? void 0 : _h.call(slots);
      const headingPrefixCls = `${prefixCls.value}-heading`;
      const hasHeading = title || subTitle || tags || extra;
      // If there is nothing, return a null
      if (!hasHeading) {
        return null;
      }
      const backIcon = getBackIcon();
      const backIconDom = renderBack(backIcon);
      const hasTitle = backIconDom || avatar || hasHeading;
      return _createVNode("div", {
        "class": headingPrefixCls
      }, [hasTitle && _createVNode("div", {
        "class": `${headingPrefixCls}-left`
      }, [backIconDom, avatar ? _createVNode(Avatar, avatar, null) : (_j = slots.avatar) === null || _j === void 0 ? void 0 : _j.call(slots), title && _createVNode("span", {
        "class": `${headingPrefixCls}-title`,
        "title": typeof title === 'string' ? title : undefined
      }, [title]), subTitle && _createVNode("span", {
        "class": `${headingPrefixCls}-sub-title`,
        "title": typeof subTitle === 'string' ? subTitle : undefined
      }, [subTitle]), tags && _createVNode("span", {
        "class": `${headingPrefixCls}-tags`
      }, [tags])]), extra && _createVNode("span", {
        "class": `${headingPrefixCls}-extra`
      }, [_createVNode(Space, null, {
        default: () => [extra]
      })])]);
    };
    const renderFooter = () => {
      var _a, _b;
      const footer = (_a = props.footer) !== null && _a !== void 0 ? _a : filterEmpty((_b = slots.footer) === null || _b === void 0 ? void 0 : _b.call(slots));
      return isEmptyContent(footer) ? null : _createVNode("div", {
        "class": `${prefixCls.value}-footer`
      }, [footer]);
    };
    const renderChildren = children => {
      return _createVNode("div", {
        "class": `${prefixCls.value}-content`
      }, [children]);
    };
    return () => {
      var _a, _b;
      const hasBreadcrumb = ((_a = props.breadcrumb) === null || _a === void 0 ? void 0 : _a.routes) || slots.breadcrumb;
      const hasFooter = props.footer || slots.footer;
      const children = flattenChildren((_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots));
      const className = classNames(prefixCls.value, {
        'has-breadcrumb': hasBreadcrumb,
        'has-footer': hasFooter,
        [`${prefixCls.value}-ghost`]: ghost.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-compact`]: compact.value
      }, attrs.class, hashId.value);
      return wrapSSR(_createVNode(ResizeObserver, {
        "onResize": onResize
      }, {
        default: () => [_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
          "class": className
        }), [renderBreadcrumb(), renderTitle(), children.length ? renderChildren(children) : null, renderFooter()])]
      }));
    };
  }
});
export default withInstall(PageHeader);