"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTransitionProps = exports.getTransitionName = exports.getTransitionGroupProps = exports.getTransitionDirection = exports.collapseMotion = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _type = require("./type");
const SelectPlacements = (0, _type.tuple)('bottomLeft', 'bottomRight', 'topLeft', 'topRight');
const getTransitionDirection = placement => {
  if (placement !== undefined && (placement === 'topLeft' || placement === 'topRight')) {
    return `slide-down`;
  }
  return `slide-up`;
};
exports.getTransitionDirection = getTransitionDirection;
const getTransitionProps = function (transitionName) {
  let opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const transitionProps = transitionName ? (0, _extends2.default)({
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
  }, opt) : (0, _extends2.default)({
    css: false
  }, opt);
  return transitionProps;
};
exports.getTransitionProps = getTransitionProps;
const getTransitionGroupProps = function (transitionName) {
  let opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const transitionProps = transitionName ? (0, _extends2.default)({
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
  }, opt) : (0, _extends2.default)({
    css: false
  }, opt);
  return transitionProps;
};
// ================== Collapse Motion ==================
exports.getTransitionGroupProps = getTransitionGroupProps;
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
      (0, _vue.nextTick)(() => {
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
exports.collapseMotion = collapseMotion;
const getTransitionName = (rootPrefixCls, motion, transitionName) => {
  if (transitionName !== undefined) {
    return transitionName;
  }
  return `${rootPrefixCls}-${motion}`;
};
exports.getTransitionName = getTransitionName;