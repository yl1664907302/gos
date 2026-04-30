"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.canUseDom = canUseDom;
exports.injectCSS = injectCSS;
exports.removeCSS = removeCSS;
exports.clearContainerCache = clearContainerCache;
exports.updateCSS = updateCSS;

function canUseDom() {
  return !!(typeof window !== 'undefined' && window.document && window.document.createElement);
}

function contains(root, n) {
  if (!root) {
    return false;
  } // Use native if support


  if (root.contains) {
    return root.contains(n);
  }

  return false;
}

var APPEND_ORDER = 'data-vc-order';
var MARK_KEY = "vc-icon-key";
var containerCache = new Map();

function getMark() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      mark = _ref.mark;

  if (mark) {
    return mark.startsWith('data-') ? mark : "data-".concat(mark);
  }

  return MARK_KEY;
}

function getContainer(option) {
  if (option.attachTo) {
    return option.attachTo;
  }

  var head = document.querySelector('head');
  return head || document.body;
}

function getOrder(prepend) {
  if (prepend === 'queue') {
    return 'prependQueue';
  }

  return prepend ? 'prepend' : 'append';
}
/**
 * Find style which inject by rc-util
 */


function findStyles(container) {
  return Array.from((containerCache.get(container) || container).children).filter(function (node) {
    return node.tagName === 'STYLE';
  });
}

function injectCSS(css) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (!canUseDom()) {
    return null;
  }

  var csp = option.csp,
      prepend = option.prepend;
  var styleNode = document.createElement('style');
  styleNode.setAttribute(APPEND_ORDER, getOrder(prepend));

  if (csp && csp.nonce) {
    styleNode.nonce = csp.nonce;
  }

  styleNode.innerHTML = css;
  var container = getContainer(option);
  var firstChild = container.firstChild;

  if (prepend) {
    // If is queue `prepend`, it will prepend first style and then append rest style
    if (prepend === 'queue') {
      var existStyle = findStyles(container).filter(function (node) {
        return ['prepend', 'prependQueue'].includes(node.getAttribute(APPEND_ORDER));
      });

      if (existStyle.length) {
        container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
        return styleNode;
      }
    } // Use `insertBefore` as `prepend`


    container.insertBefore(styleNode, firstChild);
  } else {
    container.appendChild(styleNode);
  }

  return styleNode;
}

function findExistNode(key) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var container = getContainer(option);
  return findStyles(container).find(function (node) {
    return node.getAttribute(getMark(option)) === key;
  });
}

function removeCSS(key) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var existNode = findExistNode(key, option);

  if (existNode) {
    var container = getContainer(option);
    container.removeChild(existNode);
  }
}
/**
 * qiankun will inject `appendChild` to insert into other
 */


function syncRealContainer(container, option) {
  var cachedRealContainer = containerCache.get(container); // Find real container when not cached or cached container removed

  if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
    var placeholderStyle = injectCSS('', option);
    var parentNode = placeholderStyle.parentNode;
    containerCache.set(container, parentNode);
    container.removeChild(placeholderStyle);
  }
}
/**
 * manually clear container cache to avoid global cache in unit testes
 */


function clearContainerCache() {
  containerCache.clear();
}

function updateCSS(css, key) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var container = getContainer(option); // Sync real parent

  syncRealContainer(container, option);
  var existNode = findExistNode(key, option);

  if (existNode) {
    if (option.csp && option.csp.nonce && existNode.nonce !== option.csp.nonce) {
      existNode.nonce = option.csp.nonce;
    }

    if (existNode.innerHTML !== css) {
      existNode.innerHTML = css;
    }

    return existNode;
  }

  var newNode = injectCSS(css, option);
  newNode.setAttribute(getMark(option), key);
  return newNode;
}