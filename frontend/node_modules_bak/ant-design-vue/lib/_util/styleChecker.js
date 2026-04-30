"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.detectFlexGapSupported = exports.default = exports.canUseDocElement = void 0;
exports.isStyleSupport = isStyleSupport;
var _canUseDom = _interopRequireDefault(require("./canUseDom"));
const canUseDocElement = () => (0, _canUseDom.default)() && window.document.documentElement;
exports.canUseDocElement = canUseDocElement;
const isStyleNameSupport = styleName => {
  if ((0, _canUseDom.default)() && window.document.documentElement) {
    const styleNameList = Array.isArray(styleName) ? styleName : [styleName];
    const {
      documentElement
    } = window.document;
    return styleNameList.some(name => name in documentElement.style);
  }
  return false;
};
const isStyleValueSupport = (styleName, value) => {
  if (!isStyleNameSupport(styleName)) {
    return false;
  }
  const ele = document.createElement('div');
  const origin = ele.style[styleName];
  ele.style[styleName] = value;
  return ele.style[styleName] !== origin;
};
function isStyleSupport(styleName, styleValue) {
  if (!Array.isArray(styleName) && styleValue !== undefined) {
    return isStyleValueSupport(styleName, styleValue);
  }
  return isStyleNameSupport(styleName);
}
let flexGapSupported;
const detectFlexGapSupported = () => {
  if (!canUseDocElement()) {
    return false;
  }
  if (flexGapSupported !== undefined) {
    return flexGapSupported;
  }
  // create flex container with row-gap set
  const flex = document.createElement('div');
  flex.style.display = 'flex';
  flex.style.flexDirection = 'column';
  flex.style.rowGap = '1px';
  // create two, elements inside it
  flex.appendChild(document.createElement('div'));
  flex.appendChild(document.createElement('div'));
  // append to the DOM (needed to obtain scrollHeight)
  document.body.appendChild(flex);
  flexGapSupported = flex.scrollHeight === 1; // flex container should be 1px high from the row-gap
  document.body.removeChild(flex);
  return flexGapSupported;
};
exports.detectFlexGapSupported = detectFlexGapSupported;
var _default = exports.default = isStyleSupport;