"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.flexProps = void 0;
var _type = require("../_util/type");
const flexProps = () => ({
  prefixCls: (0, _type.stringType)(),
  vertical: (0, _type.booleanType)(),
  wrap: (0, _type.stringType)(),
  justify: (0, _type.stringType)(),
  align: (0, _type.stringType)(),
  flex: (0, _type.someType)([Number, String]),
  gap: (0, _type.someType)([Number, String]),
  component: (0, _type.anyType)()
});
exports.flexProps = flexProps;