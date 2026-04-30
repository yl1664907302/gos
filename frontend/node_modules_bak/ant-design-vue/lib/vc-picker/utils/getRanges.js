"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRanges;
var _vue = require("vue");
function getRanges(_ref) {
  let {
    prefixCls,
    components = {},
    needConfirmButton,
    onNow,
    onOk,
    okDisabled,
    showNow,
    locale
  } = _ref;
  let presetNode;
  let okNode;
  if (needConfirmButton) {
    const Button = components.button || 'button';
    if (onNow && showNow !== false) {
      presetNode = (0, _vue.createVNode)("li", {
        "class": `${prefixCls}-now`
      }, [(0, _vue.createVNode)("a", {
        "class": `${prefixCls}-now-btn`,
        "onClick": onNow
      }, [locale.now])]);
    }
    okNode = needConfirmButton && (0, _vue.createVNode)("li", {
      "class": `${prefixCls}-ok`
    }, [(0, _vue.createVNode)(Button, {
      "disabled": okDisabled,
      "onClick": e => {
        e.stopPropagation();
        onOk && onOk();
      }
    }, {
      default: () => [locale.ok]
    })]);
  }
  if (!presetNode && !okNode) {
    return null;
  }
  return (0, _vue.createVNode)("ul", {
    "class": `${prefixCls}-ranges`
  }, [presetNode, okNode]);
}