"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.breadcrumbItemProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _dropdown = _interopRequireDefault(require("../dropdown/dropdown"));
var _DownOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DownOutlined"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _type = require("../_util/type");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const breadcrumbItemProps = () => ({
  prefixCls: String,
  href: String,
  separator: _vueTypes.default.any,
  dropdownProps: (0, _type.objectType)(),
  overlay: _vueTypes.default.any,
  onClick: (0, _type.eventType)()
});
exports.breadcrumbItemProps = breadcrumbItemProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ABreadcrumbItem',
  inheritAttrs: false,
  __ANT_BREADCRUMB_ITEM: true,
  props: breadcrumbItemProps(),
  // emits: ['click'],
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('breadcrumb', props);
    /**
     * if overlay is have
     * Wrap a Dropdown
     */
    const renderBreadcrumbNode = (breadcrumbItem, prefixCls) => {
      const overlay = (0, _propsUtil.getPropsSlot)(slots, props, 'overlay');
      if (overlay) {
        return (0, _vue.createVNode)(_dropdown.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props.dropdownProps), {}, {
          "overlay": overlay,
          "placement": "bottom"
        }), {
          default: () => [(0, _vue.createVNode)("span", {
            "class": `${prefixCls}-overlay-link`
          }, [breadcrumbItem, (0, _vue.createVNode)(_DownOutlined.default, null, null)])]
        });
      }
      return breadcrumbItem;
    };
    const handleClick = e => {
      emit('click', e);
    };
    return () => {
      var _a;
      const separator = (_a = (0, _propsUtil.getPropsSlot)(slots, props, 'separator')) !== null && _a !== void 0 ? _a : '/';
      const children = (0, _propsUtil.getPropsSlot)(slots, props);
      const {
          class: cls,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      let link;
      if (props.href !== undefined) {
        link = (0, _vue.createVNode)("a", (0, _objectSpread2.default)({
          "class": `${prefixCls.value}-link`,
          "onClick": handleClick
        }, restAttrs), [children]);
      } else {
        link = (0, _vue.createVNode)("span", (0, _objectSpread2.default)({
          "class": `${prefixCls.value}-link`,
          "onClick": handleClick
        }, restAttrs), [children]);
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children !== undefined && children !== null) {
        return (0, _vue.createVNode)("li", {
          "class": cls,
          "style": style
        }, [link, separator && (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-separator`
        }, [separator])]);
      }
      return null;
    };
  }
});