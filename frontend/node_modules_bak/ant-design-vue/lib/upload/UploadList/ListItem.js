"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listItemProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _EyeOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EyeOutlined"));
var _DeleteOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DeleteOutlined"));
var _DownloadOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DownloadOutlined"));
var _tooltip = _interopRequireDefault(require("../../tooltip"));
var _progress = _interopRequireDefault(require("../../progress"));
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _transition = require("../../_util/transition");
var _type = require("../../_util/type");
const listItemProps = () => {
  return {
    prefixCls: String,
    locale: (0, _type.objectType)(undefined),
    file: (0, _type.objectType)(),
    items: (0, _type.arrayType)(),
    listType: (0, _type.stringType)(),
    isImgUrl: (0, _type.functionType)(),
    showRemoveIcon: (0, _type.booleanType)(),
    showDownloadIcon: (0, _type.booleanType)(),
    showPreviewIcon: (0, _type.booleanType)(),
    removeIcon: (0, _type.functionType)(),
    downloadIcon: (0, _type.functionType)(),
    previewIcon: (0, _type.functionType)(),
    iconRender: (0, _type.functionType)(),
    actionIconRender: (0, _type.functionType)(),
    itemRender: (0, _type.functionType)(),
    onPreview: (0, _type.functionType)(),
    onClose: (0, _type.functionType)(),
    onDownload: (0, _type.functionType)(),
    progress: (0, _type.objectType)()
  };
};
exports.listItemProps = listItemProps;
var _default = exports.default = (0, _vue.defineComponent)({
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
    const showProgress = (0, _vue.shallowRef)(false);
    const progressRafRef = (0, _vue.shallowRef)();
    (0, _vue.onMounted)(() => {
      progressRafRef.value = setTimeout(() => {
        showProgress.value = true;
      }, 300);
    });
    (0, _vue.onBeforeUnmount)(() => {
      clearTimeout(progressRafRef.value);
    });
    const mergedStatus = (0, _vue.shallowRef)((_a = props.file) === null || _a === void 0 ? void 0 : _a.status);
    (0, _vue.watch)(() => {
      var _a;
      return (_a = props.file) === null || _a === void 0 ? void 0 : _a.status;
    }, status => {
      if (status !== 'removed') {
        mergedStatus.value = status;
      }
    });
    const {
      rootPrefixCls
    } = (0, _useConfigInject.default)('upload', props);
    const transitionProps = (0, _vue.computed)(() => (0, _transition.getTransitionProps)(`${rootPrefixCls.value}-fade`));
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
      let icon = (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-text-icon`
      }, [iconNode]);
      if (listType === 'picture' || listType === 'picture-card') {
        if (mergedStatus.value === 'uploading' || !file.thumbUrl && !file.url) {
          const uploadingClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: mergedStatus.value !== 'uploading'
          };
          icon = (0, _vue.createVNode)("div", {
            "class": uploadingClassName
          }, [iconNode]);
        } else {
          const thumbnail = (isImgUrl === null || isImgUrl === void 0 ? void 0 : isImgUrl(file)) ? (0, _vue.createVNode)("img", {
            "src": file.thumbUrl || file.url,
            "alt": file.name,
            "class": `${prefixCls}-list-item-image`,
            "crossorigin": file.crossOrigin
          }, null) : iconNode;
          const aClassName = {
            [`${prefixCls}-list-item-thumbnail`]: true,
            [`${prefixCls}-list-item-file`]: isImgUrl && !isImgUrl(file)
          };
          icon = (0, _vue.createVNode)("a", {
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
        }) : (0, _vue.createVNode)(_DeleteOutlined.default, null, null),
        callback: () => onClose(file),
        prefixCls,
        title: locale.removeFile
      }) : null;
      const downloadIcon = showDownloadIcon && mergedStatus.value === 'done' ? actionIconRender({
        customIcon: customDownloadIcon ? customDownloadIcon({
          file
        }) : (0, _vue.createVNode)(_DownloadOutlined.default, null, null),
        callback: () => onDownload(file),
        prefixCls,
        title: locale.downloadFile
      }) : null;
      const downloadOrDelete = listType !== 'picture-card' && (0, _vue.createVNode)("span", {
        "key": "download-delete",
        "class": [`${prefixCls}-list-item-actions`, {
          picture: listType === 'picture'
        }]
      }, [downloadIcon, removeIcon]);
      const listItemNameClass = `${prefixCls}-list-item-name`;
      const fileName = file.url ? [(0, _vue.createVNode)("a", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "key": "view",
        "target": "_blank",
        "rel": "noopener noreferrer",
        "class": listItemNameClass,
        "title": file.name
      }, linkProps), {}, {
        "href": file.url,
        "onClick": e => onPreview(file, e)
      }), [file.name]), downloadOrDelete] : [(0, _vue.createVNode)("span", {
        "key": "view",
        "class": listItemNameClass,
        "onClick": e => onPreview(file, e),
        "title": file.name
      }, [file.name]), downloadOrDelete];
      const previewStyle = {
        pointerEvents: 'none',
        opacity: 0.5
      };
      const previewIcon = showPreviewIcon ? (0, _vue.createVNode)("a", {
        "href": file.url || file.thumbUrl,
        "target": "_blank",
        "rel": "noopener noreferrer",
        "style": file.url || file.thumbUrl ? undefined : previewStyle,
        "onClick": e => onPreview(file, e),
        "title": locale.previewFile
      }, [customPreviewIcon ? customPreviewIcon({
        file
      }) : (0, _vue.createVNode)(_EyeOutlined.default, null, null)]) : null;
      const pictureCardActions = listType === 'picture-card' && mergedStatus.value !== 'uploading' && (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-list-item-actions`
      }, [previewIcon, mergedStatus.value === 'done' && downloadIcon, removeIcon]);
      const dom = (0, _vue.createVNode)("div", {
        "class": infoUploadingClass
      }, [icon, fileName, pictureCardActions, showProgress.value && (0, _vue.createVNode)(_vue.Transition, transitionProps.value, {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", {
          "class": `${prefixCls}-list-item-progress`
        }, ['percent' in file ? (0, _vue.createVNode)(_progress.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, progressProps), {}, {
          "type": "line",
          "percent": file.percent
        }), null) : null]), [[_vue.vShow, mergedStatus.value === 'uploading']])]
      })]);
      const listContainerNameClass = {
        [`${prefixCls}-list-item-container`]: true,
        [`${className}`]: !!className
      };
      const message = file.response && typeof file.response === 'string' ? file.response : ((_a = file.error) === null || _a === void 0 ? void 0 : _a.statusText) || ((_b = file.error) === null || _b === void 0 ? void 0 : _b.message) || locale.uploadError;
      const item = mergedStatus.value === 'error' ? (0, _vue.createVNode)(_tooltip.default, {
        "title": message,
        "getPopupContainer": node => node.parentNode
      }, {
        default: () => [dom]
      }) : dom;
      return (0, _vue.createVNode)("div", {
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