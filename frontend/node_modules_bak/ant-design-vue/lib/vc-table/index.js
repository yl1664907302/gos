"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Column", {
  enumerable: true,
  get: function () {
    return _Column.default;
  }
});
Object.defineProperty(exports, "ColumnGroup", {
  enumerable: true,
  get: function () {
    return _ColumnGroup.default;
  }
});
Object.defineProperty(exports, "EXPAND_COLUMN", {
  enumerable: true,
  get: function () {
    return _constant.EXPAND_COLUMN;
  }
});
Object.defineProperty(exports, "INTERNAL_COL_DEFINE", {
  enumerable: true,
  get: function () {
    return _legacyUtil.INTERNAL_COL_DEFINE;
  }
});
Object.defineProperty(exports, "Summary", {
  enumerable: true,
  get: function () {
    return _Footer.FooterComponents;
  }
});
Object.defineProperty(exports, "SummaryCell", {
  enumerable: true,
  get: function () {
    return _Footer.SummaryCell;
  }
});
Object.defineProperty(exports, "SummaryRow", {
  enumerable: true,
  get: function () {
    return _Footer.SummaryRow;
  }
});
exports.default = void 0;
var _Table = _interopRequireDefault(require("./Table"));
var _Footer = require("./Footer");
var _Column = _interopRequireDefault(require("./sugar/Column"));
var _ColumnGroup = _interopRequireDefault(require("./sugar/ColumnGroup"));
var _legacyUtil = require("./utils/legacyUtil");
var _constant = require("./constant");
// base rc-table@7.22.2
var _default = exports.default = _Table.default;