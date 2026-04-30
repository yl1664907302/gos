"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadListProps = uploadListProps;
exports.uploadProps = uploadProps;
var _type = require("../_util/type");
function uploadProps() {
  return {
    capture: (0, _type.someType)([Boolean, String]),
    type: (0, _type.stringType)(),
    name: String,
    defaultFileList: (0, _type.arrayType)(),
    fileList: (0, _type.arrayType)(),
    action: (0, _type.someType)([String, Function]),
    directory: (0, _type.booleanType)(),
    data: (0, _type.someType)([Object, Function]),
    method: (0, _type.stringType)(),
    headers: (0, _type.objectType)(),
    showUploadList: (0, _type.someType)([Boolean, Object]),
    multiple: (0, _type.booleanType)(),
    accept: String,
    beforeUpload: (0, _type.functionType)(),
    onChange: (0, _type.functionType)(),
    'onUpdate:fileList': (0, _type.functionType)(),
    onDrop: (0, _type.functionType)(),
    listType: (0, _type.stringType)(),
    onPreview: (0, _type.functionType)(),
    onDownload: (0, _type.functionType)(),
    onReject: (0, _type.functionType)(),
    onRemove: (0, _type.functionType)(),
    /** @deprecated Please use `onRemove` directly */
    remove: (0, _type.functionType)(),
    supportServerRender: (0, _type.booleanType)(),
    disabled: (0, _type.booleanType)(),
    prefixCls: String,
    customRequest: (0, _type.functionType)(),
    withCredentials: (0, _type.booleanType)(),
    openFileDialogOnClick: (0, _type.booleanType)(),
    locale: (0, _type.objectType)(),
    id: String,
    previewFile: (0, _type.functionType)(),
    /** @deprecated Please use `beforeUpload` directly */
    transformFile: (0, _type.functionType)(),
    iconRender: (0, _type.functionType)(),
    isImageUrl: (0, _type.functionType)(),
    progress: (0, _type.objectType)(),
    itemRender: (0, _type.functionType)(),
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount: Number,
    height: (0, _type.someType)([Number, String]),
    removeIcon: (0, _type.functionType)(),
    downloadIcon: (0, _type.functionType)(),
    previewIcon: (0, _type.functionType)()
  };
}
function uploadListProps() {
  return {
    listType: (0, _type.stringType)(),
    onPreview: (0, _type.functionType)(),
    onDownload: (0, _type.functionType)(),
    onRemove: (0, _type.functionType)(),
    items: (0, _type.arrayType)(),
    progress: (0, _type.objectType)(),
    prefixCls: (0, _type.stringType)(),
    showRemoveIcon: (0, _type.booleanType)(),
    showDownloadIcon: (0, _type.booleanType)(),
    showPreviewIcon: (0, _type.booleanType)(),
    removeIcon: (0, _type.functionType)(),
    downloadIcon: (0, _type.functionType)(),
    previewIcon: (0, _type.functionType)(),
    locale: (0, _type.objectType)(undefined),
    previewFile: (0, _type.functionType)(),
    iconRender: (0, _type.functionType)(),
    isImageUrl: (0, _type.functionType)(),
    appendAction: (0, _type.functionType)(),
    appendActionVisible: (0, _type.booleanType)(),
    itemRender: (0, _type.functionType)()
  };
}