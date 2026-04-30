"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _propsUtil = require("../_util/props-util");
var _AjaxUploader = _interopRequireDefault(require("./AjaxUploader"));
var _interface = require("./interface");
function empty() {}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Upload',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _interface.uploadProps)(), {
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
    const uploader = (0, _vue.ref)();
    const abort = file => {
      var _a;
      (_a = uploader.value) === null || _a === void 0 ? void 0 : _a.abort(file);
    };
    expose({
      abort
    });
    return () => {
      return (0, _vue.createVNode)(_AjaxUploader.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), attrs), {}, {
        "ref": uploader
      }), slots);
    };
  }
});