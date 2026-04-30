"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "ImagePreviewGroup", {
  enumerable: true,
  get: function () {
    return _PreviewGroup.default;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "imageProps", {
  enumerable: true,
  get: function () {
    return _Image.imageProps;
  }
});
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcImage = _interopRequireDefault(require("../vc-image"));
var _Image = require("../vc-image/src/Image");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _PreviewGroup = _interopRequireWildcard(require("./PreviewGroup"));
var _EyeOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EyeOutlined"));
var _transition = require("../_util/transition");
var _style = _interopRequireDefault(require("./style"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Image = (0, _vue.defineComponent)({
  name: 'AImage',
  inheritAttrs: false,
  props: (0, _Image.imageProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      rootPrefixCls,
      configProvider
    } = (0, _useConfigInject.default)('image', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const mergedPreview = (0, _vue.computed)(() => {
      const {
        preview
      } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};
      return (0, _extends2.default)((0, _extends2.default)({
        icons: _PreviewGroup.icons
      }, _preview), {
        transitionName: (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: (0, _transition.getTransitionName)(rootPrefixCls.value, 'fade', _preview.maskTransitionName)
      });
    });
    return () => {
      var _a, _b;
      const imageLocale = ((_b = (_a = configProvider.locale) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.Image) || _en_US.default.Image;
      const defaultPreviewMask = () => (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-mask-info`
      }, [(0, _vue.createVNode)(_EyeOutlined.default, null, null), imageLocale === null || imageLocale === void 0 ? void 0 : imageLocale.preview]);
      const {
        previewMask = slots.previewMask || defaultPreviewMask
      } = props;
      return wrapSSR((0, _vue.createVNode)(_vcImage.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), props), {
        prefixCls: prefixCls.value
      })), {}, {
        "preview": mergedPreview.value,
        "rootClassName": (0, _classNames.default)(props.rootClassName, hashId.value)
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        previewMask: typeof previewMask === 'function' ? previewMask : null
      })));
    };
  }
});
Image.PreviewGroup = _PreviewGroup.default;
Image.install = function (app) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};
var _default = exports.default = Image;