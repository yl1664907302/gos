"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _request = _interopRequireDefault(require("./request"));
var _uid = _interopRequireDefault(require("./uid"));
var _attrAccept = _interopRequireDefault(require("./attr-accept"));
var _traverseFileTree = _interopRequireDefault(require("./traverseFileTree"));
var _interface = require("./interface");
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _partition = _interopRequireDefault(require("lodash/partition"));
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
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AjaxUploader',
  inheritAttrs: false,
  props: (0, _interface.uploadProps)(),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const uid = (0, _vue.ref)((0, _uid.default)());
    const reqs = {};
    const fileInput = (0, _vue.ref)();
    let isMounted = false;
    /**
     * Process file before upload. When all the file is ready, we start upload.
     */
    const processFile = (file, fileList) => __awaiter(this, void 0, void 0, function* () {
      const {
        beforeUpload
      } = props;
      let transformedFile = file;
      if (beforeUpload) {
        try {
          transformedFile = yield beforeUpload(file, fileList);
        } catch (e) {
          // Rejection will also trade as false
          transformedFile = false;
        }
        if (transformedFile === false) {
          return {
            origin: file,
            parsedFile: null,
            action: null,
            data: null
          };
        }
      }
      // Get latest action
      const {
        action
      } = props;
      let mergedAction;
      if (typeof action === 'function') {
        mergedAction = yield action(file);
      } else {
        mergedAction = action;
      }
      // Get latest data
      const {
        data
      } = props;
      let mergedData;
      if (typeof data === 'function') {
        mergedData = yield data(file);
      } else {
        mergedData = data;
      }
      const parsedData =
      // string type is from legacy `transformFile`.
      // Not sure if this will work since no related test case works with it
      (typeof transformedFile === 'object' || typeof transformedFile === 'string') && transformedFile ? transformedFile : file;
      let parsedFile;
      if (parsedData instanceof File) {
        parsedFile = parsedData;
      } else {
        parsedFile = new File([parsedData], file.name, {
          type: file.type
        });
      }
      const mergedParsedFile = parsedFile;
      mergedParsedFile.uid = file.uid;
      return {
        origin: file,
        data: mergedData,
        parsedFile: mergedParsedFile,
        action: mergedAction
      };
    });
    const post = _ref2 => {
      let {
        data,
        origin,
        action,
        parsedFile
      } = _ref2;
      if (!isMounted) {
        return;
      }
      const {
        onStart,
        customRequest,
        name,
        headers,
        withCredentials,
        method
      } = props;
      const {
        uid
      } = origin;
      const request = customRequest || _request.default;
      const requestOption = {
        action,
        filename: name,
        data,
        file: parsedFile,
        headers,
        withCredentials,
        method: method || 'post',
        onProgress: e => {
          const {
            onProgress
          } = props;
          onProgress === null || onProgress === void 0 ? void 0 : onProgress(e, parsedFile);
        },
        onSuccess: (ret, xhr) => {
          const {
            onSuccess
          } = props;
          onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(ret, parsedFile, xhr);
          delete reqs[uid];
        },
        onError: (err, ret) => {
          const {
            onError
          } = props;
          onError === null || onError === void 0 ? void 0 : onError(err, ret, parsedFile);
          delete reqs[uid];
        }
      };
      onStart(origin);
      reqs[uid] = request(requestOption);
    };
    const reset = () => {
      uid.value = (0, _uid.default)();
    };
    const abort = file => {
      if (file) {
        const uid = file.uid ? file.uid : file;
        if (reqs[uid] && reqs[uid].abort) {
          reqs[uid].abort();
        }
        delete reqs[uid];
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid] && reqs[uid].abort) {
            reqs[uid].abort();
          }
          delete reqs[uid];
        });
      }
    };
    (0, _vue.onMounted)(() => {
      isMounted = true;
    });
    (0, _vue.onBeforeUnmount)(() => {
      isMounted = false;
      abort();
    });
    const uploadFiles = files => {
      const originFiles = [...files];
      const postFiles = originFiles.map(file => {
        // eslint-disable-next-line no-param-reassign
        file.uid = (0, _uid.default)();
        return processFile(file, originFiles);
      });
      // Batch upload files
      Promise.all(postFiles).then(fileList => {
        const {
          onBatchStart
        } = props;
        onBatchStart === null || onBatchStart === void 0 ? void 0 : onBatchStart(fileList.map(_ref3 => {
          let {
            origin,
            parsedFile
          } = _ref3;
          return {
            file: origin,
            parsedFile
          };
        }));
        fileList.filter(file => file.parsedFile !== null).forEach(file => {
          post(file);
        });
      });
    };
    const onChange = e => {
      const {
        accept,
        directory
      } = props;
      const {
        files
      } = e.target;
      const acceptedFiles = [...files].filter(file => !directory || (0, _attrAccept.default)(file, accept));
      uploadFiles(acceptedFiles);
      reset();
    };
    const onClick = e => {
      const el = fileInput.value;
      if (!el) {
        return;
      }
      const {
        onClick
      } = props;
      // TODO
      // if (children && (children as any).type === 'button') {
      //   const parent = el.parentNode as HTMLInputElement;
      //   parent.focus();
      //   parent.querySelector('button').blur();
      // }
      el.click();
      if (onClick) {
        onClick(e);
      }
    };
    const onKeyDown = e => {
      if (e.key === 'Enter') {
        onClick(e);
      }
    };
    const onFileDrop = e => {
      const {
        multiple
      } = props;
      e.preventDefault();
      if (e.type === 'dragover') {
        return;
      }
      if (props.directory) {
        (0, _traverseFileTree.default)(Array.prototype.slice.call(e.dataTransfer.items), uploadFiles, _file => (0, _attrAccept.default)(_file, props.accept));
      } else {
        const files = (0, _partition.default)(Array.prototype.slice.call(e.dataTransfer.files), file => (0, _attrAccept.default)(file, props.accept));
        let successFiles = files[0];
        const errorFiles = files[1];
        if (multiple === false) {
          successFiles = successFiles.slice(0, 1);
        }
        uploadFiles(successFiles);
        if (errorFiles.length && props.onReject) props.onReject(errorFiles);
      }
    };
    expose({
      abort
    });
    return () => {
      var _a;
      const {
          componentTag: Tag,
          prefixCls,
          disabled,
          id,
          multiple,
          accept,
          capture,
          directory,
          openFileDialogOnClick,
          onMouseenter,
          onMouseleave
        } = props,
        otherProps = __rest(props, ["componentTag", "prefixCls", "disabled", "id", "multiple", "accept", "capture", "directory", "openFileDialogOnClick", "onMouseenter", "onMouseleave"]);
      const cls = {
        [prefixCls]: true,
        [`${prefixCls}-disabled`]: disabled,
        [attrs.class]: !!attrs.class
      };
      // because input don't have directory/webkitdirectory type declaration
      const dirProps = directory ? {
        directory: 'directory',
        webkitdirectory: 'webkitdirectory'
      } : {};
      const events = disabled ? {} : {
        onClick: openFileDialogOnClick ? onClick : () => {},
        onKeydown: openFileDialogOnClick ? onKeyDown : () => {},
        onMouseenter,
        onMouseleave,
        onDrop: onFileDrop,
        onDragover: onFileDrop,
        tabindex: '0'
      };
      return (0, _vue.createVNode)(Tag, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, events), {}, {
        "class": cls,
        "role": "button",
        "style": attrs.style
      }), {
        default: () => [(0, _vue.createVNode)("input", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _pickAttrs.default)(otherProps, {
          aria: true,
          data: true
        })), {}, {
          "id": id,
          "type": "file",
          "ref": fileInput,
          "onClick": e => e.stopPropagation(),
          "onCancel": e => e.stopPropagation(),
          "key": uid.value,
          "style": {
            display: 'none'
          },
          "accept": accept
        }, dirProps), {}, {
          "multiple": multiple,
          "onChange": onChange
        }, capture != null ? {
          capture
        } : {}), null), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      });
    };
  }
});