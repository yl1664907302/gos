import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, vShow as _vShow, resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import PaperClipOutlined from "@ant-design/icons-vue/es/icons/PaperClipOutlined";
import PictureTwoTone from "@ant-design/icons-vue/es/icons/PictureTwoTone";
import FileTwoTone from "@ant-design/icons-vue/es/icons/FileTwoTone";
import { uploadListProps } from '../interface';
import { previewImage, isImageUrl } from '../utils';
import Button from '../../button';
import ListItem from './ListItem';
import { triggerRef, watch, computed, defineComponent, onMounted, shallowRef, watchEffect, TransitionGroup } from 'vue';
import { filterEmpty, initDefaultProps, isValidElement } from '../../_util/props-util';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getTransitionGroupProps } from '../../_util/transition';
import collapseMotion from '../../_util/collapseMotion';
const HackSlot = (_, _ref) => {
  let {
    slots
  } = _ref;
  var _a;
  return filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))[0];
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AUploadList',
  props: initDefaultProps(uploadListProps(), {
    listType: 'text',
    progress: {
      strokeWidth: 2,
      showInfo: false
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: previewImage,
    isImageUrl,
    items: [],
    appendActionVisible: true
  }),
  setup(props, _ref2) {
    let {
      slots,
      expose
    } = _ref2;
    const motionAppear = shallowRef(false);
    onMounted(() => {
      motionAppear.value == true;
    });
    const mergedItems = shallowRef([]);
    watch(() => props.items, function () {
      let val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      mergedItems.value = val.slice();
    }, {
      immediate: true,
      deep: true
    });
    watchEffect(() => {
      if (props.listType !== 'picture' && props.listType !== 'picture-card') {
        return;
      }
      let hasUpdate = false;
      (props.items || []).forEach((file, index) => {
        if (typeof document === 'undefined' || typeof window === 'undefined' || !window.FileReader || !window.File || !(file.originFileObj instanceof File || file.originFileObj instanceof Blob) || file.thumbUrl !== undefined) {
          return;
        }
        file.thumbUrl = '';
        if (props.previewFile) {
          props.previewFile(file.originFileObj).then(previewDataUrl => {
            // Need append '' to avoid dead loop
            const thumbUrl = previewDataUrl || '';
            if (thumbUrl !== file.thumbUrl) {
              mergedItems.value[index].thumbUrl = thumbUrl;
              hasUpdate = true;
            }
          });
        }
      });
      if (hasUpdate) {
        triggerRef(mergedItems);
      }
    });
    // ============================= Events =============================
    const onInternalPreview = (file, e) => {
      if (!props.onPreview) {
        return;
      }
      e === null || e === void 0 ? void 0 : e.preventDefault();
      return props.onPreview(file);
    };
    const onInternalDownload = file => {
      if (typeof props.onDownload === 'function') {
        props.onDownload(file);
      } else if (file.url) {
        window.open(file.url);
      }
    };
    const onInternalClose = file => {
      var _a;
      (_a = props.onRemove) === null || _a === void 0 ? void 0 : _a.call(props, file);
    };
    const internalIconRender = _ref3 => {
      let {
        file
      } = _ref3;
      const iconRender = props.iconRender || slots.iconRender;
      if (iconRender) {
        return iconRender({
          file,
          listType: props.listType
        });
      }
      const isLoading = file.status === 'uploading';
      const fileIcon = props.isImageUrl && props.isImageUrl(file) ? _createVNode(PictureTwoTone, null, null) : _createVNode(FileTwoTone, null, null);
      let icon = isLoading ? _createVNode(LoadingOutlined, null, null) : _createVNode(PaperClipOutlined, null, null);
      if (props.listType === 'picture') {
        icon = isLoading ? _createVNode(LoadingOutlined, null, null) : fileIcon;
      } else if (props.listType === 'picture-card') {
        icon = isLoading ? props.locale.uploading : fileIcon;
      }
      return icon;
    };
    const actionIconRender = opt => {
      const {
        customIcon,
        callback,
        prefixCls,
        title
      } = opt;
      const btnProps = {
        type: 'text',
        size: 'small',
        title,
        onClick: () => {
          callback();
        },
        class: `${prefixCls}-list-item-action`
      };
      if (isValidElement(customIcon)) {
        return _createVNode(Button, btnProps, {
          icon: () => customIcon
        });
      }
      return _createVNode(Button, btnProps, {
        default: () => [_createVNode("span", null, [customIcon])]
      });
    };
    expose({
      handlePreview: onInternalPreview,
      handleDownload: onInternalDownload
    });
    const {
      prefixCls,
      rootPrefixCls
    } = useConfigInject('upload', props);
    const listClassNames = computed(() => ({
      [`${prefixCls.value}-list`]: true,
      [`${prefixCls.value}-list-${props.listType}`]: true
    }));
    const transitionGroupProps = computed(() => {
      const motion = _extends({}, collapseMotion(`${rootPrefixCls.value}-motion-collapse`));
      delete motion.onAfterAppear;
      delete motion.onAfterEnter;
      delete motion.onAfterLeave;
      const motionConfig = _extends(_extends({}, getTransitionGroupProps(`${prefixCls.value}-${props.listType === 'picture-card' ? 'animate-inline' : 'animate'}`)), {
        class: listClassNames.value,
        appear: motionAppear.value
      });
      return props.listType !== 'picture-card' ? _extends(_extends({}, motion), motionConfig) : motionConfig;
    });
    return () => {
      const {
        listType,
        locale,
        isImageUrl: isImgUrl,
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        removeIcon,
        previewIcon,
        downloadIcon,
        progress,
        appendAction,
        itemRender,
        appendActionVisible
      } = props;
      const appendActionDom = appendAction === null || appendAction === void 0 ? void 0 : appendAction();
      const items = mergedItems.value;
      return _createVNode(TransitionGroup, _objectSpread(_objectSpread({}, transitionGroupProps.value), {}, {
        "tag": "div"
      }), {
        default: () => [items.map(file => {
          const {
            uid: key
          } = file;
          return _createVNode(ListItem, {
            "key": key,
            "locale": locale,
            "prefixCls": prefixCls.value,
            "file": file,
            "items": items,
            "progress": progress,
            "listType": listType,
            "isImgUrl": isImgUrl,
            "showPreviewIcon": showPreviewIcon,
            "showRemoveIcon": showRemoveIcon,
            "showDownloadIcon": showDownloadIcon,
            "onPreview": onInternalPreview,
            "onDownload": onInternalDownload,
            "onClose": onInternalClose,
            "removeIcon": removeIcon,
            "previewIcon": previewIcon,
            "downloadIcon": downloadIcon,
            "itemRender": itemRender
          }, _extends(_extends({}, slots), {
            iconRender: internalIconRender,
            actionIconRender
          }));
        }), appendAction ? _withDirectives(_createVNode(HackSlot, {
          "key": "__ant_upload_appendAction"
        }, {
          default: () => appendActionDom
        }), [[_vShow, !!appendActionVisible]]) : null]
      });
    };
  }
});