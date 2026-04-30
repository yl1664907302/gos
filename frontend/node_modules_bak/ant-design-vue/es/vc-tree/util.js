import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
/* eslint-disable no-lonely-if */
/**
 * Legacy code. Should avoid to use if you are new to import these code.
 */
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import TreeNode from './TreeNode';
import { warning } from '../vc-util/warning';
export function arrDel(list, value) {
  if (!list) return [];
  const clone = list.slice();
  const index = clone.indexOf(value);
  if (index >= 0) {
    clone.splice(index, 1);
  }
  return clone;
}
export function arrAdd(list, value) {
  const clone = (list || []).slice();
  if (clone.indexOf(value) === -1) {
    clone.push(value);
  }
  return clone;
}
export function posToArr(pos) {
  return pos.split('-');
}
export function getPosition(level, index) {
  return `${level}-${index}`;
}
export function isTreeNode(node) {
  return node && node.type && node.type.isTreeNode;
}
export function getDragChildrenKeys(dragNodeKey, keyEntities) {
  // not contains self
  // self for left or right drag
  const dragChildrenKeys = [];
  const entity = keyEntities[dragNodeKey];
  function dig() {
    let list = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    list.forEach(_ref => {
      let {
        key,
        children
      } = _ref;
      dragChildrenKeys.push(key);
      dig(children);
    });
  }
  dig(entity.children);
  return dragChildrenKeys;
}
export function isLastChild(treeNodeEntity) {
  if (treeNodeEntity.parent) {
    const posArr = posToArr(treeNodeEntity.pos);
    return Number(posArr[posArr.length - 1]) === treeNodeEntity.parent.children.length - 1;
  }
  return false;
}
export function isFirstChild(treeNodeEntity) {
  const posArr = posToArr(treeNodeEntity.pos);
  return Number(posArr[posArr.length - 1]) === 0;
}
// Only used when drag, not affect SSR.
export function calcDropPosition(event, dragNode, targetNode, indent, startMousePosition, allowDrop, flattenedNodes, keyEntities, expandKeysSet, direction) {
  var _a;
  const {
    clientX,
    clientY
  } = event;
  const {
    top,
    height
  } = event.target.getBoundingClientRect();
  // optional chain for testing
  const horizontalMouseOffset = (direction === 'rtl' ? -1 : 1) * (((startMousePosition === null || startMousePosition === void 0 ? void 0 : startMousePosition.x) || 0) - clientX);
  const rawDropLevelOffset = (horizontalMouseOffset - 12) / indent;
  // find abstract drop node by horizontal offset
  let abstractDropNodeEntity = keyEntities[targetNode.eventKey];
  if (clientY < top + height / 2) {
    // first half, set abstract drop node to previous node
    const nodeIndex = flattenedNodes.findIndex(flattenedNode => flattenedNode.key === abstractDropNodeEntity.key);
    const prevNodeIndex = nodeIndex <= 0 ? 0 : nodeIndex - 1;
    const prevNodeKey = flattenedNodes[prevNodeIndex].key;
    abstractDropNodeEntity = keyEntities[prevNodeKey];
  }
  const initialAbstractDropNodeKey = abstractDropNodeEntity.key;
  const abstractDragOverEntity = abstractDropNodeEntity;
  const dragOverNodeKey = abstractDropNodeEntity.key;
  let dropPosition = 0;
  let dropLevelOffset = 0;
  // Only allow cross level drop when dragging on a non-expanded node
  if (!expandKeysSet.has(initialAbstractDropNodeKey)) {
    for (let i = 0; i < rawDropLevelOffset; i += 1) {
      if (isLastChild(abstractDropNodeEntity)) {
        abstractDropNodeEntity = abstractDropNodeEntity.parent;
        dropLevelOffset += 1;
      } else {
        break;
      }
    }
  }
  const abstractDragDataNode = dragNode.eventData;
  const abstractDropDataNode = abstractDropNodeEntity.node;
  let dropAllowed = true;
  if (isFirstChild(abstractDropNodeEntity) && abstractDropNodeEntity.level === 0 && clientY < top + height / 2 && allowDrop({
    dragNode: abstractDragDataNode,
    dropNode: abstractDropDataNode,
    dropPosition: -1
  }) && abstractDropNodeEntity.key === targetNode.eventKey) {
    // first half of first node in first level
    dropPosition = -1;
  } else if ((abstractDragOverEntity.children || []).length && expandKeysSet.has(dragOverNodeKey)) {
    // drop on expanded node
    // only allow drop inside
    if (allowDrop({
      dragNode: abstractDragDataNode,
      dropNode: abstractDropDataNode,
      dropPosition: 0
    })) {
      dropPosition = 0;
    } else {
      dropAllowed = false;
    }
  } else if (dropLevelOffset === 0) {
    if (rawDropLevelOffset > -1.5) {
      // | Node     | <- abstractDropNode
      // | -^-===== | <- mousePosition
      // 1. try drop after
      // 2. do not allow drop
      if (allowDrop({
        dragNode: abstractDragDataNode,
        dropNode: abstractDropDataNode,
        dropPosition: 1
      })) {
        dropPosition = 1;
      } else {
        dropAllowed = false;
      }
    } else {
      // | Node     | <- abstractDropNode
      // | ---==^== | <- mousePosition
      // whether it has children or doesn't has children
      // always
      // 1. try drop inside
      // 2. try drop after
      // 3. do not allow drop
      if (allowDrop({
        dragNode: abstractDragDataNode,
        dropNode: abstractDropDataNode,
        dropPosition: 0
      })) {
        dropPosition = 0;
      } else if (allowDrop({
        dragNode: abstractDragDataNode,
        dropNode: abstractDropDataNode,
        dropPosition: 1
      })) {
        dropPosition = 1;
      } else {
        dropAllowed = false;
      }
    }
  } else {
    // | Node1 | <- abstractDropNode
    //      |  Node2  |
    // --^--|----=====| <- mousePosition
    // 1. try insert after Node1
    // 2. do not allow drop
    if (allowDrop({
      dragNode: abstractDragDataNode,
      dropNode: abstractDropDataNode,
      dropPosition: 1
    })) {
      dropPosition = 1;
    } else {
      dropAllowed = false;
    }
  }
  return {
    dropPosition,
    dropLevelOffset,
    dropTargetKey: abstractDropNodeEntity.key,
    dropTargetPos: abstractDropNodeEntity.pos,
    dragOverNodeKey,
    dropContainerKey: dropPosition === 0 ? null : ((_a = abstractDropNodeEntity.parent) === null || _a === void 0 ? void 0 : _a.key) || null,
    dropAllowed
  };
}
/**
 * Return selectedKeys according with multiple prop
 * @param selectedKeys
 * @param props
 * @returns [string]
 */
export function calcSelectedKeys(selectedKeys, props) {
  if (!selectedKeys) return undefined;
  const {
    multiple
  } = props;
  if (multiple) {
    return selectedKeys.slice();
  }
  if (selectedKeys.length) {
    return [selectedKeys[0]];
  }
  return selectedKeys;
}
const internalProcessProps = props => props;
export function convertDataToTree(treeData, processor) {
  if (!treeData) return [];
  const {
    processProps = internalProcessProps
  } = processor || {};
  const list = Array.isArray(treeData) ? treeData : [treeData];
  return list.map(_a => {
    var {
        children
      } = _a,
      props = __rest(_a, ["children"]);
    const childrenNodes = convertDataToTree(children, processor);
    return _createVNode(TreeNode, _objectSpread({
      "key": props.key
    }, processProps(props)), {
      default: () => [childrenNodes]
    });
  });
}
/**
 * Parse `checkedKeys` to { checkedKeys, halfCheckedKeys } style
 */
export function parseCheckedKeys(keys) {
  if (!keys) {
    return null;
  }
  // Convert keys to object format
  let keyProps;
  if (Array.isArray(keys)) {
    // [Legacy] Follow the api doc
    keyProps = {
      checkedKeys: keys,
      halfCheckedKeys: undefined
    };
  } else if (typeof keys === 'object') {
    keyProps = {
      checkedKeys: keys.checked || undefined,
      halfCheckedKeys: keys.halfChecked || undefined
    };
  } else {
    warning(false, '`checkedKeys` is not an array or an object');
    return null;
  }
  return keyProps;
}
/**
 * If user use `autoExpandParent` we should get the list of parent node
 * @param keyList
 * @param keyEntities
 */
export function conductExpandParent(keyList, keyEntities) {
  const expandedKeys = new Set();
  function conductUp(key) {
    if (expandedKeys.has(key)) return;
    const entity = keyEntities[key];
    if (!entity) return;
    expandedKeys.add(key);
    const {
      parent,
      node
    } = entity;
    if (node.disabled) return;
    if (parent) {
      conductUp(parent.key);
    }
  }
  (keyList || []).forEach(key => {
    conductUp(key);
  });
  return [...expandedKeys];
}