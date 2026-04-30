"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _class = require("../vc-util/Dom/class");
const collapseMotion = function () {
  let name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'ant-motion-collapse';
  let appear = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return {
    name,
    appear,
    css: true,
    onBeforeEnter: node => {
      node.style.height = '0px';
      node.style.opacity = '0';
      (0, _class.addClass)(node, name);
    },
    onEnter: node => {
      (0, _vue.nextTick)(() => {
        node.style.height = `${node.scrollHeight}px`;
        node.style.opacity = '1';
      });
    },
    onAfterEnter: node => {
      if (node) {
        (0, _class.removeClass)(node, name);
        node.style.height = null;
        node.style.opacity = null;
      }
    },
    onBeforeLeave: node => {
      (0, _class.addClass)(node, name);
      node.style.height = `${node.offsetHeight}px`;
      node.style.opacity = null;
    },
    onLeave: node => {
      setTimeout(() => {
        node.style.height = '0px';
        node.style.opacity = '0';
      });
    },
    onAfterLeave: node => {
      if (node) {
        (0, _class.removeClass)(node, name);
        if (node.style) {
          node.style.height = null;
          node.style.opacity = null;
        }
      }
    }
  };
};
var _default = exports.default = collapseMotion;