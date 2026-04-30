import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import Dropdown from '../dropdown/dropdown';
import DownOutlined from "@ant-design/icons-vue/es/icons/DownOutlined";
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { eventType, objectType } from '../_util/type';
export const breadcrumbItemProps = () => ({
  prefixCls: String,
  href: String,
  separator: PropTypes.any,
  dropdownProps: objectType(),
  overlay: PropTypes.any,
  onClick: eventType()
});
export default defineComponent({
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
    } = useConfigInject('breadcrumb', props);
    /**
     * if overlay is have
     * Wrap a Dropdown
     */
    const renderBreadcrumbNode = (breadcrumbItem, prefixCls) => {
      const overlay = getPropsSlot(slots, props, 'overlay');
      if (overlay) {
        return _createVNode(Dropdown, _objectSpread(_objectSpread({}, props.dropdownProps), {}, {
          "overlay": overlay,
          "placement": "bottom"
        }), {
          default: () => [_createVNode("span", {
            "class": `${prefixCls}-overlay-link`
          }, [breadcrumbItem, _createVNode(DownOutlined, null, null)])]
        });
      }
      return breadcrumbItem;
    };
    const handleClick = e => {
      emit('click', e);
    };
    return () => {
      var _a;
      const separator = (_a = getPropsSlot(slots, props, 'separator')) !== null && _a !== void 0 ? _a : '/';
      const children = getPropsSlot(slots, props);
      const {
          class: cls,
          style
        } = attrs,
        restAttrs = __rest(attrs, ["class", "style"]);
      let link;
      if (props.href !== undefined) {
        link = _createVNode("a", _objectSpread({
          "class": `${prefixCls.value}-link`,
          "onClick": handleClick
        }, restAttrs), [children]);
      } else {
        link = _createVNode("span", _objectSpread({
          "class": `${prefixCls.value}-link`,
          "onClick": handleClick
        }, restAttrs), [children]);
      }
      // wrap to dropDown
      link = renderBreadcrumbNode(link, prefixCls.value);
      if (children !== undefined && children !== null) {
        return _createVNode("li", {
          "class": cls,
          "style": style
        }, [link, separator && _createVNode("span", {
          "class": `${prefixCls.value}-separator`
        }, [separator])]);
      }
      return null;
    };
  }
});