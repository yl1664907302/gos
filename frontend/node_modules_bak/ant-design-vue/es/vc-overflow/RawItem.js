import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { OverflowContextProvider, useInjectOverflowContext } from './context';
import Item from './Item';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'RawItem',
  inheritAttrs: false,
  props: {
    component: PropTypes.any,
    title: PropTypes.any,
    id: String,
    onMouseenter: {
      type: Function
    },
    onMouseleave: {
      type: Function
    },
    onClick: {
      type: Function
    },
    onKeydown: {
      type: Function
    },
    onFocus: {
      type: Function
    },
    role: String,
    tabindex: Number
  },
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const context = useInjectOverflowContext();
    return () => {
      var _a;
      // Render directly when context not provided
      if (!context.value) {
        const {
            component: Component = 'div'
          } = props,
          restProps = __rest(props, ["component"]);
        return _createVNode(Component, _objectSpread(_objectSpread({}, restProps), attrs), {
          default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
        });
      }
      const _b = context.value,
        {
          className: contextClassName
        } = _b,
        restContext = __rest(_b, ["className"]);
      const {
          class: className
        } = attrs,
        restProps = __rest(attrs, ["class"]);
      // Do not pass context to sub item to avoid multiple measure
      return _createVNode(OverflowContextProvider, {
        "value": null
      }, {
        default: () => [_createVNode(Item, _objectSpread(_objectSpread(_objectSpread({
          "class": classNames(contextClassName, className)
        }, restContext), restProps), props), slots)]
      });
    };
  }
});