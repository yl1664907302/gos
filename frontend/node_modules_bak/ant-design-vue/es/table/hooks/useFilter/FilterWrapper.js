import { createVNode as _createVNode } from "vue";
import KeyCode from '../../../_util/KeyCode';
const onKeyDown = event => {
  const {
    keyCode
  } = event;
  if (keyCode === KeyCode.ENTER) {
    event.stopPropagation();
  }
};
const FilterDropdownMenuWrapper = (_props, _ref) => {
  let {
    slots
  } = _ref;
  var _a;
  return _createVNode("div", {
    "onClick": e => e.stopPropagation(),
    "onKeydown": onKeyDown
  }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
};
export default FilterDropdownMenuWrapper;