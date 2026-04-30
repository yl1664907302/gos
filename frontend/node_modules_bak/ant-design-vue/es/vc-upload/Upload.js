import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent, ref } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import AjaxUpload from './AjaxUploader';
import { uploadProps } from './interface';
function empty() {}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'Upload',
  inheritAttrs: false,
  props: initDefaultProps(uploadProps(), {
    componentTag: 'span',
    prefixCls: 'rc-upload',
    data: {},
    headers: {},
    name: 'file',
    multipart: false,
    onStart: empty,
    onError: empty,
    onSuccess: empty,
    multiple: false,
    beforeUpload: null,
    customRequest: null,
    withCredentials: false,
    openFileDialogOnClick: true
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs,
      expose
    } = _ref;
    const uploader = ref();
    const abort = file => {
      var _a;
      (_a = uploader.value) === null || _a === void 0 ? void 0 : _a.abort(file);
    };
    expose({
      abort
    });
    return () => {
      return _createVNode(AjaxUpload, _objectSpread(_objectSpread(_objectSpread({}, props), attrs), {}, {
        "ref": uploader
      }), slots);
    };
  }
});