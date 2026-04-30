import _extends from "@babel/runtime/helpers/esm/extends";
import { filterEmpty } from './props-util';
import { cloneVNode, isVNode, Comment, Fragment, render as VueRender } from 'vue';
import warning from './warning';
export function cloneElement(vnode) {
  let nodeProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let mergeRef = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  let ele = vnode;
  if (Array.isArray(vnode)) {
    ele = filterEmpty(vnode)[0];
  }
  if (!ele) {
    return null;
  }
  const node = cloneVNode(ele, nodeProps, mergeRef);
  // cloneVNode内部是合并属性，这里改成覆盖属性
  node.props = override ? _extends(_extends({}, node.props), nodeProps) : node.props;
  warning(typeof node.props.class !== 'object', 'class must be string');
  return node;
}
export function cloneVNodes(vnodes) {
  let nodeProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  return vnodes.map(vnode => cloneElement(vnode, nodeProps, override));
}
export function deepCloneElement(vnode) {
  let nodeProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  let override = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  let mergeRef = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
  if (Array.isArray(vnode)) {
    return vnode.map(item => deepCloneElement(item, nodeProps, override, mergeRef));
  } else {
    // 需要判断是否为vnode方可进行clone操作
    if (!isVNode(vnode)) {
      return vnode;
    }
    const cloned = cloneElement(vnode, nodeProps, override, mergeRef);
    if (Array.isArray(cloned.children)) {
      cloned.children = deepCloneElement(cloned.children);
    }
    return cloned;
  }
}
export function triggerVNodeUpdate(vm, attrs, dom) {
  VueRender(cloneVNode(vm, _extends({}, attrs)), dom);
}
const ensureValidVNode = slot => {
  return (slot || []).some(child => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children)) return false;
    return true;
  }) ? slot : null;
};
export function customRenderSlot(slots, name, props, fallback) {
  var _a;
  const slot = (_a = slots[name]) === null || _a === void 0 ? void 0 : _a.call(slots, props);
  if (ensureValidVNode(slot)) {
    return slot;
  }
  return fallback === null || fallback === void 0 ? void 0 : fallback();
}