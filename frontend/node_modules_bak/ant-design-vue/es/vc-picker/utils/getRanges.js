import { createVNode as _createVNode } from "vue";
export default function getRanges(_ref) {
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
      presetNode = _createVNode("li", {
        "class": `${prefixCls}-now`
      }, [_createVNode("a", {
        "class": `${prefixCls}-now-btn`,
        "onClick": onNow
      }, [locale.now])]);
    }
    okNode = needConfirmButton && _createVNode("li", {
      "class": `${prefixCls}-ok`
    }, [_createVNode(Button, {
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
  return _createVNode("ul", {
    "class": `${prefixCls}-ranges`
  }, [presetNode, okNode]);
}