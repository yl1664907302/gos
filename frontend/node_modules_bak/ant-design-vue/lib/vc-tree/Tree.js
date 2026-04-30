"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _contextTypes = require("./contextTypes");
var _util = require("./util");
var _treeUtil = require("./utils/treeUtil");
var _NodeList = _interopRequireWildcard(require("./NodeList"));
var _conductUtil = require("./utils/conductUtil");
var _DropIndicator = _interopRequireDefault(require("./DropIndicator"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _props = require("./props");
var _warning = require("../vc-util/warning");
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _useMaxLevel = _interopRequireDefault(require("./useMaxLevel"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const MAX_RETRY_TIMES = 10;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Tree',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)((0, _props.treeProps)(), {
    prefixCls: 'vc-tree',
    showLine: false,
    showIcon: true,
    selectable: true,
    multiple: false,
    checkable: false,
    disabled: false,
    checkStrictly: false,
    draggable: false,
    expandAction: false,
    defaultExpandParent: true,
    autoExpandParent: false,
    defaultExpandAll: false,
    defaultExpandedKeys: [],
    defaultCheckedKeys: [],
    defaultSelectedKeys: [],
    dropIndicatorRender: _DropIndicator.default,
    allowDrop: () => true
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose
    } = _ref;
    const destroyed = (0, _vue.shallowRef)(false);
    let delayedDragEnterLogic = {};
    const indent = (0, _vue.shallowRef)();
    const selectedKeys = (0, _vue.shallowRef)([]);
    const checkedKeys = (0, _vue.shallowRef)([]);
    const halfCheckedKeys = (0, _vue.shallowRef)([]);
    const loadedKeys = (0, _vue.shallowRef)([]);
    const loadingKeys = (0, _vue.shallowRef)([]);
    const expandedKeys = (0, _vue.shallowRef)([]);
    const loadingRetryTimes = {};
    const dragState = (0, _vue.reactive)({
      draggingNodeKey: null,
      dragChildrenKeys: [],
      // dropTargetKey is the key of abstract-drop-node
      // the abstract-drop-node is the real drop node when drag and drop
      // not the DOM drag over node
      dropTargetKey: null,
      dropPosition: null,
      dropContainerKey: null,
      dropLevelOffset: null,
      dropTargetPos: null,
      dropAllowed: true,
      // the abstract-drag-over-node
      // if mouse is on the bottom of top dom node or no the top of the bottom dom node
      // abstract-drag-over-node is the top node
      dragOverNodeKey: null
    });
    const treeData = (0, _vue.shallowRef)([]);
    (0, _vue.watch)([() => props.treeData, () => props.children], () => {
      treeData.value = props.treeData !== undefined ? props.treeData.slice() : (0, _treeUtil.convertTreeToData)((0, _vue.toRaw)(props.children));
    }, {
      immediate: true,
      deep: true
    });
    const keyEntities = (0, _vue.shallowRef)({});
    const focused = (0, _vue.shallowRef)(false);
    const activeKey = (0, _vue.shallowRef)(null);
    const listChanging = (0, _vue.shallowRef)(false);
    const fieldNames = (0, _vue.computed)(() => (0, _treeUtil.fillFieldNames)(props.fieldNames));
    const listRef = (0, _vue.shallowRef)();
    let dragStartMousePosition = null;
    let dragNode = null;
    let currentMouseOverDroppableNodeKey = null;
    const treeNodeRequiredProps = (0, _vue.computed)(() => {
      return {
        expandedKeysSet: expandedKeysSet.value,
        selectedKeysSet: selectedKeysSet.value,
        loadedKeysSet: loadedKeysSet.value,
        loadingKeysSet: loadingKeysSet.value,
        checkedKeysSet: checkedKeysSet.value,
        halfCheckedKeysSet: halfCheckedKeysSet.value,
        dragOverNodeKey: dragState.dragOverNodeKey,
        dropPosition: dragState.dropPosition,
        keyEntities: keyEntities.value
      };
    });
    const expandedKeysSet = (0, _vue.computed)(() => {
      return new Set(expandedKeys.value);
    });
    const selectedKeysSet = (0, _vue.computed)(() => {
      return new Set(selectedKeys.value);
    });
    const loadedKeysSet = (0, _vue.computed)(() => {
      return new Set(loadedKeys.value);
    });
    const loadingKeysSet = (0, _vue.computed)(() => {
      return new Set(loadingKeys.value);
    });
    const checkedKeysSet = (0, _vue.computed)(() => {
      return new Set(checkedKeys.value);
    });
    const halfCheckedKeysSet = (0, _vue.computed)(() => {
      return new Set(halfCheckedKeys.value);
    });
    (0, _vue.watchEffect)(() => {
      if (treeData.value) {
        const entitiesMap = (0, _treeUtil.convertDataToEntities)(treeData.value, {
          fieldNames: fieldNames.value
        });
        keyEntities.value = (0, _extends2.default)({
          [_NodeList.MOTION_KEY]: _NodeList.MotionEntity
        }, entitiesMap.keyEntities);
      }
    });
    let init = false; // 处理 defaultXxxx api, 仅仅首次有效
    (0, _vue.watch)([() => props.expandedKeys, () => props.autoExpandParent, keyEntities],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_ref2, _ref3) => {
      let [_newKeys, newAutoExpandParent] = _ref2;
      let [_oldKeys, oldAutoExpandParent] = _ref3;
      let keys = expandedKeys.value;
      // ================ expandedKeys =================
      if (props.expandedKeys !== undefined || init && newAutoExpandParent !== oldAutoExpandParent) {
        keys = props.autoExpandParent || !init && props.defaultExpandParent ? (0, _util.conductExpandParent)(props.expandedKeys, keyEntities.value) : props.expandedKeys;
      } else if (!init && props.defaultExpandAll) {
        const cloneKeyEntities = (0, _extends2.default)({}, keyEntities.value);
        delete cloneKeyEntities[_NodeList.MOTION_KEY];
        keys = Object.keys(cloneKeyEntities).map(key => cloneKeyEntities[key].key);
      } else if (!init && props.defaultExpandedKeys) {
        keys = props.autoExpandParent || props.defaultExpandParent ? (0, _util.conductExpandParent)(props.defaultExpandedKeys, keyEntities.value) : props.defaultExpandedKeys;
      }
      if (keys) {
        expandedKeys.value = keys;
      }
      init = true;
    }, {
      immediate: true
    });
    // ================ flattenNodes =================
    const flattenNodes = (0, _vue.shallowRef)([]);
    (0, _vue.watchEffect)(() => {
      flattenNodes.value = (0, _treeUtil.flattenTreeData)(treeData.value, expandedKeys.value, fieldNames.value);
    });
    // ================ selectedKeys =================
    (0, _vue.watchEffect)(() => {
      if (props.selectable) {
        if (props.selectedKeys !== undefined) {
          selectedKeys.value = (0, _util.calcSelectedKeys)(props.selectedKeys, props);
        } else if (!init && props.defaultSelectedKeys) {
          selectedKeys.value = (0, _util.calcSelectedKeys)(props.defaultSelectedKeys, props);
        }
      }
    });
    const {
      maxLevel,
      levelEntities
    } = (0, _useMaxLevel.default)(keyEntities);
    // ================= checkedKeys =================
    (0, _vue.watchEffect)(() => {
      if (props.checkable) {
        let checkedKeyEntity;
        if (props.checkedKeys !== undefined) {
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.checkedKeys) || {};
        } else if (!init && props.defaultCheckedKeys) {
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.defaultCheckedKeys) || {};
        } else if (treeData.value) {
          // If `treeData` changed, we also need check it
          checkedKeyEntity = (0, _util.parseCheckedKeys)(props.checkedKeys) || {
            checkedKeys: checkedKeys.value,
            halfCheckedKeys: halfCheckedKeys.value
          };
        }
        if (checkedKeyEntity) {
          let {
            checkedKeys: newCheckedKeys = [],
            halfCheckedKeys: newHalfCheckedKeys = []
          } = checkedKeyEntity;
          if (!props.checkStrictly) {
            const conductKeys = (0, _conductUtil.conductCheck)(newCheckedKeys, true, keyEntities.value, maxLevel.value, levelEntities.value);
            ({
              checkedKeys: newCheckedKeys,
              halfCheckedKeys: newHalfCheckedKeys
            } = conductKeys);
          }
          checkedKeys.value = newCheckedKeys;
          halfCheckedKeys.value = newHalfCheckedKeys;
        }
      }
    });
    // ================= loadedKeys ==================
    (0, _vue.watchEffect)(() => {
      if (props.loadedKeys) {
        loadedKeys.value = props.loadedKeys;
      }
    });
    const resetDragState = () => {
      (0, _extends2.default)(dragState, {
        dragOverNodeKey: null,
        dropPosition: null,
        dropLevelOffset: null,
        dropTargetKey: null,
        dropContainerKey: null,
        dropTargetPos: null,
        dropAllowed: false
      });
    };
    const scrollTo = scroll => {
      listRef.value.scrollTo(scroll);
    };
    (0, _vue.watch)(() => props.activeKey, () => {
      if (props.activeKey !== undefined) {
        activeKey.value = props.activeKey;
      }
    }, {
      immediate: true
    });
    (0, _vue.watch)(activeKey, val => {
      (0, _vue.nextTick)(() => {
        if (val !== null) {
          scrollTo({
            key: val
          });
        }
      });
    }, {
      immediate: true,
      flush: 'post'
    });
    // =========================== Expanded ===========================
    /** Set uncontrolled `expandedKeys`. This will also auto update `flattenNodes`. */
    const setExpandedKeys = keys => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
    };
    const cleanDragState = () => {
      if (dragState.draggingNodeKey !== null) {
        (0, _extends2.default)(dragState, {
          draggingNodeKey: null,
          dropPosition: null,
          dropContainerKey: null,
          dropTargetKey: null,
          dropLevelOffset: null,
          dropAllowed: true,
          dragOverNodeKey: null
        });
      }
      dragStartMousePosition = null;
      currentMouseOverDroppableNodeKey = null;
    };
    // if onNodeDragEnd is called, onWindowDragEnd won't be called since stopPropagation() is called
    const onNodeDragEnd = (event, node) => {
      const {
        onDragend
      } = props;
      dragState.dragOverNodeKey = null;
      cleanDragState();
      onDragend === null || onDragend === void 0 ? void 0 : onDragend({
        event,
        node: node.eventData
      });
      dragNode = null;
    };
    // since stopPropagation() is called in treeNode
    // if onWindowDrag is called, whice means state is keeped, drag state should be cleared
    const onWindowDragEnd = event => {
      onNodeDragEnd(event, null, true);
      window.removeEventListener('dragend', onWindowDragEnd);
    };
    const onNodeDragStart = (event, node) => {
      const {
        onDragstart
      } = props;
      const {
        eventKey,
        eventData
      } = node;
      dragNode = node;
      dragStartMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
      const newExpandedKeys = (0, _util.arrDel)(expandedKeys.value, eventKey);
      dragState.draggingNodeKey = eventKey;
      dragState.dragChildrenKeys = (0, _util.getDragChildrenKeys)(eventKey, keyEntities.value);
      indent.value = listRef.value.getIndentWidth();
      setExpandedKeys(newExpandedKeys);
      window.addEventListener('dragend', onWindowDragEnd);
      if (onDragstart) {
        onDragstart({
          event,
          node: eventData
        });
      }
    };
    /**
     * [Legacy] Select handler is smaller than node,
     * so that this will trigger when drag enter node or select handler.
     * This is a little tricky if customize css without padding.
     * Better for use mouse move event to refresh drag state.
     * But let's just keep it to avoid event trigger logic change.
     */
    const onNodeDragEnter = (event, node) => {
      const {
        onDragenter,
        onExpand,
        allowDrop,
        direction
      } = props;
      const {
        pos,
        eventKey
      } = node;
      // record the key of node which is latest entered, used in dragleave event.
      if (currentMouseOverDroppableNodeKey !== eventKey) {
        currentMouseOverDroppableNodeKey = eventKey;
      }
      if (!dragNode) {
        resetDragState();
        return;
      }
      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed,
        dragOverNodeKey
      } = (0, _util.calcDropPosition)(event, dragNode, node, indent.value, dragStartMousePosition, allowDrop, flattenNodes.value, keyEntities.value, expandedKeysSet.value, direction);
      if (
      // don't allow drop inside its children
      dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 ||
      // don't allow drop when drop is not allowed caculated by calcDropPosition
      !dropAllowed) {
        resetDragState();
        return;
      }
      // Side effect for delay drag
      if (!delayedDragEnterLogic) {
        delayedDragEnterLogic = {};
      }
      Object.keys(delayedDragEnterLogic).forEach(key => {
        clearTimeout(delayedDragEnterLogic[key]);
      });
      if (dragNode.eventKey !== node.eventKey) {
        // hoist expand logic here
        // since if logic is on the bottom
        // it will be blocked by abstract dragover node check
        //   => if you dragenter from top, you mouse will still be consider as in the top node
        delayedDragEnterLogic[pos] = window.setTimeout(() => {
          if (dragState.draggingNodeKey === null) return;
          let newExpandedKeys = expandedKeys.value.slice();
          const entity = keyEntities.value[node.eventKey];
          if (entity && (entity.children || []).length) {
            newExpandedKeys = (0, _util.arrAdd)(expandedKeys.value, node.eventKey);
          }
          setExpandedKeys(newExpandedKeys);
          if (onExpand) {
            onExpand(newExpandedKeys, {
              node: node.eventData,
              expanded: true,
              nativeEvent: event
            });
          }
        }, 800);
      }
      // Skip if drag node is self
      if (dragNode.eventKey === dropTargetKey && dropLevelOffset === 0) {
        resetDragState();
        return;
      }
      // Update drag over node and drag state
      (0, _extends2.default)(dragState, {
        dragOverNodeKey,
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropTargetPos,
        dropAllowed
      });
      if (onDragenter) {
        onDragenter({
          event,
          node: node.eventData,
          expandedKeys: expandedKeys.value
        });
      }
    };
    const onNodeDragOver = (event, node) => {
      const {
        onDragover,
        allowDrop,
        direction
      } = props;
      if (!dragNode) {
        return;
      }
      const {
        dropPosition,
        dropLevelOffset,
        dropTargetKey,
        dropContainerKey,
        dropAllowed,
        dropTargetPos,
        dragOverNodeKey
      } = (0, _util.calcDropPosition)(event, dragNode, node, indent.value, dragStartMousePosition, allowDrop, flattenNodes.value, keyEntities.value, expandedKeysSet.value, direction);
      if (dragState.dragChildrenKeys.indexOf(dropTargetKey) !== -1 || !dropAllowed) {
        // don't allow drop inside its children
        // don't allow drop when drop is not allowed caculated by calcDropPosition
        return;
      }
      // Update drag position
      if (dragNode.eventKey === dropTargetKey && dropLevelOffset === 0) {
        if (!(dragState.dropPosition === null && dragState.dropLevelOffset === null && dragState.dropTargetKey === null && dragState.dropContainerKey === null && dragState.dropTargetPos === null && dragState.dropAllowed === false && dragState.dragOverNodeKey === null)) {
          resetDragState();
        }
      } else if (!(dropPosition === dragState.dropPosition && dropLevelOffset === dragState.dropLevelOffset && dropTargetKey === dragState.dropTargetKey && dropContainerKey === dragState.dropContainerKey && dropTargetPos === dragState.dropTargetPos && dropAllowed === dragState.dropAllowed && dragOverNodeKey === dragState.dragOverNodeKey)) {
        (0, _extends2.default)(dragState, {
          dropPosition,
          dropLevelOffset,
          dropTargetKey,
          dropContainerKey,
          dropTargetPos,
          dropAllowed,
          dragOverNodeKey
        });
      }
      if (onDragover) {
        onDragover({
          event,
          node: node.eventData
        });
      }
    };
    const onNodeDragLeave = (event, node) => {
      // if it is outside the droppable area
      // currentMouseOverDroppableNodeKey will be updated in dragenter event when into another droppable receiver.
      if (currentMouseOverDroppableNodeKey === node.eventKey && !event.currentTarget.contains(event.relatedTarget)) {
        resetDragState();
        currentMouseOverDroppableNodeKey = null;
      }
      const {
        onDragleave
      } = props;
      if (onDragleave) {
        onDragleave({
          event,
          node: node.eventData
        });
      }
    };
    const onNodeDrop = function (event, _node) {
      let outsideTree = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _a;
      const {
        dragChildrenKeys,
        dropPosition,
        dropTargetKey,
        dropTargetPos,
        dropAllowed
      } = dragState;
      if (!dropAllowed) return;
      const {
        onDrop
      } = props;
      dragState.dragOverNodeKey = null;
      cleanDragState();
      if (dropTargetKey === null) return;
      const abstractDropNodeProps = (0, _extends2.default)((0, _extends2.default)({}, (0, _treeUtil.getTreeNodeProps)(dropTargetKey, (0, _vue.toRaw)(treeNodeRequiredProps.value))), {
        active: ((_a = activeItem.value) === null || _a === void 0 ? void 0 : _a.key) === dropTargetKey,
        data: keyEntities.value[dropTargetKey].node
      });
      const dropToChild = dragChildrenKeys.indexOf(dropTargetKey) !== -1;
      (0, _warning.warning)(!dropToChild, "Can not drop to dragNode's children node. Maybe this is a bug of ant-design-vue. Please report an issue.");
      const posArr = (0, _util.posToArr)(dropTargetPos);
      const dropResult = {
        event,
        node: (0, _treeUtil.convertNodePropsToEventData)(abstractDropNodeProps),
        dragNode: dragNode ? dragNode.eventData : null,
        dragNodesKeys: [dragNode.eventKey].concat(dragChildrenKeys),
        dropToGap: dropPosition !== 0,
        dropPosition: dropPosition + Number(posArr[posArr.length - 1])
      };
      if (!outsideTree) {
        onDrop === null || onDrop === void 0 ? void 0 : onDrop(dropResult);
      }
      dragNode = null;
    };
    const triggerExpandActionExpand = (e, treeNode) => {
      const {
        expanded,
        key
      } = treeNode;
      const node = flattenNodes.value.filter(nodeItem => nodeItem.key === key)[0];
      const eventNode = (0, _treeUtil.convertNodePropsToEventData)((0, _extends2.default)((0, _extends2.default)({}, (0, _treeUtil.getTreeNodeProps)(key, treeNodeRequiredProps.value)), {
        data: node.data
      }));
      setExpandedKeys(expanded ? (0, _util.arrDel)(expandedKeys.value, key) : (0, _util.arrAdd)(expandedKeys.value, key));
      onNodeExpand(e, eventNode);
    };
    const onNodeClick = (e, treeNode) => {
      const {
        onClick,
        expandAction
      } = props;
      if (expandAction === 'click') {
        triggerExpandActionExpand(e, treeNode);
      }
      if (onClick) {
        onClick(e, treeNode);
      }
    };
    const onNodeDoubleClick = (e, treeNode) => {
      const {
        onDblclick,
        expandAction
      } = props;
      if (expandAction === 'doubleclick' || expandAction === 'dblclick') {
        triggerExpandActionExpand(e, treeNode);
      }
      if (onDblclick) {
        onDblclick(e, treeNode);
      }
    };
    const onNodeSelect = (e, treeNode) => {
      let newSelectedKeys = selectedKeys.value;
      const {
        onSelect,
        multiple
      } = props;
      const {
        selected
      } = treeNode;
      const key = treeNode[fieldNames.value.key];
      const targetSelected = !selected;
      // Update selected keys
      if (!targetSelected) {
        newSelectedKeys = (0, _util.arrDel)(newSelectedKeys, key);
      } else if (!multiple) {
        newSelectedKeys = [key];
      } else {
        newSelectedKeys = (0, _util.arrAdd)(newSelectedKeys, key);
      }
      // [Legacy] Not found related usage in doc or upper libs
      const keyEntitiesValue = keyEntities.value;
      const selectedNodes = newSelectedKeys.map(selectedKey => {
        const entity = keyEntitiesValue[selectedKey];
        if (!entity) return null;
        return entity.node;
      }).filter(node => node);
      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }
      if (onSelect) {
        onSelect(newSelectedKeys, {
          event: 'select',
          selected: targetSelected,
          node: treeNode,
          selectedNodes,
          nativeEvent: e
        });
      }
    };
    const onNodeCheck = (e, treeNode, checked) => {
      const {
        checkStrictly,
        onCheck
      } = props;
      const key = treeNode[fieldNames.value.key];
      // Prepare trigger arguments
      let checkedObj;
      const eventObj = {
        event: 'check',
        node: treeNode,
        checked,
        nativeEvent: e
      };
      const keyEntitiesValue = keyEntities.value;
      if (checkStrictly) {
        const newCheckedKeys = checked ? (0, _util.arrAdd)(checkedKeys.value, key) : (0, _util.arrDel)(checkedKeys.value, key);
        const newHalfCheckedKeys = (0, _util.arrDel)(halfCheckedKeys.value, key);
        checkedObj = {
          checked: newCheckedKeys,
          halfChecked: newHalfCheckedKeys
        };
        eventObj.checkedNodes = newCheckedKeys.map(checkedKey => keyEntitiesValue[checkedKey]).filter(entity => entity).map(entity => entity.node);
        if (props.checkedKeys === undefined) {
          checkedKeys.value = newCheckedKeys;
        }
      } else {
        // Always fill first
        let {
          checkedKeys: newCheckedKeys,
          halfCheckedKeys: newHalfCheckedKeys
        } = (0, _conductUtil.conductCheck)([...checkedKeys.value, key], true, keyEntitiesValue, maxLevel.value, levelEntities.value);
        // If remove, we do it again to correction
        if (!checked) {
          const keySet = new Set(newCheckedKeys);
          keySet.delete(key);
          ({
            checkedKeys: newCheckedKeys,
            halfCheckedKeys: newHalfCheckedKeys
          } = (0, _conductUtil.conductCheck)(Array.from(keySet), {
            checked: false,
            halfCheckedKeys: newHalfCheckedKeys
          }, keyEntitiesValue, maxLevel.value, levelEntities.value));
        }
        checkedObj = newCheckedKeys;
        // [Legacy] This is used for vc-tree-select`
        eventObj.checkedNodes = [];
        eventObj.checkedNodesPositions = [];
        eventObj.halfCheckedKeys = newHalfCheckedKeys;
        newCheckedKeys.forEach(checkedKey => {
          const entity = keyEntitiesValue[checkedKey];
          if (!entity) return;
          const {
            node,
            pos
          } = entity;
          eventObj.checkedNodes.push(node);
          eventObj.checkedNodesPositions.push({
            node,
            pos
          });
        });
        if (props.checkedKeys === undefined) {
          checkedKeys.value = newCheckedKeys;
          halfCheckedKeys.value = newHalfCheckedKeys;
        }
      }
      if (onCheck) {
        onCheck(checkedObj, eventObj);
      }
    };
    const onNodeLoad = treeNode => {
      const key = treeNode[fieldNames.value.key];
      const loadPromise = new Promise((resolve, reject) => {
        // We need to get the latest state of loading/loaded keys
        const {
          loadData,
          onLoad
        } = props;
        if (!loadData || loadedKeysSet.value.has(key) || loadingKeysSet.value.has(key)) {
          return null;
        }
        // Process load data
        const promise = loadData(treeNode);
        promise.then(() => {
          const newLoadedKeys = (0, _util.arrAdd)(loadedKeys.value, key);
          const newLoadingKeys = (0, _util.arrDel)(loadingKeys.value, key);
          // onLoad should trigger before internal setState to avoid `loadData` trigger twice.
          // https://github.com/ant-design/ant-design/issues/12464
          if (onLoad) {
            onLoad(newLoadedKeys, {
              event: 'load',
              node: treeNode
            });
          }
          if (props.loadedKeys === undefined) {
            loadedKeys.value = newLoadedKeys;
          }
          loadingKeys.value = newLoadingKeys;
          resolve();
        }).catch(e => {
          const newLoadingKeys = (0, _util.arrDel)(loadingKeys.value, key);
          loadingKeys.value = newLoadingKeys;
          // If exceed max retry times, we give up retry
          loadingRetryTimes[key] = (loadingRetryTimes[key] || 0) + 1;
          if (loadingRetryTimes[key] >= MAX_RETRY_TIMES) {
            (0, _warning.warning)(false, 'Retry for `loadData` many times but still failed. No more retry.');
            const newLoadedKeys = (0, _util.arrAdd)(loadedKeys.value, key);
            if (props.loadedKeys === undefined) {
              loadedKeys.value = newLoadedKeys;
            }
            resolve();
          }
          reject(e);
        });
        loadingKeys.value = (0, _util.arrAdd)(loadingKeys.value, key);
      });
      // Not care warning if we ignore this
      loadPromise.catch(() => {});
      return loadPromise;
    };
    const onNodeMouseEnter = (event, node) => {
      const {
        onMouseenter
      } = props;
      if (onMouseenter) {
        onMouseenter({
          event,
          node
        });
      }
    };
    const onNodeMouseLeave = (event, node) => {
      const {
        onMouseleave
      } = props;
      if (onMouseleave) {
        onMouseleave({
          event,
          node
        });
      }
    };
    const onNodeContextMenu = (event, node) => {
      const {
        onRightClick
      } = props;
      if (onRightClick) {
        event.preventDefault();
        onRightClick({
          event,
          node
        });
      }
    };
    const onFocus = e => {
      const {
        onFocus
      } = props;
      focused.value = true;
      if (onFocus) {
        onFocus(e);
      }
    };
    const onBlur = e => {
      const {
        onBlur
      } = props;
      focused.value = false;
      onActiveChange(null);
      if (onBlur) {
        onBlur(e);
      }
    };
    const onNodeExpand = (e, treeNode) => {
      let newExpandedKeys = expandedKeys.value;
      const {
        onExpand,
        loadData
      } = props;
      const {
        expanded
      } = treeNode;
      const key = treeNode[fieldNames.value.key];
      // Do nothing when motion is in progress
      if (listChanging.value) {
        return;
      }
      // Update selected keys
      const index = newExpandedKeys.indexOf(key);
      const targetExpanded = !expanded;
      (0, _warning.warning)(expanded && index !== -1 || !expanded && index === -1, 'Expand state not sync with index check');
      if (targetExpanded) {
        newExpandedKeys = (0, _util.arrAdd)(newExpandedKeys, key);
      } else {
        newExpandedKeys = (0, _util.arrDel)(newExpandedKeys, key);
      }
      setExpandedKeys(newExpandedKeys);
      if (onExpand) {
        onExpand(newExpandedKeys, {
          node: treeNode,
          expanded: targetExpanded,
          nativeEvent: e
        });
      }
      // Async Load data
      if (targetExpanded && loadData) {
        const loadPromise = onNodeLoad(treeNode);
        if (loadPromise) {
          loadPromise.then(() => {
            // [Legacy] Refresh logic
            // const newFlattenTreeData = flattenTreeData(
            //   treeData.value,
            //   newExpandedKeys,
            //   fieldNames.value,
            // );
            // flattenNodes.value = newFlattenTreeData;
          }).catch(e => {
            const expandedKeysToRestore = (0, _util.arrDel)(expandedKeys.value, key);
            setExpandedKeys(expandedKeysToRestore);
            Promise.reject(e);
          });
        }
      }
    };
    const onListChangeStart = () => {
      listChanging.value = true;
    };
    const onListChangeEnd = () => {
      setTimeout(() => {
        listChanging.value = false;
      });
    };
    // =========================== Keyboard ===========================
    const onActiveChange = newActiveKey => {
      const {
        onActiveChange
      } = props;
      if (activeKey.value === newActiveKey) {
        return;
      }
      if (props.activeKey !== undefined) {
        activeKey.value = newActiveKey;
      }
      if (newActiveKey !== null) {
        scrollTo({
          key: newActiveKey
        });
      }
      if (onActiveChange) {
        onActiveChange(newActiveKey);
      }
    };
    const activeItem = (0, _vue.computed)(() => {
      if (activeKey.value === null) {
        return null;
      }
      return flattenNodes.value.find(_ref4 => {
        let {
          key
        } = _ref4;
        return key === activeKey.value;
      }) || null;
    });
    const offsetActiveKey = offset => {
      let index = flattenNodes.value.findIndex(_ref5 => {
        let {
          key
        } = _ref5;
        return key === activeKey.value;
      });
      // Align with index
      if (index === -1 && offset < 0) {
        index = flattenNodes.value.length;
      }
      index = (index + offset + flattenNodes.value.length) % flattenNodes.value.length;
      const item = flattenNodes.value[index];
      if (item) {
        const {
          key
        } = item;
        onActiveChange(key);
      } else {
        onActiveChange(null);
      }
    };
    const activeItemEventNode = (0, _vue.computed)(() => {
      return (0, _treeUtil.convertNodePropsToEventData)((0, _extends2.default)((0, _extends2.default)({}, (0, _treeUtil.getTreeNodeProps)(activeKey.value, treeNodeRequiredProps.value)), {
        data: activeItem.value.data,
        active: true
      }));
    });
    const onKeydown = event => {
      const {
        onKeydown,
        checkable,
        selectable
      } = props;
      // >>>>>>>>>> Direction
      switch (event.which) {
        case _KeyCode.default.UP:
          {
            offsetActiveKey(-1);
            event.preventDefault();
            break;
          }
        case _KeyCode.default.DOWN:
          {
            offsetActiveKey(1);
            event.preventDefault();
            break;
          }
      }
      // >>>>>>>>>> Expand & Selection
      const item = activeItem.value;
      if (item && item.data) {
        const expandable = item.data.isLeaf === false || !!(item.data.children || []).length;
        const eventNode = activeItemEventNode.value;
        switch (event.which) {
          // >>> Expand
          case _KeyCode.default.LEFT:
            {
              // Collapse if possible
              if (expandable && expandedKeysSet.value.has(activeKey.value)) {
                onNodeExpand({}, eventNode);
              } else if (item.parent) {
                onActiveChange(item.parent.key);
              }
              event.preventDefault();
              break;
            }
          case _KeyCode.default.RIGHT:
            {
              // Expand if possible
              if (expandable && !expandedKeysSet.value.has(activeKey.value)) {
                onNodeExpand({}, eventNode);
              } else if (item.children && item.children.length) {
                onActiveChange(item.children[0].key);
              }
              event.preventDefault();
              break;
            }
          // Selection
          case _KeyCode.default.ENTER:
          case _KeyCode.default.SPACE:
            {
              if (checkable && !eventNode.disabled && eventNode.checkable !== false && !eventNode.disableCheckbox) {
                onNodeCheck({}, eventNode, !checkedKeysSet.value.has(activeKey.value));
              } else if (!checkable && selectable && !eventNode.disabled && eventNode.selectable !== false) {
                onNodeSelect({}, eventNode);
              }
              break;
            }
        }
      }
      if (onKeydown) {
        onKeydown(event);
      }
    };
    expose({
      onNodeExpand,
      scrollTo,
      onKeydown,
      selectedKeys: (0, _vue.computed)(() => selectedKeys.value),
      checkedKeys: (0, _vue.computed)(() => checkedKeys.value),
      halfCheckedKeys: (0, _vue.computed)(() => halfCheckedKeys.value),
      loadedKeys: (0, _vue.computed)(() => loadedKeys.value),
      loadingKeys: (0, _vue.computed)(() => loadingKeys.value),
      expandedKeys: (0, _vue.computed)(() => expandedKeys.value)
    });
    (0, _vue.onUnmounted)(() => {
      window.removeEventListener('dragend', onWindowDragEnd);
      destroyed.value = true;
    });
    (0, _contextTypes.useProvideKeysState)({
      expandedKeys,
      selectedKeys,
      loadedKeys,
      loadingKeys,
      checkedKeys,
      halfCheckedKeys,
      expandedKeysSet,
      selectedKeysSet,
      loadedKeysSet,
      loadingKeysSet,
      checkedKeysSet,
      halfCheckedKeysSet,
      flattenNodes
    });
    return () => {
      const {
        // focused,
        // flattenNodes,
        // keyEntities,
        draggingNodeKey,
        // activeKey,
        dropLevelOffset,
        dropContainerKey,
        dropTargetKey,
        dropPosition,
        dragOverNodeKey
        // indent,
      } = dragState;
      const {
        prefixCls,
        showLine,
        focusable,
        tabindex = 0,
        selectable,
        showIcon,
        icon = slots.icon,
        switcherIcon,
        draggable,
        checkable,
        checkStrictly,
        disabled,
        motion,
        loadData,
        filterTreeNode,
        height,
        itemHeight,
        virtual,
        dropIndicatorRender,
        onContextmenu,
        onScroll,
        direction,
        rootClassName,
        rootStyle
      } = props;
      const {
        class: className,
        style
      } = attrs;
      const domProps = (0, _pickAttrs.default)((0, _extends2.default)((0, _extends2.default)({}, props), attrs), {
        aria: true,
        data: true
      });
      // It's better move to hooks but we just simply keep here
      let draggableConfig;
      if (draggable) {
        if (typeof draggable === 'object') {
          draggableConfig = draggable;
        } else if (typeof draggable === 'function') {
          draggableConfig = {
            nodeDraggable: draggable
          };
        } else {
          draggableConfig = {};
        }
      } else {
        draggableConfig = false;
      }
      return (0, _vue.createVNode)(_contextTypes.TreeContext, {
        "value": {
          prefixCls,
          selectable,
          showIcon,
          icon,
          switcherIcon,
          draggable: draggableConfig,
          draggingNodeKey,
          checkable,
          customCheckable: slots.checkable,
          checkStrictly,
          disabled,
          keyEntities: keyEntities.value,
          dropLevelOffset,
          dropContainerKey,
          dropTargetKey,
          dropPosition,
          dragOverNodeKey,
          dragging: draggingNodeKey !== null,
          indent: indent.value,
          direction,
          dropIndicatorRender,
          loadData,
          filterTreeNode,
          onNodeClick,
          onNodeDoubleClick,
          onNodeExpand,
          onNodeSelect,
          onNodeCheck,
          onNodeLoad,
          onNodeMouseEnter,
          onNodeMouseLeave,
          onNodeContextMenu,
          onNodeDragStart,
          onNodeDragEnter,
          onNodeDragOver,
          onNodeDragLeave,
          onNodeDragEnd,
          onNodeDrop,
          slots
        }
      }, {
        default: () => [(0, _vue.createVNode)("div", {
          "role": "tree",
          "class": (0, _classNames.default)(prefixCls, className, rootClassName, {
            [`${prefixCls}-show-line`]: showLine,
            [`${prefixCls}-focused`]: focused.value,
            [`${prefixCls}-active-focused`]: activeKey.value !== null
          }),
          "style": rootStyle
        }, [(0, _vue.createVNode)(_NodeList.default, (0, _objectSpread2.default)({
          "ref": listRef,
          "prefixCls": prefixCls,
          "style": style,
          "disabled": disabled,
          "selectable": selectable,
          "checkable": !!checkable,
          "motion": motion,
          "height": height,
          "itemHeight": itemHeight,
          "virtual": virtual,
          "focusable": focusable,
          "focused": focused.value,
          "tabindex": tabindex,
          "activeItem": activeItem.value,
          "onFocus": onFocus,
          "onBlur": onBlur,
          "onKeydown": onKeydown,
          "onActiveChange": onActiveChange,
          "onListChangeStart": onListChangeStart,
          "onListChangeEnd": onListChangeEnd,
          "onContextmenu": onContextmenu,
          "onScroll": onScroll
        }, domProps), null)])]
      });
    };
  }
});