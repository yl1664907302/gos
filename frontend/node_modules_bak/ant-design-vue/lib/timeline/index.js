"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "TimelineItem", {
  enumerable: true,
  get: function () {
    return _TimelineItem.default;
  }
});
exports.default = void 0;
Object.defineProperty(exports, "timelineItemProps", {
  enumerable: true,
  get: function () {
    return _TimelineItem.timelineItemProps;
  }
});
Object.defineProperty(exports, "timelineProps", {
  enumerable: true,
  get: function () {
    return _Timeline.timelineProps;
  }
});
var _Timeline = _interopRequireWildcard(require("./Timeline"));
var _TimelineItem = _interopRequireWildcard(require("./TimelineItem"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
_Timeline.default.Item = _TimelineItem.default;
/* istanbul ignore next */
_Timeline.default.install = function (app) {
  app.component(_Timeline.default.name, _Timeline.default);
  app.component(_TimelineItem.default.name, _TimelineItem.default);
  return app;
};
var _default = exports.default = _Timeline.default;