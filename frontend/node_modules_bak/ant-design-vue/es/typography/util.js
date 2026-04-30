import { createVNode as _createVNode } from "vue";
import { createApp } from 'vue';
import { styleToString } from '../vc-util/Dom/css';
// We only handle element & text node.
const TEXT_NODE = 3;
const COMMENT_NODE = 8;
let ellipsisContainer;
const wrapperStyle = {
  padding: 0,
  margin: 0,
  display: 'inline',
  lineHeight: 'inherit'
};
function resetDomStyles(target, origin) {
  target.setAttribute('aria-hidden', 'true');
  const originStyle = window.getComputedStyle(origin);
  const originCSS = styleToString(originStyle);
  // Set shadow
  target.setAttribute('style', originCSS);
  target.style.position = 'fixed';
  target.style.left = '0';
  target.style.height = 'auto';
  target.style.minHeight = 'auto';
  target.style.maxHeight = 'auto';
  target.style.paddingTop = '0';
  target.style.paddingBottom = '0';
  target.style.borderTopWidth = '0';
  target.style.borderBottomWidth = '0';
  target.style.top = '-999999px';
  target.style.zIndex = '-1000';
  // clean up css overflow
  target.style.textOverflow = 'clip';
  target.style.whiteSpace = 'normal';
  target.style.webkitLineClamp = 'none';
}
function getRealLineHeight(originElement) {
  const heightContainer = document.createElement('div');
  resetDomStyles(heightContainer, originElement);
  heightContainer.appendChild(document.createTextNode('text'));
  document.body.appendChild(heightContainer);
  // The element real height is always less than multiple of line-height
  // Use getBoundingClientRect to get actual single row height of the element
  const realHeight = heightContainer.getBoundingClientRect().height;
  document.body.removeChild(heightContainer);
  return realHeight;
}
export default ((originElement, option, content, fixedContent, ellipsisStr) => {
  if (!ellipsisContainer) {
    ellipsisContainer = document.createElement('div');
    ellipsisContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ellipsisContainer);
  }
  const {
    rows,
    suffix = ''
  } = option;
  const lineHeight = getRealLineHeight(originElement);
  const maxHeight = Math.round(lineHeight * rows * 100) / 100;
  resetDomStyles(ellipsisContainer, originElement);
  // Render in the fake container
  const vm = createApp({
    render() {
      return _createVNode("div", {
        "style": wrapperStyle
      }, [_createVNode("span", {
        "style": wrapperStyle
      }, [content, suffix]), _createVNode("span", {
        "style": wrapperStyle
      }, [fixedContent])]);
    }
  });
  vm.mount(ellipsisContainer);
  // Check if ellipsis in measure div is height enough for content
  function inRange() {
    const currentHeight = Math.round(ellipsisContainer.getBoundingClientRect().height * 100) / 100;
    return currentHeight - 0.1 <= maxHeight; // -.1 for firefox
  }
  // Skip ellipsis if already match
  if (inRange()) {
    vm.unmount();
    return {
      content,
      text: ellipsisContainer.innerHTML,
      ellipsis: false
    };
  }
  const childNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[0].cloneNode(true).childNodes).filter(_ref => {
    let {
      nodeType,
      data
    } = _ref;
    return nodeType !== COMMENT_NODE && data !== '';
  });
  const fixedNodes = Array.prototype.slice.apply(ellipsisContainer.childNodes[0].childNodes[1].cloneNode(true).childNodes);
  vm.unmount();
  // ========================= Find match ellipsis content =========================
  const ellipsisChildren = [];
  ellipsisContainer.innerHTML = '';
  // Create origin content holder
  const ellipsisContentHolder = document.createElement('span');
  ellipsisContainer.appendChild(ellipsisContentHolder);
  const ellipsisTextNode = document.createTextNode(ellipsisStr + suffix);
  ellipsisContentHolder.appendChild(ellipsisTextNode);
  fixedNodes.forEach(childNode => {
    ellipsisContainer.appendChild(childNode);
  });
  // Append before fixed nodes
  function appendChildNode(node) {
    ellipsisContentHolder.insertBefore(node, ellipsisTextNode);
  }
  // Get maximum text
  function measureText(textNode, fullText) {
    let startLoc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    let endLoc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : fullText.length;
    let lastSuccessLoc = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
    const midLoc = Math.floor((startLoc + endLoc) / 2);
    const currentText = fullText.slice(0, midLoc);
    textNode.textContent = currentText;
    if (startLoc >= endLoc - 1) {
      // Loop when step is small
      for (let step = endLoc; step >= startLoc; step -= 1) {
        const currentStepText = fullText.slice(0, step);
        textNode.textContent = currentStepText;
        if (inRange() || !currentStepText) {
          return step === fullText.length ? {
            finished: false,
            vNode: fullText
          } : {
            finished: true,
            vNode: currentStepText
          };
        }
      }
    }
    if (inRange()) {
      return measureText(textNode, fullText, midLoc, endLoc, midLoc);
    }
    return measureText(textNode, fullText, startLoc, midLoc, lastSuccessLoc);
  }
  function measureNode(childNode) {
    const type = childNode.nodeType;
    // console.log('type', type);
    // if (type === ELEMENT_NODE) {
    //   // We don't split element, it will keep if whole element can be displayed.
    //   appendChildNode(childNode);
    //   if (inRange()) {
    //     return {
    //       finished: false,
    //       vNode: contentList[index],
    //     };
    //   }
    //   // Clean up if can not pull in
    //   ellipsisContentHolder.removeChild(childNode);
    //   return {
    //     finished: true,
    //     vNode: null,
    //   };
    // }
    if (type === TEXT_NODE) {
      const fullText = childNode.textContent || '';
      const textNode = document.createTextNode(fullText);
      appendChildNode(textNode);
      return measureText(textNode, fullText);
    }
    // Not handle other type of content
    return {
      finished: false,
      vNode: null
    };
  }
  childNodes.some(childNode => {
    const {
      finished,
      vNode
    } = measureNode(childNode);
    if (vNode) {
      ellipsisChildren.push(vNode);
    }
    return finished;
  });
  return {
    content: ellipsisChildren,
    text: ellipsisContainer.innerHTML,
    ellipsis: true
  };
});