export const uploadProps = () => {
  return {
    capture: [Boolean, String],
    multipart: {
      type: Boolean,
      default: undefined
    },
    name: String,
    disabled: {
      type: Boolean,
      default: undefined
    },
    componentTag: String,
    action: [String, Function],
    method: String,
    directory: {
      type: Boolean,
      default: undefined
    },
    data: [Object, Function],
    headers: Object,
    accept: String,
    multiple: {
      type: Boolean,
      default: undefined
    },
    onBatchStart: Function,
    onReject: Function,
    onStart: Function,
    onError: Function,
    onSuccess: Function,
    onProgress: Function,
    beforeUpload: Function,
    customRequest: Function,
    withCredentials: {
      type: Boolean,
      default: undefined
    },
    openFileDialogOnClick: {
      type: Boolean,
      default: undefined
    },
    prefixCls: String,
    id: String,
    onMouseenter: Function,
    onMouseleave: Function,
    onClick: Function
  };
};