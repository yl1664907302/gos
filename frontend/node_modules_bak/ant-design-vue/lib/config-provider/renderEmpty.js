"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.DefaultRenderEmpty = void 0;
var _vue = require("vue");
var _empty = _interopRequireDefault(require("../empty"));
var _useConfigInject = _interopRequireDefault(require("./hooks/useConfigInject"));
const DefaultRenderEmpty = props => {
  const {
    prefixCls
  } = (0, _useConfigInject.default)('empty', props);
  const renderHtml = componentName => {
    switch (componentName) {
      case 'Table':
      case 'List':
        return (0, _vue.createVNode)(_empty.default, {
          "image": _empty.default.PRESENTED_IMAGE_SIMPLE
        }, null);
      case 'Select':
      case 'TreeSelect':
      case 'Cascader':
      case 'Transfer':
      case 'Mentions':
        return (0, _vue.createVNode)(_empty.default, {
          "image": _empty.default.PRESENTED_IMAGE_SIMPLE,
          "class": `${prefixCls.value}-small`
        }, null);
      default:
        return (0, _vue.createVNode)(_empty.default, null, null);
    }
  };
  return renderHtml(props.componentName);
};
exports.DefaultRenderEmpty = DefaultRenderEmpty;
function renderEmpty(componentName) {
  return (0, _vue.createVNode)(DefaultRenderEmpty, {
    "componentName": componentName
  }, null);
}
var _default = exports.default = renderEmpty;