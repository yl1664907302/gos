import { booleanType, stringType, functionType, arrayType, objectType, someType } from '../_util/type';
function uploadProps() {
  return {
    capture: someType([Boolean, String]),
    type: stringType(),
    name: String,
    defaultFileList: arrayType(),
    fileList: arrayType(),
    action: someType([String, Function]),
    directory: booleanType(),
    data: someType([Object, Function]),
    method: stringType(),
    headers: objectType(),
    showUploadList: someType([Boolean, Object]),
    multiple: booleanType(),
    accept: String,
    beforeUpload: functionType(),
    onChange: functionType(),
    'onUpdate:fileList': functionType(),
    onDrop: functionType(),
    listType: stringType(),
    onPreview: functionType(),
    onDownload: functionType(),
    onReject: functionType(),
    onRemove: functionType(),
    /** @deprecated Please use `onRemove` directly */
    remove: functionType(),
    supportServerRender: booleanType(),
    disabled: booleanType(),
    prefixCls: String,
    customRequest: functionType(),
    withCredentials: booleanType(),
    openFileDialogOnClick: booleanType(),
    locale: objectType(),
    id: String,
    previewFile: functionType(),
    /** @deprecated Please use `beforeUpload` directly */
    transformFile: functionType(),
    iconRender: functionType(),
    isImageUrl: functionType(),
    progress: objectType(),
    itemRender: functionType(),
    /** Config max count of `fileList`. Will replace current one when `maxCount` is 1 */
    maxCount: Number,
    height: someType([Number, String]),
    removeIcon: functionType(),
    downloadIcon: functionType(),
    previewIcon: functionType()
  };
}
function uploadListProps() {
  return {
    listType: stringType(),
    onPreview: functionType(),
    onDownload: functionType(),
    onRemove: functionType(),
    items: arrayType(),
    progress: objectType(),
    prefixCls: stringType(),
    showRemoveIcon: booleanType(),
    showDownloadIcon: booleanType(),
    showPreviewIcon: booleanType(),
    removeIcon: functionType(),
    downloadIcon: functionType(),
    previewIcon: functionType(),
    locale: objectType(undefined),
    previewFile: functionType(),
    iconRender: functionType(),
    isImageUrl: functionType(),
    appendAction: functionType(),
    appendActionVisible: booleanType(),
    itemRender: functionType()
  };
}
export { uploadProps, uploadListProps };