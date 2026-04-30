import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import PreviewGroup from '../vc-image/src/PreviewGroup';
import { computed, defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import RotateLeftOutlined from "@ant-design/icons-vue/es/icons/RotateLeftOutlined";
import RotateRightOutlined from "@ant-design/icons-vue/es/icons/RotateRightOutlined";
import ZoomInOutlined from "@ant-design/icons-vue/es/icons/ZoomInOutlined";
import ZoomOutOutlined from "@ant-design/icons-vue/es/icons/ZoomOutOutlined";
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import LeftOutlined from "@ant-design/icons-vue/es/icons/LeftOutlined";
import RightOutlined from "@ant-design/icons-vue/es/icons/RightOutlined";
import SwapOutlined from "@ant-design/icons-vue/es/icons/SwapOutlined";
import { getTransitionName } from '../_util/transition';
import useStyle from './style';
import { anyType } from '../_util/type';
export const icons = {
  rotateLeft: _createVNode(RotateLeftOutlined, null, null),
  rotateRight: _createVNode(RotateRightOutlined, null, null),
  zoomIn: _createVNode(ZoomInOutlined, null, null),
  zoomOut: _createVNode(ZoomOutOutlined, null, null),
  close: _createVNode(CloseOutlined, null, null),
  left: _createVNode(LeftOutlined, null, null),
  right: _createVNode(RightOutlined, null, null),
  flipX: _createVNode(SwapOutlined, null, null),
  flipY: _createVNode(SwapOutlined, {
    "rotate": 90
  }, null)
};
const previewGroupProps = () => ({
  previewPrefixCls: String,
  preview: anyType()
});
const InternalPreviewGroup = defineComponent({
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
    } = useConfigInject('image', props);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const mergedPreview = computed(() => {
      const {
        preview
      } = props;
      if (preview === false) {
        return preview;
      }
      const _preview = typeof preview === 'object' ? preview : {};
      return _extends(_extends({}, _preview), {
        rootClassName: hashId.value,
        transitionName: getTransitionName(rootPrefixCls.value, 'zoom', _preview.transitionName),
        maskTransitionName: getTransitionName(rootPrefixCls.value, 'fade', _preview.maskTransitionName)
      });
    });
    return () => {
      return wrapSSR(_createVNode(PreviewGroup, _objectSpread(_objectSpread({}, _extends(_extends({}, attrs), props)), {}, {
        "preview": mergedPreview.value,
        "icons": icons,
        "previewPrefixCls": previewPrefixCls.value
      }), slots));
    };
  }
});
export default InternalPreviewGroup;