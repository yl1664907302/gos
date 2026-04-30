import { createVNode as _createVNode } from "vue";
function Panel(_, _ref) {
  let {
    slots
  } = _ref;
  var _a;
  return _createVNode("div", null, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
}
Panel.displayName = 'Panel';
export default Panel;