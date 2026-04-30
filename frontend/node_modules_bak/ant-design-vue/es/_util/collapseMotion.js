import { nextTick } from 'vue';
import { addClass, removeClass } from '../vc-util/Dom/class';
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
      addClass(node, name);
    },
    onEnter: node => {
      nextTick(() => {
        node.style.height = `${node.scrollHeight}px`;
        node.style.opacity = '1';
      });
    },
    onAfterEnter: node => {
      if (node) {
        removeClass(node, name);
        node.style.height = null;
        node.style.opacity = null;
      }
    },
    onBeforeLeave: node => {
      addClass(node, name);
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
        removeClass(node, name);
        if (node.style) {
          node.style.height = null;
          node.style.opacity = null;
        }
      }
    }
  };
};
export default collapseMotion;