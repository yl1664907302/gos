"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MotionEntity = exports.MOTION_KEY = void 0;
exports.getMinimumRangeTransitionRange = getMinimumRangeTransitionRange;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcVirtualList = _interopRequireDefault(require("../vc-virtual-list"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _contextTypes = require("./contextTypes");
var _MotionTreeNode = _interopRequireDefault(require("./MotionTreeNode"));
var _props = require("./props");
var _diffUtil = require("./utils/diffUtil");
var _treeUtil = require("./utils/treeUtil");
/**
 * Handle virtual list of the TreeNodes.
 */
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0
};
const noop = () => {};
const MOTION_KEY = exports.MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;
const MotionNode = {
  key: MOTION_KEY
};
const MotionEntity = exports.MotionEntity = {
  key: MOTION_KEY,
  level: 0,
  index: 0,
  pos: '0',
  node: MotionNode,
  nodes: [MotionNode]
};
const MotionFlattenData = {
  parent: null,
  children: [],
  pos: MotionEntity.pos,
  data: MotionNode,
  title: null,
  key: MOTION_KEY,
  /** Hold empty list here since we do not use it */
  isStart: [],
  isEnd: []
};
/**
 * We only need get visible content items to play the animation.
 */
function getMinimumRangeTransitionRange(list, virtual, height, itemHeight) {
  if (virtual === false || !height) {
    return list;
  }
  return list.slice(0, Math.ceil(height / itemHeight) + 1);
}
function itemKey(item) {
  const {
    key,
    pos
  } = item;
  return (0, _treeUtil.getKey)(key, pos);
}
function getAccessibilityPath(item) {
  let path = String(item.key);
  let current = item;
  while (current.parent) {
    current = current.parent;
    path = `${current.key} > ${path}`;
  }
  return path;
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'NodeList',
  inheritAttrs: false,
  props: _props.nodeListProps,
  setup(props, _ref) {
    let {
      expose,
      attrs
    } = _ref;
    // =============================== Ref ================================
    const listRef = (0, _vue.ref)();
    const indentMeasurerRef = (0, _vue.ref)();
    const {
      expandedKeys,
      flattenNodes
    } = (0, _contextTypes.useInjectKeysState)();
    expose({
      scrollTo: scroll => {
        listRef.value.scrollTo(scroll);
      },
      getIndentWidth: () => indentMeasurerRef.value.offsetWidth
    });
    // ============================== Motion ==============================
    const transitionData = (0, _vue.shallowRef)(flattenNodes.value);
    const transitionRange = (0, _vue.shallowRef)([]);
    const motionType = (0, _vue.ref)(null);
    function onMotionEnd() {
      transitionData.value = flattenNodes.value;
      transitionRange.value = [];
      motionType.value = null;
      props.onListChangeEnd();
    }
    const context = (0, _contextTypes.useInjectTreeContext)();
    (0, _vue.watch)([() => expandedKeys.value.slice(), flattenNodes], (_ref2, _ref3) => {
      let [expandedKeys, data] = _ref2;
      let [prevExpandedKeys, prevData] = _ref3;
      const diffExpanded = (0, _diffUtil.findExpandedKeys)(prevExpandedKeys, expandedKeys);
      if (diffExpanded.key !== null) {
        const {
          virtual,
          height,
          itemHeight
        } = props;
        if (diffExpanded.add) {
          const keyIndex = prevData.findIndex(_ref4 => {
            let {
              key
            } = _ref4;
            return key === diffExpanded.key;
          });
          const rangeNodes = getMinimumRangeTransitionRange((0, _diffUtil.getExpandRange)(prevData, data, diffExpanded.key), virtual, height, itemHeight);
          const newTransitionData = prevData.slice();
          newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);
          transitionData.value = newTransitionData;
          transitionRange.value = rangeNodes;
          motionType.value = 'show';
        } else {
          const keyIndex = data.findIndex(_ref5 => {
            let {
              key
            } = _ref5;
            return key === diffExpanded.key;
          });
          const rangeNodes = getMinimumRangeTransitionRange((0, _diffUtil.getExpandRange)(data, prevData, diffExpanded.key), virtual, height, itemHeight);
          const newTransitionData = data.slice();
          newTransitionData.splice(keyIndex + 1, 0, MotionFlattenData);
          transitionData.value = newTransitionData;
          transitionRange.value = rangeNodes;
          motionType.value = 'hide';
        }
      } else if (prevData !== data) {
        transitionData.value = data;
      }
    });
    // We should clean up motion if is changed by dragging
    (0, _vue.watch)(() => context.value.dragging, dragging => {
      if (!dragging) {
        onMotionEnd();
      }
    });
    const mergedData = (0, _vue.computed)(() => props.motion === undefined ? transitionData.value : flattenNodes.value);
    const onActiveChange = () => {
      props.onActiveChange(null);
    };
    return () => {
      const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          prefixCls,
          selectable,
          checkable,
          disabled,
          motion,
          height,
          itemHeight,
          virtual,
          focusable,
          activeItem,
          focused,
          tabindex,
          onKeydown,
          onFocus,
          onBlur,
          onListChangeStart,
          onListChangeEnd
        } = _a,
        domProps = __rest(_a, ["prefixCls", "selectable", "checkable", "disabled", "motion", "height", "itemHeight", "virtual", "focusable", "activeItem", "focused", "tabindex", "onKeydown", "onFocus", "onBlur", "onListChangeStart", "onListChangeEnd"]);
      return (0, _vue.createVNode)(_vue.Fragment, null, [focused && activeItem && (0, _vue.createVNode)("span", {
        "style": HIDDEN_STYLE,
        "aria-live": "assertive"
      }, [getAccessibilityPath(activeItem)]), (0, _vue.createVNode)("div", null, [(0, _vue.createVNode)("input", {
        "style": HIDDEN_STYLE,
        "disabled": focusable === false || disabled,
        "tabindex": focusable !== false ? tabindex : null,
        "onKeydown": onKeydown,
        "onFocus": onFocus,
        "onBlur": onBlur,
        "value": "",
        "onChange": noop,
        "aria-label": "for screen reader"
      }, null)]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-treenode`,
        "aria-hidden": true,
        "style": {
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden'
        }
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-indent`
      }, [(0, _vue.createVNode)("div", {
        "ref": indentMeasurerRef,
        "class": `${prefixCls}-indent-unit`
      }, null)])]), (0, _vue.createVNode)(_vcVirtualList.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(domProps, ['onActiveChange'])), {}, {
        "data": mergedData.value,
        "itemKey": itemKey,
        "height": height,
        "fullHeight": false,
        "virtual": virtual,
        "itemHeight": itemHeight,
        "prefixCls": `${prefixCls}-list`,
        "ref": listRef,
        "onVisibleChange": (originList, fullList) => {
          const originSet = new Set(originList);
          const restList = fullList.filter(item => !originSet.has(item));
          // Motion node is not render. Skip motion
          if (restList.some(item => itemKey(item) === MOTION_KEY)) {
            onMotionEnd();
          }
        }
      }), {
        default: treeNode => {
          const {
              pos
            } = treeNode,
            restProps = __rest(treeNode.data, []),
            {
              title,
              key,
              isStart,
              isEnd
            } = treeNode;
          const mergedKey = (0, _treeUtil.getKey)(key, pos);
          delete restProps.key;
          delete restProps.children;
          return (0, _vue.createVNode)(_MotionTreeNode.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, restProps), {}, {
            "eventKey": mergedKey,
            "title": title,
            "active": !!activeItem && key === activeItem.key,
            "data": treeNode.data,
            "isStart": isStart,
            "isEnd": isEnd,
            "motion": motion,
            "motionNodes": key === MOTION_KEY ? transitionRange.value : null,
            "motionType": motionType.value,
            "onMotionStart": onListChangeStart,
            "onMotionEnd": onMotionEnd,
            "onMousemove": onActiveChange
          }), null);
        }
      })]);
    };
  }
});