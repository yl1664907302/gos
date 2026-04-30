"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = useItems;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _SubMenu = _interopRequireDefault(require("../SubMenu"));
var _ItemGroup = _interopRequireDefault(require("../ItemGroup"));
var _Divider = _interopRequireDefault(require("../Divider"));
var _MenuItem = _interopRequireDefault(require("../MenuItem"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function convertItemsToNodes(list, store, parentMenuInfo) {
  return (list || []).map((opt, index) => {
    if (opt && typeof opt === 'object') {
      const _a = opt,
        {
          label,
          children,
          key,
          type
        } = _a,
        restProps = __rest(_a, ["label", "children", "key", "type"]);
      const mergedKey = key !== null && key !== void 0 ? key : `tmp-${index}`;
      // 此处 eventKey === key, 移除 children 后可以移除 eventKey
      const parentKeys = parentMenuInfo ? parentMenuInfo.parentKeys.slice() : [];
      const childrenEventKeys = [];
      // if
      const menuInfo = {
        eventKey: mergedKey,
        key: mergedKey,
        parentEventKeys: (0, _vue.ref)(parentKeys),
        parentKeys: (0, _vue.ref)(parentKeys),
        childrenEventKeys: (0, _vue.ref)(childrenEventKeys),
        isLeaf: false
      };
      // MenuItemGroup & SubMenuItem
      if (children || type === 'group') {
        if (type === 'group') {
          const childrenNodes = convertItemsToNodes(children, store, parentMenuInfo);
          // Group
          return (0, _vue.createVNode)(_ItemGroup.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
            "key": mergedKey
          }, restProps), {}, {
            "title": label,
            "originItemValue": opt
          }), {
            default: () => [childrenNodes]
          });
        }
        store.set(mergedKey, menuInfo);
        if (parentMenuInfo) {
          parentMenuInfo.childrenEventKeys.push(mergedKey);
        }
        // Sub Menu
        const childrenNodes = convertItemsToNodes(children, store, {
          childrenEventKeys,
          parentKeys: [].concat(parentKeys, mergedKey)
        });
        return (0, _vue.createVNode)(_SubMenu.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
          "key": mergedKey
        }, restProps), {}, {
          "title": label,
          "originItemValue": opt
        }), {
          default: () => [childrenNodes]
        });
      }
      // MenuItem & Divider
      if (type === 'divider') {
        return (0, _vue.createVNode)(_Divider.default, (0, _objectSpread2.default)({
          "key": mergedKey
        }, restProps), null);
      }
      menuInfo.isLeaf = true;
      store.set(mergedKey, menuInfo);
      return (0, _vue.createVNode)(_MenuItem.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "key": mergedKey
      }, restProps), {}, {
        "originItemValue": opt
      }), {
        default: () => [label]
      });
    }
    return null;
  }).filter(opt => opt);
}
// FIXME: Move logic here in v4
/**
 * We simply convert `items` to VueNode for reuse origin component logic. But we need move all the
 * logic from component into this hooks when in v4
 */
function useItems(props) {
  const itemsNodes = (0, _vue.shallowRef)([]);
  const hasItmes = (0, _vue.shallowRef)(false);
  const store = (0, _vue.shallowRef)(new Map());
  (0, _vue.watch)(() => props.items, () => {
    const newStore = new Map();
    hasItmes.value = false;
    if (props.items) {
      hasItmes.value = true;
      itemsNodes.value = convertItemsToNodes(props.items, newStore);
    } else {
      itemsNodes.value = undefined;
    }
    store.value = newStore;
  }, {
    immediate: true,
    deep: true
  });
  return {
    itemsNodes,
    store,
    hasItmes
  };
}