"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.directoryTreeProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _debounce = _interopRequireDefault(require("lodash/debounce"));
var _FolderOpenOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FolderOpenOutlined"));
var _FolderOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FolderOutlined"));
var _FileOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/FileOutlined"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _Tree = _interopRequireWildcard(require("./Tree"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _treeUtil = require("../vc-tree/utils/treeUtil");
var _util = require("../vc-tree/util");
var _dictUtil = require("./utils/dictUtil");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const directoryTreeProps = () => (0, _extends2.default)((0, _extends2.default)({}, (0, _Tree.treeProps)()), {
  expandAction: (0, _type.someType)([Boolean, String])
});
exports.directoryTreeProps = directoryTreeProps;
function getIcon(props) {
  const {
    isLeaf,
    expanded
  } = props;
  if (isLeaf) {
    return (0, _vue.createVNode)(_FileOutlined.default, null, null);
  }
  return expanded ? (0, _vue.createVNode)(_FolderOpenOutlined.default, null, null) : (0, _vue.createVNode)(_FolderOutlined.default, null, null);
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ADirectoryTree',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(directoryTreeProps(), {
    showIcon: true,
    expandAction: 'click'
  }),
  slots: Object,
  // emits: [
  //   'update:selectedKeys',
  //   'update:checkedKeys',
  //   'update:expandedKeys',
  //   'expand',
  //   'select',
  //   'check',
  //   'doubleclick',
  //   'dblclick',
  //   'click',
  // ],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit,
      expose
    } = _ref;
    var _a;
    // convertTreeToData 兼容 a-tree-node 历史写法，未来a-tree-node移除后，删除相关代码，不要再render中调用 treeData，否则死循环
    const treeData = (0, _vue.ref)(props.treeData || (0, _treeUtil.convertTreeToData)((0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))));
    (0, _vue.watch)(() => props.treeData, () => {
      treeData.value = props.treeData;
    });
    (0, _vue.onUpdated)(() => {
      (0, _vue.nextTick)(() => {
        var _a;
        if (props.treeData === undefined && slots.default) {
          treeData.value = (0, _treeUtil.convertTreeToData)((0, _propsUtil.filterEmpty)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)));
        }
      });
    });
    // Shift click usage
    const lastSelectedKey = (0, _vue.ref)();
    const cachedSelectedKeys = (0, _vue.ref)();
    const fieldNames = (0, _vue.computed)(() => (0, _treeUtil.fillFieldNames)(props.fieldNames));
    const treeRef = (0, _vue.ref)();
    const scrollTo = scroll => {
      var _a;
      (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(scroll);
    };
    expose({
      scrollTo,
      selectedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.selectedKeys;
      }),
      checkedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.checkedKeys;
      }),
      halfCheckedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.halfCheckedKeys;
      }),
      loadedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadedKeys;
      }),
      loadingKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadingKeys;
      }),
      expandedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.expandedKeys;
      })
    });
    const getInitExpandedKeys = () => {
      const {
        keyEntities
      } = (0, _treeUtil.convertDataToEntities)(treeData.value, {
        fieldNames: fieldNames.value
      });
      let initExpandedKeys;
      // Expanded keys
      if (props.defaultExpandAll) {
        initExpandedKeys = Object.keys(keyEntities);
      } else if (props.defaultExpandParent) {
        initExpandedKeys = (0, _util.conductExpandParent)(props.expandedKeys || props.defaultExpandedKeys || [], keyEntities);
      } else {
        initExpandedKeys = props.expandedKeys || props.defaultExpandedKeys;
      }
      return initExpandedKeys;
    };
    const selectedKeys = (0, _vue.ref)(props.selectedKeys || props.defaultSelectedKeys || []);
    const expandedKeys = (0, _vue.ref)(getInitExpandedKeys());
    (0, _vue.watch)(() => props.selectedKeys, () => {
      if (props.selectedKeys !== undefined) {
        selectedKeys.value = props.selectedKeys;
      }
    }, {
      immediate: true
    });
    (0, _vue.watch)(() => props.expandedKeys, () => {
      if (props.expandedKeys !== undefined) {
        expandedKeys.value = props.expandedKeys;
      }
    }, {
      immediate: true
    });
    const expandFolderNode = (event, node) => {
      const {
        isLeaf
      } = node;
      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      // Call internal rc-tree expand function
      // https://github.com/ant-design/ant-design/issues/12567
      treeRef.value.onNodeExpand(event, node);
    };
    const onDebounceExpand = (0, _debounce.default)(expandFolderNode, 200, {
      leading: true
    });
    const onExpand = (keys, info) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
      // Call origin function
      emit('update:expandedKeys', keys);
      emit('expand', keys, info);
    };
    const onClick = (event, node) => {
      const {
        expandAction
      } = props;
      // Expand the tree
      if (expandAction === 'click') {
        onDebounceExpand(event, node);
      }
      emit('click', event, node);
    };
    const onDoubleClick = (event, node) => {
      const {
        expandAction
      } = props;
      // Expand the tree
      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        onDebounceExpand(event, node);
      }
      emit('doubleclick', event, node);
      emit('dblclick', event, node);
    };
    const onSelect = (keys, event) => {
      const {
        multiple
      } = props;
      const {
        node,
        nativeEvent
      } = event;
      const key = node[fieldNames.value.key];
      // const newState: DirectoryTreeState = {};
      // We need wrap this event since some value is not same
      const newEvent = (0, _extends2.default)((0, _extends2.default)({}, event), {
        selected: true
      });
      // Windows / Mac single pick
      const ctrlPick = (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.ctrlKey) || (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.metaKey);
      const shiftPick = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
      // Generate new selected keys
      let newSelectedKeys;
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys;
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = (0, _dictUtil.convertDirectoryKeysToNodes)(treeData.value, newSelectedKeys, fieldNames.value);
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(new Set([...(cachedSelectedKeys.value || []), ...(0, _dictUtil.calcRangeKeys)({
          treeData: treeData.value,
          expandedKeys: expandedKeys.value,
          startKey: key,
          endKey: lastSelectedKey.value,
          fieldNames: fieldNames.value
        })]));
        newEvent.selectedNodes = (0, _dictUtil.convertDirectoryKeysToNodes)(treeData.value, newSelectedKeys, fieldNames.value);
      } else {
        // Single click
        newSelectedKeys = [key];
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = (0, _dictUtil.convertDirectoryKeysToNodes)(treeData.value, newSelectedKeys, fieldNames.value);
      }
      emit('update:selectedKeys', newSelectedKeys);
      emit('select', newSelectedKeys, newEvent);
      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }
    };
    const onCheck = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('tree', props);
    return () => {
      const connectClassName = (0, _classNames.default)(`${prefixCls.value}-directory`, {
        [`${prefixCls.value}-directory-rtl`]: direction.value === 'rtl'
      }, attrs.class);
      const {
          icon = slots.icon,
          blockNode = true
        } = props,
        otherProps = __rest(props, ["icon", "blockNode"]);
      return (0, _vue.createVNode)(_Tree.default, (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "icon": icon || getIcon,
        "ref": treeRef,
        "blockNode": blockNode
      }, otherProps), {}, {
        "prefixCls": prefixCls.value,
        "class": connectClassName,
        "expandedKeys": expandedKeys.value,
        "selectedKeys": selectedKeys.value,
        "onSelect": onSelect,
        "onClick": onClick,
        "onDblclick": onDoubleClick,
        "onExpand": onExpand,
        "onCheck": onCheck
      }), slots);
    };
  }
});