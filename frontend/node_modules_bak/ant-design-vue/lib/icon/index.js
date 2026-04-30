"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _warning = _interopRequireDefault(require("../_util/warning"));
var _type = require("../_util/type");
const Icon = () => {
  (0, _warning.default)(false, 'Icon', 'Empty Icon');
  return null;
};
Icon.displayName = 'AIcon';
var _default = exports.default = (0, _type.withInstall)(Icon);