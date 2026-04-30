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
import SubMenu from '../SubMenu';
import ItemGroup from '../ItemGroup';
import MenuDivider from '../Divider';
import MenuItem from '../MenuItem';
import { ref, shallowRef, watch } from 'vue';
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
        parentEventKeys: ref(parentKeys),
        parentKeys: ref(parentKeys),
        childrenEventKeys: ref(childrenEventKeys),
        isLeaf: false
      };
      // MenuItemGroup & SubMenuItem
      if (children || type === 'group') {
        if (type === 'group') {
          const childrenNodes = convertItemsToNodes(children, store, parentMenuInfo);
          // Group
          return _createVNode(ItemGroup, _objectSpread(_objectSpread({
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
        return _createVNode(SubMenu, _objectSpread(_objectSpread({
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
        return _createVNode(MenuDivider, _objectSpread({
          "key": mergedKey
        }, restProps), null);
      }
      menuInfo.isLeaf = true;
      store.set(mergedKey, menuInfo);
      return _createVNode(MenuItem, _objectSpread(_objectSpread({
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
export default function useItems(props) {
  const itemsNodes = shallowRef([]);
  const hasItmes = shallowRef(false);
  const store = shallowRef(new Map());
  watch(() => props.items, () => {
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