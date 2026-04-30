"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _useMergeProps = _interopRequireDefault(require("../hooks/useMergeProps"));
var _PanelContext = require("../PanelContext");
const HIDDEN_STYLE = {
  visibility: 'hidden'
};
function Header(_props, _ref) {
  let {
    slots
  } = _ref;
  var _a;
  const props = (0, _useMergeProps.default)(_props);
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
  } = (0, _PanelContext.useInjectPanel)();
  return (0, _vue.createVNode)("div", {
    "class": prefixCls
  }, [onSuperPrev && (0, _vue.createVNode)("button", {
    "type": "button",
    "onClick": onSuperPrev,
    "tabindex": -1,
    "class": `${prefixCls}-super-prev-btn`,
    "style": hidePrevBtn.value ? HIDDEN_STYLE : {}
  }, [superPrevIcon]), onPrev && (0, _vue.createVNode)("button", {
    "type": "button",
    "onClick": onPrev,
    "tabindex": -1,
    "class": `${prefixCls}-prev-btn`,
    "style": hidePrevBtn.value ? HIDDEN_STYLE : {}
  }, [prevIcon]), (0, _vue.createVNode)("div", {
    "class": `${prefixCls}-view`
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), onNext && (0, _vue.createVNode)("button", {
    "type": "button",
    "onClick": onNext,
    "tabindex": -1,
    "class": `${prefixCls}-next-btn`,
    "style": hideNextBtn.value ? HIDDEN_STYLE : {}
  }, [nextIcon]), onSuperNext && (0, _vue.createVNode)("button", {
    "type": "button",
    "onClick": onSuperNext,
    "tabindex": -1,
    "class": `${prefixCls}-super-next-btn`,
    "style": hideNextBtn.value ? HIDDEN_STYLE : {}
  }, [superNextIcon])]);
}
Header.displayName = 'Header';
Header.inheritAttrs = false;
var _default = exports.default = Header;