"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icons = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _PreviewGroup = _interopRequireDefault(require("../vc-image/src/PreviewGroup"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _RotateLeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RotateLeftOutlined"));
var _RotateRightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RotateRightOutlined"));
var _ZoomInOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ZoomInOutlined"));
var _ZoomOutOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/ZoomOutOutlined"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _LeftOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LeftOutlined"));
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _SwapOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/SwapOutlined"));
var _transition = require("../_util/transition");
var _style = _interopRequireDefault(require("./style"));
var _type = require("../_util/type");
const icons = exports.icons = {
  rotateLeft: (0, _vue.createVNode)(_RotateLeftOutlined.default, null, null),
  rotateRight: (0, _vue.createVNode)(_RotateRightOutlined.default, null, null),
  zoomIn: (0, _vue.createVNode)(_ZoomInOutlined.default, null, null),
  zoomOut: (0, _vue.createVNode)(_ZoomOutOutlined.default, null, null),
  close: (0, _vue.createVNode)(_CloseOutlined.default, null, null),
  left: (0, _vue.createVNode)(_LeftOutlined.default, null, null),
  right: (0, _vue.createVNode)(_RightOutlined.default, null, null),
  flipX: (0, _vue.createVNode)(_SwapOutlined.default, null, null),
  flipY: (0, _vue.createVNode)(_SwapOutlined.default, {
    "rotate": 90
  }, null)
};
const previewGroupProps = () => ({
  previewPrefixCls: String,
  preview: (0, _type.anyType)()
});
const InternalPreviewGroup = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AImagePreviewGroup',
  inheritAttrs: false,
  props: previewGroupProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls,
      rootPrefixCls
    } = (0, _useConfigInject.default)('image', props);
    const previewPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const mergedPreview = (0, _vue.computed)(() => {
      const {
        preview
      } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};
      return (0, _extends2.default)((0, _extends2.default)({}, _preview), {
        rootClassName: hashId.value,
        transitionName: (0, _transition.getTransitionName)(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: (0, _transition.getTransitionName)(rootPrefixCls.value, 'fade', _preview.maskTransitionName)
      });
    });
    return () => {
      return wrapSSR((0, _vue.createVNode)(_PreviewGroup.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _extends2.default)((0, _extends2.default)({}, attrs), props)), {}, {
        "preview": mergedPreview.value,
        "icons": icons,
        "previewPrefixCls": previewPrefixCls.value
      }), slots));
    };
  }
});
var _default = exports.default = InternalPreviewGroup;