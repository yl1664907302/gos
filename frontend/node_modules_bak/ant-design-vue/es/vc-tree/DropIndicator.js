import { createVNode as _createVNode } from "vue";
export default function DropIndicator(_ref) {
  let {
    dropPosition,
    dropLevelOffset,
    indent
  } = _ref;
  const style = {
    pointerEvents: 'none',
    position: 'absolute',
    right: 0,
    backgroundColor: 'red',
    height: `${2}px`
  };
  switch (dropPosition) {
    case -1:
      style.top = 0;
      style.left = `${-dropLevelOffset * indent}px`;
      break;
    case 1:
      style.bottom = 0;
      style.left = `${-dropLevelOffset * indent}px`;
      break;
    case 0:
      style.bottom = 0;
      style.left = `${indent}`;
      break;
  }
  return _createVNode("div", {
    "style": style
  }, null);
}