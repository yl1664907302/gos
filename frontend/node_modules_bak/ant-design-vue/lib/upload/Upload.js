"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.LIST_IGNORE = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcUpload = _interopRequireDefault(require("../vc-upload"));
var _UploadList = _interopRequireDefault(require("./UploadList"));
var _interface = require("./interface");
var _utils = require("./utils");
var _LocaleReceiver = require("../locale-provider/LocaleReceiver");
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _propsUtil = require("../_util/props-util");
var _useMergedState = _interopRequireDefault(require("../_util/hooks/useMergedState"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _form = require("../form");
var _style = _interopRequireDefault(require("./style"));
var _DisabledContext = require("../config-provider/DisabledContext");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

// CSSINJS

const LIST_IGNORE = exports.LIST_IGNORE = `__LIST_IGNORE_${Date.now()}__`;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AUpload',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _interface.uploadProps)(), {
    type: 'select',
    multiple: false,
    action: '',
    data: {},
    accept: '',
    showUploadList: true,
    listType: 'text',
    supportServerRender: true
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const formItemContext = (0, _form.useInjectFormItemContext)();
    const {
      prefixCls,
      direction,
      disabled
    } = (0, _useConfigInject.default)('upload', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const disabledContext = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = disabled.value) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    const [mergedFileList, setMergedFileList] = (0, _useMergedState.default)(props.defaultFileList || [], {
      value: (0, _vue.toRef)(props, 'fileList'),
      postState: list => {
        const timestamp = Date.now();
        return (list !== null && list !== void 0 ? list : []).map((file, index) => {
          if (!file.uid && !Object.isFrozen(file)) {
            file.uid = `__AUTO__${timestamp}_${index}__`;
          }
          return file;
        });
      }
    });
    const dragState = (0, _vue.ref)('drop');
    const upload = (0, _vue.ref)(null);
    (0, _vue.onMounted)(() => {
      (0, _devWarning.default)(props.fileList !== undefined || attrs.value === undefined, 'Upload', '`value` is not a valid prop, do you mean `fileList`?');
      (0, _devWarning.default)(props.transformFile === undefined, 'Upload', '`transformFile` is deprecated. Please use `beforeUpload` directly.');
      (0, _devWarning.default)(props.remove === undefined, 'Upload', '`remove` props is deprecated. Please use `remove` event.');
    });
    const onInternalChange = (file, changedFileList, event) => {
      var _a, _b;
      let cloneList = [...changedFileList];
      // Cut to match count
      if (props.maxCount === 1) {
        cloneList = cloneList.slice(-1);
      } else if (props.maxCount) {
        cloneList = cloneList.slice(0, props.maxCount);
      }
      setMergedFileList(cloneList);
      const changeInfo = {
        file: file,
        fileList: cloneList
      };
      if (event) {
        changeInfo.event = event;
      }
      (_a = props['onUpdate:fileList']) === null || _a === void 0 ? void 0 : _a.call(props, changeInfo.fileList);
      (_b = props.onChange) === null || _b === void 0 ? void 0 : _b.call(props, changeInfo);
      formItemContext.onFieldChange();
    };
    const mergedBeforeUpload = (file, fileListArgs) => __awaiter(this, void 0, void 0, function* () {
      const {
        beforeUpload,
        transformFile
      } = props;
      let parsedFile = file;
      if (beforeUpload) {
        const result = yield beforeUpload(file, fileListArgs);
        if (result === false) {
          return false;
        }
        // Hack for LIST_IGNORE, we add additional info to remove from the list
        delete file[LIST_IGNORE];
        if (result === LIST_IGNORE) {
          Object.defineProperty(file, LIST_IGNORE, {
            value: true,
            configurable: true
          });
          return false;
        }
        if (typeof result === 'object' && result) {
          parsedFile = result;
        }
      }
      if (transformFile) {
        parsedFile = yield transformFile(parsedFile);
      }
      return parsedFile;
    });
    const onBatchStart = batchFileInfoList => {
      // Skip file which marked as `LIST_IGNORE`, these file will not add to file list
      const filteredFileInfoList = batchFileInfoList.filter(info => !info.file[LIST_IGNORE]);
      // Nothing to do since no file need upload
      if (!filteredFileInfoList.length) {
        return;
      }
      const objectFileList = filteredFileInfoList.map(info => (0, _utils.file2Obj)(info.file));
      // Concat new files with prev files
      let newFileList = [...mergedFileList.value];
      objectFileList.forEach(fileObj => {
        // Replace file if exist
        newFileList = (0, _utils.updateFileList)(fileObj, newFileList);
      });
      objectFileList.forEach((fileObj, index) => {
        // Repeat trigger `onChange` event for compatible
        let triggerFileObj = fileObj;
        if (!filteredFileInfoList[index].parsedFile) {
          // `beforeUpload` return false
          const {
            originFileObj
          } = fileObj;
          let clone;
          try {
            clone = new File([originFileObj], originFileObj.name, {
              type: originFileObj.type
            });
          } catch (e) {
            clone = new Blob([originFileObj], {
              type: originFileObj.type
            });
            clone.name = originFileObj.name;
            clone.lastModifiedDate = new Date();
            clone.lastModified = new Date().getTime();
          }
          clone.uid = fileObj.uid;
          triggerFileObj = clone;
        } else {
          // Inject `uploading` status
          fileObj.status = 'uploading';
        }
        onInternalChange(triggerFileObj, newFileList);
      });
    };
    const onSuccess = (response, file, xhr) => {
      try {
        if (typeof response === 'string') {
          response = JSON.parse(response);
        }
      } catch (e) {
        /* do nothing */
      }
      // removed
      if (!(0, _utils.getFileItem)(file, mergedFileList.value)) {
        return;
      }
      const targetItem = (0, _utils.file2Obj)(file);
      targetItem.status = 'done';
      targetItem.percent = 100;
      targetItem.response = response;
      targetItem.xhr = xhr;
      const nextFileList = (0, _utils.updateFileList)(targetItem, mergedFileList.value);
      onInternalChange(targetItem, nextFileList);
    };
    const onProgress = (e, file) => {
      // removed
      if (!(0, _utils.getFileItem)(file, mergedFileList.value)) {
        return;
      }
      const targetItem = (0, _utils.file2Obj)(file);
      targetItem.status = 'uploading';
      targetItem.percent = e.percent;
      const nextFileList = (0, _utils.updateFileList)(targetItem, mergedFileList.value);
      onInternalChange(targetItem, nextFileList, e);
    };
    const onError = (error, response, file) => {
      // removed
      if (!(0, _utils.getFileItem)(file, mergedFileList.value)) {
        return;
      }
      const targetItem = (0, _utils.file2Obj)(file);
      targetItem.error = error;
      targetItem.response = response;
      targetItem.status = 'error';
      const nextFileList = (0, _utils.updateFileList)(targetItem, mergedFileList.value);
      onInternalChange(targetItem, nextFileList);
    };
    const handleRemove = file => {
      let currentFile;
      const mergedRemove = props.onRemove || props.remove;
      Promise.resolve(typeof mergedRemove === 'function' ? mergedRemove(file) : mergedRemove).then(ret => {
        var _a, _b;
        // Prevent removing file
        if (ret === false) {
          return;
        }
        const removedFileList = (0, _utils.removeFileItem)(file, mergedFileList.value);
        if (removedFileList) {
          currentFile = (0, _extends2.default)((0, _extends2.default)({}, file), {
            status: 'removed'
          });
          (_a = mergedFileList.value) === null || _a === void 0 ? void 0 : _a.forEach(item => {
            const matchKey = currentFile.uid !== undefined ? 'uid' : 'name';
            if (item[matchKey] === currentFile[matchKey] && !Object.isFrozen(item)) {
              item.status = 'removed';
            }
          });
          (_b = upload.value) === null || _b === void 0 ? void 0 : _b.abort(currentFile);
          onInternalChange(currentFile, removedFileList);
        }
      });
    };
    const onFileDrop = e => {
      var _a;
      dragState.value = e.type;
      if (e.type === 'drop') {
        (_a = props.onDrop) === null || _a === void 0 ? void 0 : _a.call(props, e);
      }
    };
    expose({
      onBatchStart,
      onSuccess,
      onProgress,
      onError,
      fileList: mergedFileList,
      upload
    });
    const [locale] = (0, _LocaleReceiver.useLocaleReceiver)('Upload', _en_US.default.Upload, (0, _vue.computed)(() => props.locale));
    const renderUploadList = (button, buttonVisible) => {
      const {
        removeIcon,
        previewIcon,
        downloadIcon,
        previewFile,
        onPreview,
        onDownload,
        isImageUrl,
        progress,
        itemRender,
        iconRender,
        showUploadList
      } = props;
      const {
        showDownloadIcon,
        showPreviewIcon,
        showRemoveIcon
      } = typeof showUploadList === 'boolean' ? {} : showUploadList;
      return showUploadList ? (0, _vue.createVNode)(_UploadList.default, {
        "prefixCls": prefixCls.value,
        "listType": props.listType,
        "items": mergedFileList.value,
        "previewFile": previewFile,
        "onPreview": onPreview,
        "onDownload": onDownload,
        "onRemove": handleRemove,
        "showRemoveIcon": !mergedDisabled.value && showRemoveIcon,
        "showPreviewIcon": showPreviewIcon,
        "showDownloadIcon": showDownloadIcon,
        "removeIcon": removeIcon,
        "previewIcon": previewIcon,
        "downloadIcon": downloadIcon,
        "iconRender": iconRender,
        "locale": locale.value,
        "isImageUrl": isImageUrl,
        "progress": progress,
        "itemRender": itemRender,
        "appendActionVisible": buttonVisible,
        "appendAction": button
      }, (0, _extends2.default)({}, slots)) : button === null || button === void 0 ? void 0 : button();
    };
    return () => {
      var _a, _b, _c;
      const {
        listType,
        type
      } = props;
      const {
          class: className,
          style: styleName
        } = attrs,
        transAttrs = __rest(attrs, ["class", "style"]);
      const rcUploadProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({
        onBatchStart,
        onError,
        onProgress,
        onSuccess
      }, transAttrs), props), {
        id: (_a = props.id) !== null && _a !== void 0 ? _a : formItemContext.id.value,
        prefixCls: prefixCls.value,
        beforeUpload: mergedBeforeUpload,
        onChange: undefined,
        disabled: mergedDisabled.value
      });
      delete rcUploadProps.remove;
      // Remove id to avoid open by label when trigger is hidden
      // !children: https://github.com/ant-design/ant-design/issues/14298
      // disabled: https://github.com/ant-design/ant-design/issues/16478
      //           https://github.com/ant-design/ant-design/issues/24197
      if (!slots.default || mergedDisabled.value) {
        delete rcUploadProps.id;
      }
      const rtlCls = {
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      };
      if (type === 'drag') {
        const dragCls = (0, _classNames.default)(prefixCls.value, {
          [`${prefixCls.value}-drag`]: true,
          [`${prefixCls.value}-drag-uploading`]: mergedFileList.value.some(file => file.status === 'uploading'),
          [`${prefixCls.value}-drag-hover`]: dragState.value === 'dragover',
          [`${prefixCls.value}-disabled`]: mergedDisabled.value,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value);
        return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": (0, _classNames.default)(`${prefixCls.value}-wrapper`, rtlCls, className, hashId.value)
        }), [(0, _vue.createVNode)("div", {
          "class": dragCls,
          "onDrop": onFileDrop,
          "onDragover": onFileDrop,
          "onDragleave": onFileDrop,
          "style": attrs.style
        }, [(0, _vue.createVNode)(_vcUpload.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, rcUploadProps), {}, {
          "ref": upload,
          "class": `${prefixCls.value}-btn`
        }), (0, _objectSpread2.default)({
          default: () => [(0, _vue.createVNode)("div", {
            "class": `${prefixCls.value}-drag-container`
          }, [(_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots)])]
        }, slots))]), renderUploadList()]));
      }
      const uploadButtonCls = (0, _classNames.default)(prefixCls.value, {
        [`${prefixCls.value}-select`]: true,
        [`${prefixCls.value}-select-${listType}`]: true,
        [`${prefixCls.value}-disabled`]: mergedDisabled.value,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      });
      const children = (0, _propsUtil.flattenChildren)((_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots));
      const renderUploadButton = uploadButtonStyle => (0, _vue.createVNode)("div", {
        "class": uploadButtonCls,
        "style": uploadButtonStyle
      }, [(0, _vue.createVNode)(_vcUpload.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, rcUploadProps), {}, {
        "ref": upload
      }), slots)]);
      if (listType === 'picture-card') {
        return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": (0, _classNames.default)(`${prefixCls.value}-wrapper`, `${prefixCls.value}-picture-card-wrapper`, rtlCls, attrs.class, hashId.value)
        }), [renderUploadList(renderUploadButton, !!(children && children.length))]));
      }
      return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": (0, _classNames.default)(`${prefixCls.value}-wrapper`, rtlCls, attrs.class, hashId.value)
      }), [renderUploadButton(children && children.length ? undefined : {
        display: 'none'
      }), renderUploadList()]));
    };
  }
});