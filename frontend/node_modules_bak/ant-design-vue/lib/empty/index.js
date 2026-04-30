"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emptyProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _empty = _interopRequireDefault(require("./empty"));
var _simple = _interopRequireDefault(require("./simple"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const emptyProps = () => ({
  prefixCls: String,
  imageStyle: (0, _type.objectType)(),
  image: (0, _type.anyType)(),
  description: (0, _type.anyType)()
});
exports.emptyProps = emptyProps;
const Empty = (0, _vue.defineComponent)({
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
    } = (0, _useConfigInject.default)('empty', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixClsRef);
    return () => {
      var _a, _b;
      const prefixCls = prefixClsRef.value;
      const _c = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          image: mergedImage = ((_a = slots.image) === null || _a === void 0 ? void 0 : _a.call(slots)) || (0, _vue.h)(_empty.default),
          description = ((_b = slots.description) === null || _b === void 0 ? void 0 : _b.call(slots)) || undefined,
          imageStyle,
          class: className = ''
        } = _c,
        restProps = __rest(_c, ["image", "description", "imageStyle", "class"]);
      const image = typeof mergedImage === 'function' ? mergedImage() : mergedImage;
      const isNormal = typeof image === 'object' && 'type' in image && image.type.PRESENTED_IMAGE_SIMPLE;
      return wrapSSR((0, _vue.createVNode)(_LocaleReceiver.default, {
        "componentName": "Empty",
        "children": locale => {
          const des = typeof description !== 'undefined' ? description : locale.description;
          const alt = typeof des === 'string' ? des : 'empty';
          let imageNode = null;
          if (typeof image === 'string') {
            imageNode = (0, _vue.createVNode)("img", {
              "alt": alt,
              "src": image
            }, null);
          } else {
            imageNode = image;
          }
          return (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
            "class": (0, _classNames.default)(prefixCls, className, hashId.value, {
              [`${prefixCls}-normal`]: isNormal,
              [`${prefixCls}-rtl`]: direction.value === 'rtl'
            })
          }, restProps), [(0, _vue.createVNode)("div", {
            "class": `${prefixCls}-image`,
            "style": imageStyle
          }, [imageNode]), des && (0, _vue.createVNode)("p", {
            "class": `${prefixCls}-description`
          }, [des]), slots.default && (0, _vue.createVNode)("div", {
            "class": `${prefixCls}-footer`
          }, [(0, _propsUtil.filterEmpty)(slots.default())])]);
        }
      }, null));
    };
  }
});
Empty.PRESENTED_IMAGE_DEFAULT = () => (0, _vue.h)(_empty.default);
Empty.PRESENTED_IMAGE_SIMPLE = () => (0, _vue.h)(_simple.default);
var _default = exports.default = (0, _type.withInstall)(Empty);