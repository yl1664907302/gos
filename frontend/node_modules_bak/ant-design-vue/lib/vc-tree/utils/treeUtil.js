"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertDataToEntities = convertDataToEntities;
exports.convertNodePropsToEventData = convertNodePropsToEventData;
exports.convertTreeToData = convertTreeToData;
exports.fillFieldNames = fillFieldNames;
exports.flattenTreeData = flattenTreeData;
exports.getKey = getKey;
exports.getTreeNodeProps = getTreeNodeProps;
exports.traverseDataNodes = traverseDataNodes;
exports.warningWithoutKey = warningWithoutKey;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _util = require("../util");
var _warning = require("../../vc-util/warning");
var _propsUtil = require("../../_util/props-util");
var _omit = _interopRequireDefault(require("../../_util/omit"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function getKey(key, pos) {
  if (key !== null && key !== undefined) {
    return key;
  }
  return pos;
}
function fillFieldNames(fieldNames) {
  const {
    title,
    _title,
    key,
    children
  } = fieldNames || {};
  const mergedTitle = title || 'title';
  return {
    title: mergedTitle,
    _title: _title || [mergedTitle],
    key: key || 'key',
    children: children || 'children'
  };
}
/**
 * Warning if TreeNode do not provides key
 */
function warningWithoutKey(treeData, fieldNames) {
  const keys = new Map();
  function dig(list) {
    let path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    (list || []).forEach(treeNode => {
      const key = treeNode[fieldNames.key];
      const children = treeNode[fieldNames.children];
      (0, _warning.warning)(key !== null && key !== undefined, `Tree node must have a certain key: [${path}${key}]`);
      const recordKey = String(key);
      (0, _warning.warning)(!keys.has(recordKey) || key === null || key === undefined, `Same 'key' exist in the Tree: ${recordKey}`);
      keys.set(recordKey, true);
      dig(children, `${path}${recordKey} > `);
    });
  }
  dig(treeData);
}
/**
 * Convert `children` of Tree into `treeData` structure.
 */
function convertTreeToData(rootNodes) {
  function dig() {
    let node = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    const treeNodes = (0, _propsUtil.filterEmpty)(node);
    return treeNodes.map(treeNode => {
      var _a, _b, _c, _d;
      // Filter invalidate node
      if (!(0, _util.isTreeNode)(treeNode)) {
        (0, _warning.warning)(!treeNode, 'Tree/TreeNode can only accept TreeNode as children.');
        return null;
      }
      const slots = treeNode.children || {};
      const key = treeNode.key;
      const props = {};
      for (const [k, v] of Object.entries(treeNode.props)) {
        props[(0, _propsUtil.camelize)(k)] = v;
      }
      const {
        isLeaf,
        checkable,
        selectable,
        disabled,
        disableCheckbox
      } = props;
      // 默认值为 undefined
      const newProps = {
        isLeaf: isLeaf || isLeaf === '' || undefined,
        checkable: checkable || checkable === '' || undefined,
        selectable: selectable || selectable === '' || undefined,
        disabled: disabled || disabled === '' || undefined,
        disableCheckbox: disableCheckbox || disableCheckbox === '' || undefined
      };
      const slotsProps = (0, _extends2.default)((0, _extends2.default)({}, props), newProps);
      const {
          title = (_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots, slotsProps),
          icon = (_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots, slotsProps),
          switcherIcon = (_c = slots.switcherIcon) === null || _c === void 0 ? void 0 : _c.call(slots, slotsProps)
        } = props,
        rest = __rest(props, ["title", "icon", "switcherIcon"]);
      const children = (_d = slots.default) === null || _d === void 0 ? void 0 : _d.call(slots);
      const dataNode = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, rest), {
        title,
        icon,
        switcherIcon,
        key,
        isLeaf
      }), newProps);
      const parsedChildren = dig(children);
      if (parsedChildren.length) {
        dataNode.children = parsedChildren;
      }
      return dataNode;
    });
  }
  return dig(rootNodes);
}
/**
 * Flat nest tree data into flatten list. This is used for virtual list render.
 * @param treeNodeList Origin data node list
 * @param expandedKeys
 * need expanded keys, provides `true` means all expanded (used in `rc-tree-select`).
 */
function flattenTreeData(treeNodeList, expandedKeys, fieldNames) {
  const {
    _title: fieldTitles,
    key: fieldKey,
    children: fieldChildren
  } = fillFieldNames(fieldNames);
  const expandedKeySet = new Set(expandedKeys === true ? [] : expandedKeys);
  const flattenList = [];
  function dig(list) {
    let parent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    return list.map((treeNode, index) => {
      const pos = (0, _util.getPosition)(parent ? parent.pos : '0', index);
      const mergedKey = getKey(treeNode[fieldKey], pos);
      // Pick matched title in field title list
      let mergedTitle;
      for (let i = 0; i < fieldTitles.length; i += 1) {
        const fieldTitle = fieldTitles[i];
        if (treeNode[fieldTitle] !== undefined) {
          mergedTitle = treeNode[fieldTitle];
          break;
        }
      }
      // Add FlattenDataNode into list
      const flattenNode = (0, _extends2.default)((0, _extends2.default)({}, (0, _omit.default)(treeNode, [...fieldTitles, fieldKey, fieldChildren])), {
        title: mergedTitle,
        key: mergedKey,
        parent,
        pos,
        children: null,
        data: treeNode,
        isStart: [...(parent ? parent.isStart : []), index === 0],
        isEnd: [...(parent ? parent.isEnd : []), index === list.length - 1]
      });
      flattenList.push(flattenNode);
      // Loop treeNode children
      if (expandedKeys === true || expandedKeySet.has(mergedKey)) {
        flattenNode.children = dig(treeNode[fieldChildren] || [], flattenNode);
      } else {
        flattenNode.children = [];
      }
      return flattenNode;
    });
  }
  dig(treeNodeList);
  return flattenList;
}
/**
 * Traverse all the data by `treeData`.
 * Please not use it out of the `rc-tree` since we may refactor this code.
 */
function traverseDataNodes(dataNodes, callback,
// To avoid too many params, let use config instead of origin param
config) {
  let mergedConfig = {};
  if (typeof config === 'object') {
    mergedConfig = config;
  } else {
    mergedConfig = {
      externalGetKey: config
    };
  }
  mergedConfig = mergedConfig || {};
  // Init config
  const {
    childrenPropName,
    externalGetKey,
    fieldNames
  } = mergedConfig;
  const {
    key: fieldKey,
    children: fieldChildren
  } = fillFieldNames(fieldNames);
  const mergeChildrenPropName = childrenPropName || fieldChildren;
  // Get keys
  let syntheticGetKey;
  if (externalGetKey) {
    if (typeof externalGetKey === 'string') {
      syntheticGetKey = node => node[externalGetKey];
    } else if (typeof externalGetKey === 'function') {
      syntheticGetKey = node => externalGetKey(node);
    }
  } else {
    syntheticGetKey = (node, pos) => getKey(node[fieldKey], pos);
  }
  // Process
  function processNode(node, index, parent, pathNodes) {
    const children = node ? node[mergeChildrenPropName] : dataNodes;
    const pos = node ? (0, _util.getPosition)(parent.pos, index) : '0';
    const connectNodes = node ? [...pathNodes, node] : [];
    // Process node if is not root
    if (node) {
      const key = syntheticGetKey(node, pos);
      const data = {
        node,
        index,
        pos,
        key,
        parentPos: parent.node ? parent.pos : null,
        level: parent.level + 1,
        nodes: connectNodes
      };
      callback(data);
    }
    // Process children node
    if (children) {
      children.forEach((subNode, subIndex) => {
        processNode(subNode, subIndex, {
          node,
          pos,
          level: parent ? parent.level + 1 : -1
        }, connectNodes);
      });
    }
  }
  processNode(null);
}
/**
 * Convert `treeData` into entity records.
 */
function convertDataToEntities(dataNodes) {
  let {
    initWrapper,
    processEntity,
    onProcessFinished,
    externalGetKey,
    childrenPropName,
    fieldNames
  } = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let /** @deprecated Use `config.externalGetKey` instead */
  legacyExternalGetKey = arguments.length > 2 ? arguments[2] : undefined;
  // Init config
  const mergedExternalGetKey = externalGetKey || legacyExternalGetKey;
  const posEntities = {};
  const keyEntities = {};
  let wrapper = {
    posEntities,
    keyEntities
  };
  if (initWrapper) {
    wrapper = initWrapper(wrapper) || wrapper;
  }
  traverseDataNodes(dataNodes, item => {
    const {
      node,
      index,
      pos,
      key,
      parentPos,
      level,
      nodes
    } = item;
    const entity = {
      node,
      nodes,
      index,
      key,
      pos,
      level
    };
    const mergedKey = getKey(key, pos);
    posEntities[pos] = entity;
    keyEntities[mergedKey] = entity;
    // Fill children
    entity.parent = posEntities[parentPos];
    if (entity.parent) {
      entity.parent.children = entity.parent.children || [];
      entity.parent.children.push(entity);
    }
    if (processEntity) {
      processEntity(entity, wrapper);
    }
  }, {
    externalGetKey: mergedExternalGetKey,
    childrenPropName,
    fieldNames
  });
  if (onProcessFinished) {
    onProcessFinished(wrapper);
  }
  return wrapper;
}
/**
 * Get TreeNode props with Tree props.
 */
function getTreeNodeProps(key, _ref) {
  let {
    expandedKeysSet,
    selectedKeysSet,
    loadedKeysSet,
    loadingKeysSet,
    checkedKeysSet,
    halfCheckedKeysSet,
    dragOverNodeKey,
    dropPosition,
    keyEntities
  } = _ref;
  const entity = keyEntities[key];
  const treeNodeProps = {
    eventKey: key,
    expanded: expandedKeysSet.has(key),
    selected: selectedKeysSet.has(key),
    loaded: loadedKeysSet.has(key),
    loading: loadingKeysSet.has(key),
    checked: checkedKeysSet.has(key),
    halfChecked: halfCheckedKeysSet.has(key),
    pos: String(entity ? entity.pos : ''),
    parent: entity.parent,
    // [Legacy] Drag props
    // Since the interaction of drag is changed, the semantic of the props are
    // not accuracy, I think it should be finally removed
    dragOver: dragOverNodeKey === key && dropPosition === 0,
    dragOverGapTop: dragOverNodeKey === key && dropPosition === -1,
    dragOverGapBottom: dragOverNodeKey === key && dropPosition === 1
  };
  return treeNodeProps;
}
function convertNodePropsToEventData(props) {
  const {
    data,
    expanded,
    selected,
    checked,
    loaded,
    loading,
    halfChecked,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    pos,
    active,
    eventKey
  } = props;
  const eventData = (0, _extends2.default)((0, _extends2.default)({
    dataRef: data
  }, data), {
    expanded,
    selected,
    checked,
    loaded,
    loading,
    halfChecked,
    dragOver,
    dragOverGapTop,
    dragOverGapBottom,
    pos,
    active,
    eventKey,
    key: eventKey
  });
  if (!('props' in eventData)) {
    Object.defineProperty(eventData, 'props', {
      get() {
        (0, _warning.warning)(false, 'Second param return from event is node data instead of TreeNode instance. Please read value directly instead of reading from `props`.');
        return props;
      }
    });
  }
  return eventData;
}