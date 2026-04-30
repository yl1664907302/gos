"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.convertChildrenToData = convertChildrenToData;
exports.fillAdditionalInfo = fillAdditionalInfo;
exports.fillLegacyProps = fillLegacyProps;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../../_util/props-util");
var _warning = require("../../vc-util/warning");
var _TreeNode = _interopRequireDefault(require("../TreeNode"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
function isTreeSelectNode(node) {
  return node && node.type && node.type.isTreeSelectNode;
}
function convertChildrenToData(rootNodes) {
  function dig() {
    let treeNodes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    return (0, _propsUtil.filterEmpty)(treeNodes).map(treeNode => {
      var _a, _b, _c;
      // Filter invalidate node
      if (!isTreeSelectNode(treeNode)) {
        (0, _warning.warning)(!treeNode, 'TreeSelect/TreeSelectNode can only accept TreeSelectNode as children.');
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
          switcherIcon = (_b = slots.switcherIcon) === null || _b === void 0 ? void 0 : _b.call(slots, slotsProps)
        } = props,
        rest = __rest(props, ["title", "switcherIcon"]);
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      const dataNode = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, rest), {
        title,
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
function fillLegacyProps(dataNode) {
  // Skip if not dataNode exist
  if (!dataNode) {
    return dataNode;
  }
  const cloneNode = (0, _extends2.default)({}, dataNode);
  if (!('props' in cloneNode)) {
    Object.defineProperty(cloneNode, 'props', {
      get() {
        (0, _warning.warning)(false, 'New `vc-tree-select` not support return node instance as argument anymore. Please consider to remove `props` access.');
        return cloneNode;
      }
    });
  }
  return cloneNode;
}
function fillAdditionalInfo(extra, triggerValue, checkedValues, treeData, showPosition, fieldNames) {
  let triggerNode = null;
  let nodeList = null;
  function generateMap() {
    function dig(list) {
      let level = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '0';
      let parentIncluded = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      return list.map((option, index) => {
        const pos = `${level}-${index}`;
        const value = option[fieldNames.value];
        const included = checkedValues.includes(value);
        const children = dig(option[fieldNames.children] || [], pos, included);
        const node = (0, _vue.createVNode)(_TreeNode.default, option, {
          default: () => [children.map(child => child.node)]
        });
        // Link with trigger node
        if (triggerValue === value) {
          triggerNode = node;
        }
        if (included) {
          const checkedNode = {
            pos,
            node,
            children
          };
          if (!parentIncluded) {
            nodeList.push(checkedNode);
          }
          return checkedNode;
        }
        return null;
      }).filter(node => node);
    }
    if (!nodeList) {
      nodeList = [];
      dig(treeData);
      // Sort to keep the checked node length
      nodeList.sort((_ref, _ref2) => {
        let {
          node: {
            props: {
              value: val1
            }
          }
        } = _ref;
        let {
          node: {
            props: {
              value: val2
            }
          }
        } = _ref2;
        const index1 = checkedValues.indexOf(val1);
        const index2 = checkedValues.indexOf(val2);
        return index1 - index2;
      });
    }
  }
  Object.defineProperty(extra, 'triggerNode', {
    get() {
      (0, _warning.warning)(false, '`triggerNode` is deprecated. Please consider decoupling data with node.');
      generateMap();
      return triggerNode;
    }
  });
  Object.defineProperty(extra, 'allCheckedNodes', {
    get() {
      (0, _warning.warning)(false, '`allCheckedNodes` is deprecated. Please consider decoupling data with node.');
      generateMap();
      if (showPosition) {
        return nodeList;
      }
      return nodeList.map(_ref3 => {
        let {
          node
        } = _ref3;
        return node;
      });
    }
  });
}