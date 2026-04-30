import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import ImageInternal from '../vc-image';
import { imageProps } from '../vc-image/src/Image';
import defaultLocale from '../locale/en_US';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import PreviewGroup, { icons } from './PreviewGroup';
import EyeOutlined from "@ant-design/icons-vue/es/icons/EyeOutlined";
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import classNames from '../_util/classNames';
const Image = defineComponent({
  name: 'AImage',
  inheritAttrs: false,
  props: imageProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      rootPrefixCls,
      configProvider
    } = useConfigInject('image', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedPreview = computed(() => {
      const {
        preview
      } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};
      return _extends(_extends({
        icons
      }, _preview), {
        transitionName: getTransitionName(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: getTransitionName(rootPrefixCls.value, 'fade', _preview.maskTransitionName)
      });
    });
    return () => {
      var _a, _b;
      const imageLocale = ((_b = (_a = configProvider.locale) === null || _a === void 0 ? void 0 : _a.value) === null || _b === void 0 ? void 0 : _b.Image) || defaultLocale.Image;
      const defaultPreviewMask = () => _createVNode("div", {
        "class": `${prefixCls.value}-mask-info`
      }, [_createVNode(EyeOutlined, null, null), imageLocale === null || imageLocale === void 0 ? void 0 : imageLocale.preview]);
      const {
        previewMask = slots.previewMask || defaultPreviewMask
      } = props;
      return wrapSSR(_createVNode(ImageInternal, _objectSpread(_objectSpread({}, _extends(_extends(_extends({}, attrs), props), {
        prefixCls: prefixCls.value
      })), {}, {
        "preview": mergedPreview.value,
        "rootClassName": classNames(props.rootClassName, hashId.value)
      }), _extends(_extends({}, slots), {
        previewMask: typeof previewMask === 'function' ? previewMask : null
      })));
    };
  }
});
export { imageProps };
Image.PreviewGroup = PreviewGroup;
Image.install = function (app) {
  app.component(Image.name, Image);
  app.component(Image.PreviewGroup.name, Image.PreviewGroup);
  return app;
};
export { PreviewGroup as ImagePreviewGroup };
export default Image;