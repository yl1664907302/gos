import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent } from 'vue';
import Upload from './Upload';
import { uploadProps } from './interface';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AUploadDragger',
  inheritAttrs: false,
  props: uploadProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    return () => {
      const {
          height
        } = props,
        restProps = __rest(props, ["height"]);
      const {
          style
        } = attrs,
        restAttrs = __rest(attrs, ["style"]);
      const draggerProps = _extends(_extends(_extends({}, restProps), restAttrs), {
        type: 'drag',
        style: _extends(_extends({}, style), {
          height: typeof height === 'number' ? `${height}px` : height
        })
      });
      return _createVNode(Upload, draggerProps, slots);
    };
  }
});