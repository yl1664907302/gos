"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPhantomJS = exports.isIE9 = exports.isIE = exports.isFF = exports.isEdge = exports.isChrome = exports.inBrowser = exports.UA = void 0;
/* eslint-disable no-undef */
// Browser environment sniffing
const inBrowser = exports.inBrowser = typeof window !== 'undefined';
const UA = exports.UA = inBrowser && window.navigator.userAgent.toLowerCase();
const isIE = exports.isIE = UA && /msie|trident/.test(UA);
const isIE9 = exports.isIE9 = UA && UA.indexOf('msie 9.0') > 0;
const isEdge = exports.isEdge = UA && UA.indexOf('edge/') > 0;
const isChrome = exports.isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
const isPhantomJS = exports.isPhantomJS = UA && /phantomjs/.test(UA);
const isFF = exports.isFF = UA && UA.match(/firefox\/(\d+)/);