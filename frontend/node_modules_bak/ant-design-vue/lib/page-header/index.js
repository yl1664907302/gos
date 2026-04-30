"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pageHeaderProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _ArrowLeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ArrowLeftOutlined"));
var _ArrowRightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ArrowRightOutlined"));
var _breadcrumb = _interopRequireDefault(require("../breadcrumb"));
var _avatar = _interopRequireDefault(require("../avatar"));
var _transButton = _interopRequireDefault(require("../_util/transButton"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _useDestroyed = _interopRequireDefault(require("../_util/hooks/useDestroyed"));
var _space = _interopRequireDefault(require("../space"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const pageHeaderProps = () => ({
  backIcon: (0, _type.vNodeType)(),
  prefixCls: String,
  title: (0, _type.vNodeType)(),
  subTitle: (0, _type.vNodeType)(),
  breadcrumb: _vueTypes.default.object,
  tags: (0, _type.vNodeType)(),
  footer: (0, _type.vNodeType)(),
  extra: (0, _type.vNodeType)(),
  avatar: (0, _type.objectType)(),
  ghost: {
    type: Boolean,
    default: undefined
  },
  onBack: Function
});
exports.pageHeaderProps = pageHeaderProps;
const PageHeader = (0, _vue.defineComponent)({
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
    } = (0, _useConfigInject.default)('page-header', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const compact = (0, _vue.shallowRef)(false);
    const isDestroyed = (0, _useDestroyed.default)();
    const onResize = _ref2 => {
      let {
        width
      } = _ref2;
      if (!isDestroyed.value) {
        compact.value = width < 768;
      }
    };
    const ghost = (0, _vue.computed)(() => {
      var _a, _b, _c;
      return (_c = (_a = props.ghost) !== null && _a !== void 0 ? _a : (_b = pageHeader === null || pageHeader === void 0 ? void 0 : pageHeader.value) === null || _b === void 0 ? void 0 : _b.ghost) !== null && _c !== void 0 ? _c : true;
    });
    const getBackIcon = () => {
      var _a, _b, _c;
      return (_c = (_a = props.backIcon) !== null && _a !== void 0 ? _a : (_b = slots.backIcon) === null || _b === void 0 ? void 0 : _b.call(slots)) !== null && _c !== void 0 ? _c : direction.value === 'rtl' ? (0, _vue.createVNode)(_ArrowRightOutlined.default, null, null) : (0, _vue.createVNode)(_ArrowLeftOutlined.default, null, null);
    };
    const renderBack = backIcon => {
      if (!backIcon || !props.onBack) {
        return null;
      }
      return (0, _vue.createVNode)(_LocaleReceiver.default, {
        "componentName": "PageHeader",
        "children": _ref3 => {
          let {
            back
          } = _ref3;
          return (0, _vue.createVNode)("div", {
            "class": `${prefixCls.value}-back`
          }, [(0, _vue.createVNode)(_transButton.default, {
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
      return props.breadcrumb ? (0, _vue.createVNode)(_breadcrumb.default, props.breadcrumb, null) : (_a = slots.breadcrumb) === null || _a === void 0 ? void 0 : _a.call(slots);
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
      return (0, _vue.createVNode)("div", {
        "class": headingPrefixCls
      }, [hasTitle && (0, _vue.createVNode)("div", {
        "class": `${headingPrefixCls}-left`
      }, [backIconDom, avatar ? (0, _vue.createVNode)(_avatar.default, avatar, null) : (_j = slots.avatar) === null || _j === void 0 ? void 0 : _j.call(slots), title && (0, _vue.createVNode)("span", {
        "class": `${headingPrefixCls}-title`,
        "title": typeof title === 'string' ? title : undefined
      }, [title]), subTitle && (0, _vue.createVNode)("span", {
        "class": `${headingPrefixCls}-sub-title`,
        "title": typeof subTitle === 'string' ? subTitle : undefined
      }, [subTitle]), tags && (0, _vue.createVNode)("span", {
        "class": `${headingPrefixCls}-tags`
      }, [tags])]), extra && (0, _vue.createVNode)("span", {
        "class": `${headingPrefixCls}-extra`
      }, [(0, _vue.createVNode)(_space.default, null, {
        default: () => [extra]
      })])]);
    };
    const renderFooter = () => {
      var _a, _b;
      const footer = (_a = props.footer) !== null && _a !== void 0 ? _a : (0, _propsUtil.filterEmpty)((_b = slots.footer) === null || _b === void 0 ? void 0 : _b.call(slots));
      return (0, _propsUtil.isEmptyContent)(footer) ? null : (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-footer`
      }, [footer]);
    };
    const renderChildren = children => {
      return (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-content`
      }, [children]);
    };
    return () => {
      var _a, _b;
      const hasBreadcrumb = ((_a = props.breadcrumb) === null || _a === void 0 ? void 0 : _a.routes) || slots.breadcrumb;
      const hasFooter = props.footer || slots.footer;
      const children = (0, _propsUtil.flattenChildren)((_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots));
      const className = (0, _classNames.default)(prefixCls.value, {
        'has-breadcrumb': hasBreadcrumb,
        'has-footer': hasFooter,
        [`${prefixCls.value}-ghost`]: ghost.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-compact`]: compact.value
      }, attrs.class, hashId.value);
      return wrapSSR((0, _vue.createVNode)(_vcResizeObserver.default, {
        "onResize": onResize
      }, {
        default: () => [(0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": className
        }), [renderBreadcrumb(), renderTitle(), children.length ? renderChildren(children) : null, renderFooter()])]
      }));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(PageHeader);