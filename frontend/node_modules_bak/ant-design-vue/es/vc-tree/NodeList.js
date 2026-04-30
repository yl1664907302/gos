import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
/**
 * Handle virtual list of the TreeNodes.
 */
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent, ref, shallowRef, watch } from 'vue';
import VirtualList from '../vc-virtual-list';
import omit from '../_util/omit';
import { useInjectKeysState, useInjectTreeContext } from './contextTypes';
import MotionTreeNode from './MotionTreeNode';
import { nodeListProps } from './props';
import { findExpandedKeys, getExpandRange } from './utils/diffUtil';
import { getKey } from './utils/treeUtil';
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
export const MOTION_KEY = `RC_TREE_MOTION_${Math.random()}`;
const MotionNode = {
  key: MOTION_KEY
};
export const MotionEntity = {
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
export function getMinimumRangeTransitionRange(list, virtual, height, itemHeight) {
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
  return getKey(key, pos);
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
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'NodeList',
  inheritAttrs: false,
  props: nodeListProps,
  setup(props, _ref) {
    let {
      expose,
      attrs
    } = _ref;
    // =============================== Ref ================================
    const listRef = ref();
    const indentMeasurerRef = ref();
    const {
      expandedKeys,
      flattenNodes
    } = useInjectKeysState();
    expose({
      scrollTo: scroll => {
        listRef.value.scrollTo(scroll);
      },
      getIndentWidth: () => indentMeasurerRef.value.offsetWidth
    });
    // ============================== Motion ==============================
    const transitionData = shallowRef(flattenNodes.value);
    const transitionRange = shallowRef([]);
    const motionType = ref(null);
    function onMotionEnd() {
      transitionData.value = flattenNodes.value;
      transitionRange.value = [];
      motionType.value = null;
      props.onListChangeEnd();
    }
    const context = useInjectTreeContext();
    watch([() => expandedKeys.value.slice(), flattenNodes], (_ref2, _ref3) => {
      let [expandedKeys, data] = _ref2;
      let [prevExpandedKeys, prevData] = _ref3;
      const diffExpanded = findExpandedKeys(prevExpandedKeys, expandedKeys);
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
          const rangeNodes = getMinimumRangeTransitionRange(getExpandRange(prevData, data, diffExpanded.key), virtual, height, itemHeight);
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
          const rangeNodes = getMinimumRangeTransitionRange(getExpandRange(data, prevData, diffExpanded.key), virtual, height, itemHeight);
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
    watch(() => context.value.dragging, dragging => {
      if (!dragging) {
        onMotionEnd();
      }
    });
    const mergedData = computed(() => props.motion === undefined ? transitionData.value : flattenNodes.value);
    const onActiveChange = () => {
      props.onActiveChange(null);
    };
    return () => {
      const _a = _extends(_extends({}, props), attrs),
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
      return _createVNode(_Fragment, null, [focused && activeItem && _createVNode("span", {
        "style": HIDDEN_STYLE,
        "aria-live": "assertive"
      }, [getAccessibilityPath(activeItem)]), _createVNode("div", null, [_createVNode("input", {
        "style": HIDDEN_STYLE,
        "disabled": focusable === false || disabled,
        "tabindex": focusable !== false ? tabindex : null,
        "onKeydown": onKeydown,
        "onFocus": onFocus,
        "onBlur": onBlur,
        "value": "",
        "onChange": noop,
        "aria-label": "for screen reader"
      }, null)]), _createVNode("div", {
        "class": `${prefixCls}-treenode`,
        "aria-hidden": true,
        "style": {
          position: 'absolute',
          pointerEvents: 'none',
          visibility: 'hidden',
          height: 0,
          overflow: 'hidden'
        }
      }, [_createVNode("div", {
        "class": `${prefixCls}-indent`
      }, [_createVNode("div", {
        "ref": indentMeasurerRef,
        "class": `${prefixCls}-indent-unit`
      }, null)])]), _createVNode(VirtualList, _objectSpread(_objectSpread({}, omit(domProps, ['onActiveChange'])), {}, {
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
          const mergedKey = getKey(key, pos);
          delete restProps.key;
          delete restProps.children;
          return _createVNode(MotionTreeNode, _objectSpread(_objectSpread({}, restProps), {}, {
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