import { createVNode as _createVNode } from "vue";
export default function getExtraFooter(prefixCls, mode, renderExtraFooter) {
  if (!renderExtraFooter) {
    return null;
  }
  return _createVNode("div", {
    "class": `${prefixCls}-footer-extra`
  }, [renderExtraFooter(mode)]);
}