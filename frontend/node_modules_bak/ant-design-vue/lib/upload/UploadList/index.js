"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _PaperClipOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/PaperClipOutlined"));
var _PictureTwoTone = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/PictureTwoTone"));
var _FileTwoTone = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FileTwoTone"));
var _interface = require("../interface");
var _utils = require("../utils");
var _button = _interopRequireDefault(require("../../button"));
var _ListItem = _interopRequireDefault(require("./ListItem"));
var _propsUtil = require("../../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../../config-provider/hooks/useConfigInject"));
var _transition = require("../../_util/transition");
var _collapseMotion = _interopRequireDefault(require("../../_util/collapseMotion"));
const HackSlot = (_, _ref) => {
  let {
    slots
  } = _ref;
  var _a;
  return (0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))[0];
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AUploadList',
  props: (0, _propsUtil.initDefaultProps)((0, _interface.uploadListProps)(), {
    listType: 'text',
    progress: {
      strokeWidth: 2,
      showInfo: false
    },
    showRemoveIcon: true,
    showDownloadIcon: false,
    showPreviewIcon: true,
    previewFile: _utils.previewImage,
    isImageUrl: _utils.isImageUrl,
    items: [],
    appendActionVisible: true
  }),
  setup(props, _ref2) {
    let {
      slots,
      expose
    } = _ref2;
    const motionAppear = (0, _vue.shallowRef)(false);
    (0, _vue.onMounted)(() => {
      motionAppear.value == true;
    });
    const mergedItems = (0, _vue.shallowRef)([]);
    (0, _vue.watch)(() => props.items, function () {
      let val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      mergedItems.value = val.slice();
    }, {
      immediate: true,
      deep: true
    });
    (0, _vue.watchEffect)(() => {
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
        (0, _vue.triggerRef)(mergedItems);
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
      const fileIcon = props.isImageUrl && props.isImageUrl(file) ? (0, _vue.createVNode)(_PictureTwoTone.default, null, null) : (0, _vue.createVNode)(_FileTwoTone.default, null, null);
      let icon = isLoading ? (0, _vue.createVNode)(_LoadingOutlined.default, null, null) : (0, _vue.createVNode)(_PaperClipOutlined.default, null, null);
      if (props.listType === 'picture') {
        icon = isLoading ? (0, _vue.createVNode)(_LoadingOutlined.default, null, null) : fileIcon;
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
      if ((0, _propsUtil.isValidElement)(customIcon)) {
        return (0, _vue.createVNode)(_button.default, btnProps, {
          icon: () => customIcon
        });
      }
      return (0, _vue.createVNode)(_button.default, btnProps, {
        default: () => [(0, _vue.createVNode)("span", null, [customIcon])]
      });
    };
    expose({
      handlePreview: onInternalPreview,
      handleDownload: onInternalDownload
    });
    const {
      prefixCls,
      rootPrefixCls
    } = (0, _useConfigInject.default)('upload', props);
    const listClassNames = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-list`]: true,
      [`${prefixCls.value}-list-${props.listType}`]: true
    }));
    const transitionGroupProps = (0, _vue.computed)(() => {
      const motion = (0, _extends2.default)({}, (0, _collapseMotion.default)(`${rootPrefixCls.value}-motion-collapse`));
      delete motion.onAfterAppear;
      delete motion.onAfterEnter;
      delete motion.onAfterLeave;
      const motionConfig = (0, _extends2.default)((0, _extends2.default)({}, (0, _transition.getTransitionGroupProps)(`${prefixCls.value}-${props.listType === 'picture-card' ? 'animate-inline' : 'animate'}`)), {
        class: listClassNames.value,
        appear: motionAppear.value
      });
      return props.listType !== 'picture-card' ? (0, _extends2.default)((0, _extends2.default)({}, motion), motionConfig) : motionConfig;
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
      return (0, _vue.createVNode)(_vue.TransitionGroup, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, transitionGroupProps.value), {}, {
        "tag": "div"
      }), {
        default: () => [items.map(file => {
          const {
            uid: key
          } = file;
          return (0, _vue.createVNode)(_ListItem.default, {
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
          }, (0, _extends2.default)((0, _extends2.default)({}, slots), {
            iconRender: internalIconRender,
            actionIconRender
          }));
        }), appendAction ? (0, _vue.withDirectives)((0, _vue.createVNode)(HackSlot, {
          "key": "__ant_upload_appendAction"
        }, {
          default: () => appendActionDom
        }), [[_vue.vShow, !!appendActionVisible]]) : null]
      });
    };
  }
});