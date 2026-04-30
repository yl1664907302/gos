"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flattenToken = flattenToken;
exports.supportLayer = supportLayer;
exports.supportLogicProps = supportLogicProps;
exports.supportWhere = supportWhere;
exports.token2key = token2key;
var _hash = _interopRequireDefault(require("@emotion/hash"));
var _dynamicCSS = require("../../vc-util/Dom/dynamicCSS");
var _canUseDom = _interopRequireDefault(require("../canUseDom"));
var _theme = require("./theme");
// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap();
function flattenToken(token) {
  let str = flattenTokenCache.get(token) || '';
  if (!str) {
    Object.keys(token).forEach(key => {
      const value = token[key];
      str += key;
      if (value instanceof _theme.Theme) {
        str += value.id;
      } else if (value && typeof value === 'object') {
        str += flattenToken(value);
      } else {
        str += value;
      }
    });
    // Put in cache
    flattenTokenCache.set(token, str);
  }
  return str;
}
/**
 * Convert derivative token to key string
 */
function token2key(token, salt) {
  return (0, _hash.default)(`${salt}_${flattenToken(token)}`);
}
const randomSelectorKey = `random-${Date.now()}-${Math.random()}`.replace(/\./g, '');
// Magic `content` for detect selector support
const checkContent = '_bAmBoO_';
function supportSelector(styleStr, handleElement, supportCheck) {
  var _a, _b;
  if ((0, _canUseDom.default)()) {
    (0, _dynamicCSS.updateCSS)(styleStr, randomSelectorKey);
    const ele = document.createElement('div');
    ele.style.position = 'fixed';
    ele.style.left = '0';
    ele.style.top = '0';
    handleElement === null || handleElement === void 0 ? void 0 : handleElement(ele);
    document.body.appendChild(ele);
    if (process.env.NODE_ENV !== 'production') {
      ele.innerHTML = 'Test';
      ele.style.zIndex = '9999999';
    }
    const support = supportCheck ? supportCheck(ele) : (_a = getComputedStyle(ele).content) === null || _a === void 0 ? void 0 : _a.includes(checkContent);
    (_b = ele.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(ele);
    (0, _dynamicCSS.removeCSS)(randomSelectorKey);
    return support;
  }
  return false;
}
let canLayer = undefined;
function supportLayer() {
  if (canLayer === undefined) {
    canLayer = supportSelector(`@layer ${randomSelectorKey} { .${randomSelectorKey} { content: "${checkContent}"!important; } }`, ele => {
      ele.className = randomSelectorKey;
    });
  }
  return canLayer;
}
let canWhere = undefined;
function supportWhere() {
  if (canWhere === undefined) {
    canWhere = supportSelector(`:where(.${randomSelectorKey}) { content: "${checkContent}"!important; }`, ele => {
      ele.className = randomSelectorKey;
    });
  }
  return canWhere;
}
let canLogic = undefined;
function supportLogicProps() {
  if (canLogic === undefined) {
    canLogic = supportSelector(`.${randomSelectorKey} { inset-block: 93px !important; }`, ele => {
      ele.className = randomSelectorKey;
    }, ele => getComputedStyle(ele).bottom === '93px');
  }
  return canLogic;
}