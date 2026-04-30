"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.treeProps = exports.treeNodeProps = exports.nodeListProps = void 0;
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
const treeNodeProps = exports.treeNodeProps = {
  eventKey: [String, Number],
  prefixCls: String,
  // By parent
  // expanded: { type: Boolean, default: undefined },
  // selected: { type: Boolean, default: undefined },
  // checked: { type: Boolean, default: undefined },
  // loaded: { type: Boolean, default: undefined },
  // loading: { type: Boolean, default: undefined },
  // halfChecked: { type: Boolean, default: undefined },
  // dragOver: { type: Boolean, default: undefined },
  // dragOverGapTop: { type: Boolean, default: undefined },
  // dragOverGapBottom: { type: Boolean, default: undefined },
  // pos: String,
  title: _vueTypes.default.any,
  /** New added in Tree for easy data access */
  data: {
    type: Object,
    default: undefined
  },
  parent: {
    type: Object,
    default: undefined
  },
  isStart: {
    type: Array
  },
  isEnd: {
    type: Array
  },
  active: {
    type: Boolean,
    default: undefined
  },
  onMousemove: {
    type: Function
  },
  // By user
  isLeaf: {
    type: Boolean,
    default: undefined
  },
  checkable: {
    type: Boolean,
    default: undefined
  },
  selectable: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  disableCheckbox: {
    type: Boolean,
    default: undefined
  },
  icon: _vueTypes.default.any,
  switcherIcon: _vueTypes.default.any,
  domRef: {
    type: Function
  }
};
const nodeListProps = exports.nodeListProps = {
  prefixCls: {
    type: String
  },
  // data: { type: Array as PropType<FlattenNode[]> },
  motion: {
    type: Object
  },
  focusable: {
    type: Boolean
  },
  activeItem: {
    type: Object
  },
  focused: {
    type: Boolean
  },
  tabindex: {
    type: Number
  },
  checkable: {
    type: Boolean
  },
  selectable: {
    type: Boolean
  },
  disabled: {
    type: Boolean
  },
  // expandedKeys: { type: Array as PropType<Key[]> },
  // selectedKeys: { type: Array as PropType<Key[]> },
  // checkedKeys: { type: Array as PropType<Key[]> },
  // loadedKeys: { type: Array as PropType<Key[]> },
  // loadingKeys: { type: Array as PropType<Key[]> },
  // halfCheckedKeys: { type: Array as PropType<Key[]> },
  // keyEntities: { type: Object as PropType<Record<Key, DataEntity<DataNode>>> },
  // dragging: { type: Boolean as PropType<boolean> },
  // dragOverNodeKey: { type: [String, Number] as PropType<Key> },
  // dropPosition: { type: Number as PropType<number> },
  // Virtual list
  height: {
    type: Number
  },
  itemHeight: {
    type: Number
  },
  virtual: {
    type: Boolean
  },
  onScroll: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  },
  onActiveChange: {
    type: Function
  },
  onContextmenu: {
    type: Function
  },
  onListChangeStart: {
    type: Function
  },
  onListChangeEnd: {
    type: Function
  }
};
const treeProps = () => ({
  prefixCls: String,
  focusable: {
    type: Boolean,
    default: undefined
  },
  activeKey: [Number, String],
  tabindex: Number,
  children: _vueTypes.default.any,
  treeData: {
    type: Array
  },
  fieldNames: {
    type: Object
  },
  showLine: {
    type: [Boolean, Object],
    default: undefined
  },
  showIcon: {
    type: Boolean,
    default: undefined
  },
  icon: _vueTypes.default.any,
  selectable: {
    type: Boolean,
    default: undefined
  },
  expandAction: [String, Boolean],
  disabled: {
    type: Boolean,
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: undefined
  },
  checkable: {
    type: Boolean,
    default: undefined
  },
  checkStrictly: {
    type: Boolean,
    default: undefined
  },
  draggable: {
    type: [Function, Boolean]
  },
  defaultExpandParent: {
    type: Boolean,
    default: undefined
  },
  autoExpandParent: {
    type: Boolean,
    default: undefined
  },
  defaultExpandAll: {
    type: Boolean,
    default: undefined
  },
  defaultExpandedKeys: {
    type: Array
  },
  expandedKeys: {
    type: Array
  },
  defaultCheckedKeys: {
    type: Array
  },
  checkedKeys: {
    type: [Object, Array]
  },
  defaultSelectedKeys: {
    type: Array
  },
  selectedKeys: {
    type: Array
  },
  allowDrop: {
    type: Function
  },
  dropIndicatorRender: {
    type: Function
  },
  onFocus: {
    type: Function
  },
  onBlur: {
    type: Function
  },
  onKeydown: {
    type: Function
  },
  onContextmenu: {
    type: Function
  },
  onClick: {
    type: Function
  },
  onDblclick: {
    type: Function
  },
  onScroll: {
    type: Function
  },
  onExpand: {
    type: Function
  },
  onCheck: {
    type: Function
  },
  onSelect: {
    type: Function
  },
  onLoad: {
    type: Function
  },
  loadData: {
    type: Function
  },
  loadedKeys: {
    type: Array
  },
  onMouseenter: {
    type: Function
  },
  onMouseleave: {
    type: Function
  },
  onRightClick: {
    type: Function
  },
  onDragstart: {
    type: Function
  },
  onDragenter: {
    type: Function
  },
  onDragover: {
    type: Function
  },
  onDragleave: {
    type: Function
  },
  onDragend: {
    type: Function
  },
  onDrop: {
    type: Function
  },
  /**
   * Used for `rc-tree-select` only.
   * Do not use in your production code directly since this will be refactor.
   */
  onActiveChange: {
    type: Function
  },
  filterTreeNode: {
    type: Function
  },
  motion: _vueTypes.default.any,
  switcherIcon: _vueTypes.default.any,
  // Virtual List
  height: Number,
  itemHeight: Number,
  virtual: {
    type: Boolean,
    default: undefined
  },
  // direction for drag logic
  direction: {
    type: String
  },
  rootClassName: String,
  rootStyle: Object
});
exports.treeProps = treeProps;