import { createVNode as _createVNode } from "vue";
import useMergeProps from '../hooks/useMergeProps';
import { useInjectPanel } from '../PanelContext';
const HIDDEN_STYLE = {
  visibility: 'hidden'
};
function Header(_props, _ref) {
  let {
    slots
  } = _ref;
  var _a;
  const props = useMergeProps(_props);
  const {
    prefixCls,
    prevIcon = '\u2039',
    nextIcon = '\u203A',
    superPrevIcon = '\u00AB',
    superNextIcon = '\u00BB',
    onSuperPrev,
    onSuperNext,
    onPrev,
    onNext
  } = props;
  const {
    hideNextBtn,
    hidePrevBtn
  } = useInjectPanel();
  return _createVNode("div", {
    "class": prefixCls
  }, [onSuperPrev && _createVNode("button", {
    "type": "button",
    "onClick": onSuperPrev,
    "tabindex": -1,
    "class": `${prefixCls}-super-prev-btn`,
    "style": hidePrevBtn.value ? HIDDEN_STYLE : {}
  }, [superPrevIcon]), onPrev && _createVNode("button", {
    "type": "button",
    "onClick": onPrev,
    "tabindex": -1,
    "class": `${prefixCls}-prev-btn`,
    "style": hidePrevBtn.value ? HIDDEN_STYLE : {}
  }, [prevIcon]), _createVNode("div", {
    "class": `${prefixCls}-view`
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), onNext && _createVNode("button", {
    "type": "button",
    "onClick": onNext,
    "tabindex": -1,
    "class": `${prefixCls}-next-btn`,
    "style": hideNextBtn.value ? HIDDEN_STYLE : {}
  }, [nextIcon]), onSuperNext && _createVNode("button", {
    "type": "button",
    "onClick": onSuperNext,
    "tabindex": -1,
    "class": `${prefixCls}-super-next-btn`,
    "style": hideNextBtn.value ? HIDDEN_STYLE : {}
  }, [superNextIcon])]);
}
Header.displayName = 'Header';
Header.inheritAttrs = false;
export default Header;