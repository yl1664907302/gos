import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent, h } from 'vue';
import classNames from '../_util/classNames';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import DefaultEmptyImg from './empty';
import SimpleEmptyImg from './simple';
import { filterEmpty } from '../_util/props-util';
import { anyType, objectType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
export const emptyProps = () => ({
  prefixCls: String,
  imageStyle: objectType(),
  image: anyType(),
  description: anyType()
});
const Empty = defineComponent({
  name: 'AEmpty',
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: emptyProps(),
  setup(props, _ref) {
    let {
      slots = {},
      attrs
    } = _ref;
    const {
      direction,
      prefixCls: prefixClsRef
    } = useConfigInject('empty', props);
    const [wrapSSR, hashId] = useStyle(prefixClsRef);
    return () => {
      var _a, _b;
      const prefixCls = prefixClsRef.value;
      const _c = _extends(_extends({}, props), attrs),
        {
          image: mergedImage = ((_a = slots.image) === null || _a === void 0 ? void 0 : _a.call(slots)) || h(DefaultEmptyImg),
          description = ((_b = slots.description) === null || _b === void 0 ? void 0 : _b.call(slots)) || undefined,
          imageStyle,
          class: className = ''
        } = _c,
        restProps = __rest(_c, ["image", "description", "imageStyle", "class"]);
      const image = typeof mergedImage === 'function' ? mergedImage() : mergedImage;
      const isNormal = typeof image === 'object' && 'type' in image && image.type.PRESENTED_IMAGE_SIMPLE;
      return wrapSSR(_createVNode(LocaleReceiver, {
        "componentName": "Empty",
        "children": locale => {
          const des = typeof description !== 'undefined' ? description : locale.description;
          const alt = typeof des === 'string' ? des : 'empty';
          let imageNode = null;
          if (typeof image === 'string') {
            imageNode = _createVNode("img", {
              "alt": alt,
              "src": image
            }, null);
          } else {
            imageNode = image;
          }
          return _createVNode("div", _objectSpread({
            "class": classNames(prefixCls, className, hashId.value, {
              [`${prefixCls}-normal`]: isNormal,
              [`${prefixCls}-rtl`]: direction.value === 'rtl'
            })
          }, restProps), [_createVNode("div", {
            "class": `${prefixCls}-image`,
            "style": imageStyle
          }, [imageNode]), des && _createVNode("p", {
            "class": `${prefixCls}-description`
          }, [des]), slots.default && _createVNode("div", {
            "class": `${prefixCls}-footer`
          }, [filterEmpty(slots.default())])]);
        }
      }, null));
    };
  }
});
Empty.PRESENTED_IMAGE_DEFAULT = () => h(DefaultEmptyImg);
Empty.PRESENTED_IMAGE_SIMPLE = () => h(SimpleEmptyImg);
export default withInstall(Empty);