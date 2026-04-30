import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import { isStringElement, isEmptyElement, flattenChildren } from '../_util/props-util';
import { Col } from '../grid';
import { cloneElement } from '../_util/vnode';
import { defineComponent, inject, ref } from 'vue';
import ItemMeta from './ItemMeta';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { ListContextKey } from './contextKey';
export const listItemProps = () => ({
  prefixCls: String,
  extra: PropTypes.any,
  actions: PropTypes.array,
  grid: Object,
  colStyle: {
    type: Object,
    default: undefined
  }
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AListItem',
  inheritAttrs: false,
  Meta: ItemMeta,
  props: listItemProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      itemLayout,
      grid
    } = inject(ListContextKey, {
      grid: ref(),
      itemLayout: ref()
    });
    const {
      prefixCls
    } = useConfigInject('list', props);
    const isItemContainsTextNodeAndNotSingular = () => {
      var _a;
      const children = ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || [];
      let result;
      children.forEach(element => {
        if (isStringElement(element) && !isEmptyElement(element)) {
          result = true;
        }
      });
      return result && children.length > 1;
    };
    const isFlexMode = () => {
      var _a, _b;
      const extra = (_a = props.extra) !== null && _a !== void 0 ? _a : (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots);
      if (itemLayout.value === 'vertical') {
        return !!extra;
      }
      return !isItemContainsTextNodeAndNotSingular();
    };
    return () => {
      var _a, _b, _c, _d, _e;
      const {
          class: className
        } = attrs,
        restAttrs = __rest(attrs, ["class"]);
      const pre = prefixCls.value;
      const extra = (_a = props.extra) !== null && _a !== void 0 ? _a : (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots);
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      let actions = (_d = props.actions) !== null && _d !== void 0 ? _d : flattenChildren((_e = slots.actions) === null || _e === void 0 ? void 0 : _e.call(slots));
      actions = actions && !Array.isArray(actions) ? [actions] : actions;
      const actionsContent = actions && actions.length > 0 && _createVNode("ul", {
        "class": `${pre}-item-action`,
        "key": "actions"
      }, [actions.map((action, i) => _createVNode("li", {
        "key": `${pre}-item-action-${i}`
      }, [action, i !== actions.length - 1 && _createVNode("em", {
        "class": `${pre}-item-action-split`
      }, null)]))]);
      const Element = grid.value ? 'div' : 'li';
      const itemChildren = _createVNode(Element, _objectSpread(_objectSpread({}, restAttrs), {}, {
        "class": classNames(`${pre}-item`, {
          [`${pre}-item-no-flex`]: !isFlexMode()
        }, className)
      }), {
        default: () => [itemLayout.value === 'vertical' && extra ? [_createVNode("div", {
          "class": `${pre}-item-main`,
          "key": "content"
        }, [children, actionsContent]), _createVNode("div", {
          "class": `${pre}-item-extra`,
          "key": "extra"
        }, [extra])] : [children, actionsContent, cloneElement(extra, {
          key: 'extra'
        })]]
      });
      return grid.value ? _createVNode(Col, {
        "flex": 1,
        "style": props.colStyle
      }, {
        default: () => [itemChildren]
      }) : itemChildren;
    };
  }
});