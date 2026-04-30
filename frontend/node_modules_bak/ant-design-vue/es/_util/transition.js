import _extends from "@babel/runtime/helpers/esm/extends";
import { nextTick } from 'vue';
import { tuple } from './type';
const SelectPlacements = tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight');
const getTransitionDirection = placement => {
  if (placement !== undefined && (placement === 'topLeft' || placement === 'topRight')) {
    return `slide-down`;
  }
  return `slide-up`;
};
export const getTransitionProps = function (transitionName) {
  let opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const transitionProps = transitionName ? _extends({
    name: transitionName,
    appear: true,
    // type: 'animation',
    // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
    // appearActiveClass: `antdv-base-transtion`,
    // appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-enter ${transitionName}-enter-prepare ${transitionName}-enter-start`,
    enterActiveClass: `${transitionName}-enter ${transitionName}-enter-prepare`,
    enterToClass: `${transitionName}-enter ${transitionName}-enter-active`,
    leaveFromClass: ` ${transitionName}-leave`,
    leaveActiveClass: `${transitionName}-leave ${transitionName}-leave-active`,
    leaveToClass: `${transitionName}-leave ${transitionName}-leave-active`
  }, opt) : _extends({
    css: false
  }, opt);
  return transitionProps;
};
export const getTransitionGroupProps = function (transitionName) {
  let opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const transitionProps = transitionName ? _extends({
    name: transitionName,
    appear: true,
    // appearFromClass: `${transitionName}-appear ${transitionName}-appear-prepare`,
    appearActiveClass: `${transitionName}`,
    appearToClass: `${transitionName}-appear ${transitionName}-appear-active`,
    enterFromClass: `${transitionName}-appear ${transitionName}-enter ${transitionName}-appear-prepare ${transitionName}-enter-prepare`,
    enterActiveClass: `${transitionName}`,
    enterToClass: `${transitionName}-enter ${transitionName}-appear ${transitionName}-appear-active ${transitionName}-enter-active`,
    leaveActiveClass: `${transitionName} ${transitionName}-leave`,
    leaveToClass: `${transitionName}-leave-active`
  }, opt) : _extends({
    css: false
  }, opt);
  return transitionProps;
};
// ================== Collapse Motion ==================
const getCollapsedHeight = () => ({
  height: 0,
  opacity: 0
});
const getRealHeight = node => ({
  height: `${node.scrollHeight}px`,
  opacity: 1
});
const getCurrentHeight = node => ({
  height: `${node.offsetHeight}px`
});
const collapseMotion = function () {
  let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ant-motion-collapse';
  let style = arguments.length > 1 ? arguments[1] : undefined;
  let className = arguments.length > 2 ? arguments[2] : undefined;
  return {
    name,
    appear: true,
    css: true,
    onBeforeEnter: node => {
      className.value = name;
      style.value = getCollapsedHeight(node);
    },
    onEnter: node => {
      nextTick(() => {
        style.value = getRealHeight(node);
      });
    },
    onAfterEnter: () => {
      className.value = '';
      style.value = {};
    },
    onBeforeLeave: node => {
      className.value = name;
      style.value = getCurrentHeight(node);
    },
    onLeave: node => {
      setTimeout(() => {
        style.value = getCollapsedHeight(node);
      });
    },
    onAfterLeave: () => {
      className.value = '';
      style.value = {};
    }
  };
};
const getTransitionName = (rootPrefixCls, motion, transitionName) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};
export { collapseMotion, getTransitionName, getTransitionDirection };