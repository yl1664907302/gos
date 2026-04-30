import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import SingleNumber from './SingleNumber';
import { filterEmpty } from '../_util/props-util';
const scrollNumberProps = {
  prefixCls: String,
  count: PropTypes.any,
  component: String,
  title: PropTypes.any,
  show: Boolean
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ScrollNumber',
  inheritAttrs: false,
  props: scrollNumberProps,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('scroll-number', props);
    return () => {
      var _a;
      const _b = _extends(_extends({}, props), attrs),
        {
          prefixCls: customizePrefixCls,
          count,
          title,
          show,
          component: Tag = 'sup',
          class: className,
          style
        } = _b,
        restProps = __rest(_b, ["prefixCls", "count", "title", "show", "component", "class", "style"]);
      // ============================ Render ============================
      const newProps = _extends(_extends({}, restProps), {
        style,
        'data-show': props.show,
        class: classNames(prefixCls.value, className),
        title: title
      });
      // Only integer need motion
      let numberNodes = count;
      if (count && Number(count) % 1 === 0) {
        const numberList = String(count).split('');
        numberNodes = numberList.map((num, i) => _createVNode(SingleNumber, {
          "prefixCls": prefixCls.value,
          "count": Number(count),
          "value": num,
          "key": numberList.length - i
        }, null));
      }
      // allow specify the border
      // mock border-color by box-shadow for compatible with old usage:
      // <Badge count={4} style={{ backgroundColor: '#fff', color: '#999', borderColor: '#d9d9d9' }} />
      if (style && style.borderColor) {
        newProps.style = _extends(_extends({}, style), {
          boxShadow: `0 0 0 1px ${style.borderColor} inset`
        });
      }
      const children = filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots));
      if (children && children.length) {
        return cloneElement(children, {
          class: classNames(`${prefixCls.value}-custom-component`)
        }, false);
      }
      return _createVNode(Tag, newProps, {
        default: () => [numberNodes]
      });
    };
  }
});