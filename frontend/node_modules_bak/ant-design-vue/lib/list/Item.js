"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listItemProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var _grid = require("../grid");
var _vnode = require("../_util/vnode");
var _ItemMeta = _interopRequireDefault(require("./ItemMeta"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _contextKey = require("./contextKey");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const listItemProps = () => ({
  prefixCls: String,
  extra: _vueTypes.default.any,
  actions: _vueTypes.default.array,
  grid: Object,
  colStyle: {
    type: Object,
    default: undefined
  }
});
exports.listItemProps = listItemProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AListItem',
  inheritAttrs: false,
  Meta: _ItemMeta.default,
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
    } = (0, _vue.inject)(_contextKey.ListContextKey, {
      grid: (0, _vue.ref)(),
      itemLayout: (0, _vue.ref)()
    });
    const {
      prefixCls
    } = (0, _useConfigInject.default)('list', props);
    const isItemContainsTextNodeAndNotSingular = () => {
      var _a;
      const children = ((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)) || [];
      let result;
      children.forEach(element => {
        if ((0, _propsUtil.isStringElement)(element) && !(0, _propsUtil.isEmptyElement)(element)) {
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
      let actions = (_d = props.actions) !== null && _d !== void 0 ? _d : (0, _propsUtil.flattenChildren)((_e = slots.actions) === null || _e === void 0 ? void 0 : _e.call(slots));
      actions = actions && !Array.isArray(actions) ? [actions] : actions;
      const actionsContent = actions && actions.length > 0 && (0, _vue.createVNode)("ul", {
        "class": `${pre}-item-action`,
        "key": "actions"
      }, [actions.map((action, i) => (0, _vue.createVNode)("li", {
        "key": `${pre}-item-action-${i}`
      }, [action, i !== actions.length - 1 && (0, _vue.createVNode)("em", {
        "class": `${pre}-item-action-split`
      }, null)]))]);
      const Element = grid.value ? 'div' : 'li';
      const itemChildren = (0, _vue.createVNode)(Element, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restAttrs), {}, {
        "class": (0, _classNames.default)(`${pre}-item`, {
          [`${pre}-item-no-flex`]: !isFlexMode()
        }, className)
      }), {
        default: () => [itemLayout.value === 'vertical' && extra ? [(0, _vue.createVNode)("div", {
          "class": `${pre}-item-main`,
          "key": "content"
        }, [children, actionsContent]), (0, _vue.createVNode)("div", {
          "class": `${pre}-item-extra`,
          "key": "extra"
        }, [extra])] : [children, actionsContent, (0, _vnode.cloneElement)(extra, {
          key: 'extra'
        })]]
      });
      return grid.value ? (0, _vue.createVNode)(_grid.Col, {
        "flex": 1,
        "style": props.colStyle
      }, {
        default: () => [itemChildren]
      }) : itemChildren;
    };
  }
});