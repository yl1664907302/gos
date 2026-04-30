import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import TreeNode from './TreeNode';
import { useInjectTreeContext } from './contextTypes';
import { computed, nextTick, defineComponent, onBeforeUnmount, onMounted, shallowRef, Transition, watch } from 'vue';
import { treeNodeProps } from './props';
import collapseMotion from '../_util/collapseMotion';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'MotionTreeNode',
  inheritAttrs: false,
  props: _extends(_extends({}, treeNodeProps), {
    active: Boolean,
    motion: Object,
    motionNodes: {
      type: Array
    },
    onMotionStart: Function,
    onMotionEnd: Function,
    motionType: String
  }),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const visible = shallowRef(true);
    const context = useInjectTreeContext();
    const motionedRef = shallowRef(false);
    const transitionProps = computed(() => {
      if (props.motion) {
        return props.motion;
      } else {
        return collapseMotion();
      }
    });
    const onMotionEnd = (node, type) => {
      var _a, _b, _c, _d;
      if (type === 'appear') {
        (_b = (_a = transitionProps.value) === null || _a === void 0 ? void 0 : _a.onAfterEnter) === null || _b === void 0 ? void 0 : _b.call(_a, node);
      } else if (type === 'leave') {
        (_d = (_c = transitionProps.value) === null || _c === void 0 ? void 0 : _c.onAfterLeave) === null || _d === void 0 ? void 0 : _d.call(_c, node);
      }
      if (!motionedRef.value) {
        props.onMotionEnd();
      }
      motionedRef.value = true;
    };
    watch(() => props.motionNodes, () => {
      if (props.motionNodes && props.motionType === 'hide' && visible.value) {
        nextTick(() => {
          visible.value = false;
        });
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    onMounted(() => {
      props.motionNodes && props.onMotionStart();
    });
    onBeforeUnmount(() => {
      props.motionNodes && onMotionEnd();
    });
    return () => {
      const {
          motion,
          motionNodes,
          motionType,
          active,
          eventKey
        } = props,
        otherProps = __rest(props, ["motion", "motionNodes", "motionType", "active", "eventKey"]);
      if (motionNodes) {
        return _createVNode(Transition, _objectSpread(_objectSpread({}, transitionProps.value), {}, {
          "appear": motionType === 'show',
          "onAfterAppear": node => onMotionEnd(node, 'appear'),
          "onAfterLeave": node => onMotionEnd(node, 'leave')
        }), {
          default: () => [_withDirectives(_createVNode("div", {
            "class": `${context.value.prefixCls}-treenode-motion`
          }, [motionNodes.map(treeNode => {
            const restProps = __rest(treeNode.data, []),
              {
                title,
                key,
                isStart,
                isEnd
              } = treeNode;
            delete restProps.children;
            return _createVNode(TreeNode, _objectSpread(_objectSpread({}, restProps), {}, {
              "title": title,
              "active": active,
              "data": treeNode.data,
              "key": key,
              "eventKey": key,
              "isStart": isStart,
              "isEnd": isEnd
            }), slots);
          })]), [[_vShow, visible.value]])]
        });
      }
      return _createVNode(TreeNode, _objectSpread(_objectSpread({
        "class": attrs.class,
        "style": attrs.style
      }, otherProps), {}, {
        "active": active,
        "eventKey": eventKey
      }), slots);
    };
  }
});