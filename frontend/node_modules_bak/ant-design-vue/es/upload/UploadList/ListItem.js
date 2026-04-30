import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode } from "vue";
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, watch, Transition } from 'vue';
import EyeOutlined from "@ant-design/icons-vue/es/icons/EyeOutlined";
import DeleteOutlined from "@ant-design/icons-vue/es/icons/DeleteOutlined";
import DownloadOutlined from "@ant-design/icons-vue/es/icons/DownloadOutlined";
import Tooltip from '../../tooltip';
import Progress from '../../progress';
import useConfigInject from '../../config-provider/hooks/useConfigInject';
import { getTransitionProps } from '../../_util/transition';
import { booleanType, stringType, functionType, arrayType, objectType } from '../../_util/type';
export const listItemProps = () => {
  return {
    prefixCls: String,
    locale: objectType(undefined),
    file: objectType(),
    items: arrayType(),
    listType: stringType(),
    isImgUrl: functionType(),
    showRemoveIcon: booleanType(),
    showDownloadIcon: booleanType(),
    showPreviewIcon: booleanType(),
    removeIcon: functionType(),
    downloadIcon: functionType(),
    previewIcon: functionType(),
    iconRender: functionType(),
    actionIconRender: functionType(),
    itemRender: functionType(),
    onPreview: functionType(),
    onClose: functionType(),
    onDownload: functionType(),
    progress: objectType()
  };
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ListItem',
  inheritAttrs: false,
  props: listItemProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    var _a;
    const showProgress = shallowRef(false);
    const progressRafRef = shallowRef();
    onMounted(() => {
      progressRafRef.value = setTimeout(() => {
        showProgress.value = true;
      }, 300);
    });
    onBeforeUnmount(() => {
      clearTimeout(progressRafRef.value);
    });
    const mergedStatus = shallowRef((_a = props.file) === null || _a === void 0 ? void 0 : _a.status);
    watch(() => {
      var _a;
      return (_a = props.file) === null || _a === void 0 ? void 0 : _a.status;
    }, status => {
      if (status !== 'removed') {
        mergedStatus.value = status;
      }
    });
    const {
      rootPrefixCls
    } = useConfigInject('upload', props);
    const transitionProps = computed(() => getTransitionProps(`${rootPrefixCls.value}-fade`));
    return () => {
      var _a, _b;
      const {
        prefixCls,
        locale,
        listType,
        file,
        items,
        progress: progressProps,
        iconRender = slots.iconRender,
        actionIconRender = slots.actionIconRender,
        itemRender = slots.itemRender,
        isImgUrl,
        showPreviewIcon,
        showRemoveIcon,
        showDownloadIcon,
        previewIcon: customPreviewIcon = slots.previewIcon,
        removeIcon: customRemoveIcon = slots.removeIcon,
        downloadIcon: customDownloadIcon = slots.downloadIcon,
        onPreview,
        onDownload,
        onClose
      } = props;
      const {
        class: className,
        style
      } = attrs;
      // This is used for legacy span make scrollHeight the wrong value.
      // We will force these to be `display: block` with non `picture-card`
      const iconNode = iconRender({
        file
      });
      let icon = _createVNode("div", {
        "class": `${prefixCls}-text-icon`
      }, [iconNode]);
      if (listType === 'picture' || listType === 'picture-card') {
        if (mergedStatus.value === 'uploading' || !file.thumbUrl && !file.url) {
          const uploadingClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: mergedStatus.value !== 'uploading'
          };
          icon = _createVNode("div", {
            "class": uploadingClassName
          }, [iconNode]);
        } else {
          const thumbnail = (isImgUrl === null || isImgUrl === void 0 ? void 0 : isImgUrl(file)) ? _createVNode("img", {
            "src": file.thumbUrl || file.url,
            "alt": file.name,
            "class": `${prefixCls}-list-item-image`,
            "crossorigin": file.crossOrigin
          }, null) : iconNode;
          const aClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: isImgUrl && !isImgUrl(file)
          };
          icon = _createVNode("a", {
            "class": aClassName,
            "onClick": e => onPreview(file, e),
            "href": file.url || file.thumbUrl,
            "target": "_blank",
            "rel": "noopener noreferrer"
          }, [thumbnail]);
        }
      }
      const infoUploadingClass = {
        [`${prefixCls}-list-item`]: true,
        [`${prefixCls}-list-item-${mergedStatus.value}`]: true
      };
      const linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
      const removeIcon = showRemoveIcon ? actionIconRender({
        customIcon: customRemoveIcon ? customRemoveIcon({
          file
        }) : _createVNode(DeleteOutlined, null, null),
        callback: () => onClose(file),
        prefixCls,
        title: locale.removeFile
      }) : null;
      const downloadIcon = showDownloadIcon && mergedStatus.value === 'done' ? actionIconRender({
        customIcon: customDownloadIcon ? customDownloadIcon({
          file
        }) : _createVNode(DownloadOutlined, null, null),
        callback: () => onDownload(file),
        prefixCls,
        title: locale.downloadFile
      }) : null;
      const downloadOrDelete = listType !== 'picture-card' && _createVNode("span", {
        "key": "download-delete",
        "class": [`${prefixCls}-list-item-actions`, {
          picture: listType === 'picture'
        }]
      }, [downloadIcon, removeIcon]);
      const listItemNameClass = `${prefixCls}-list-item-name`;
      const fileName = file.url ? [_createVNode("a", _objectSpread(_objectSpread({
        "key": "view",
        "target": "_blank",
        "rel": "noopener noreferrer",
        "class": listItemNameClass,
        "title": file.name
      }, linkProps), {}, {
        "href": file.url,
        "onClick": e => onPreview(file, e)
      }), [file.name]), downloadOrDelete] : [_createVNode("span", {
        "key": "view",
        "class": listItemNameClass,
        "onClick": e => onPreview(file, e),
        "title": file.name
      }, [file.name]), downloadOrDelete];
      const previewStyle = {
        pointerEvents: 'none',
        opacity: 0.5
      };
      const previewIcon = showPreviewIcon ? _createVNode("a", {
        "href": file.url || file.thumbUrl,
        "target": "_blank",
        "rel": "noopener noreferrer",
        "style": file.url || file.thumbUrl ? undefined : previewStyle,
        "onClick": e => onPreview(file, e),
        "title": locale.previewFile
      }, [customPreviewIcon ? customPreviewIcon({
        file
      }) : _createVNode(EyeOutlined, null, null)]) : null;
      const pictureCardActions = listType === 'picture-card' && mergedStatus.value !== 'uploading' && _createVNode("span", {
        "class": `${prefixCls}-list-item-actions`
      }, [previewIcon, mergedStatus.value === 'done' && downloadIcon, removeIcon]);
      const dom = _createVNode("div", {
        "class": infoUploadingClass
      }, [icon, fileName, pictureCardActions, showProgress.value && _createVNode(Transition, transitionProps.value, {
        default: () => [_withDirectives(_createVNode("div", {
          "class": `${prefixCls}-list-item-progress`
        }, ['percent' in file ? _createVNode(Progress, _objectSpread(_objectSpread({}, progressProps), {}, {
          "type": "line",
          "percent": file.percent
        }), null) : null]), [[_vShow, mergedStatus.value === 'uploading']])]
      })]);
      const listContainerNameClass = {
        [`${prefixCls}-list-item-container`]: true,
        [`${className}`]: !!className
      };
      const message = file.response && typeof file.response === 'string' ? file.response : ((_a = file.error) === null || _a === void 0 ? void 0 : _a.statusText) || ((_b = file.error) === null || _b === void 0 ? void 0 : _b.message) || locale.uploadError;
      const item = mergedStatus.value === 'error' ? _createVNode(Tooltip, {
        "title": message,
        "getPopupContainer": node => node.parentNode
      }, {
        default: () => [dom]
      }) : dom;
      return _createVNode("div", {
        "class": listContainerNameClass,
        "style": style
      }, [itemRender ? itemRender({
        originNode: item,
        file,
        fileList: items,
        actions: {
          download: onDownload.bind(null, file),
          preview: onPreview.bind(null, file),
          remove: onClose.bind(null, file)
        }
      }) : item]);
    };
  }
});