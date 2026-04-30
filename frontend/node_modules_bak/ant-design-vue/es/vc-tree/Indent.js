import { createVNode as _createVNode } from "vue";
const Indent = _ref => {
  let {
    prefixCls,
    level,
    isStart,
    isEnd
  } = _ref;
  const baseClassName = `${prefixCls}-indent-unit`;
  const list = [];
  for (let i = 0; i < level; i += 1) {
    list.push(_createVNode("span", {
      "key": i,
      "class": {
        [baseClassName]: true,
        [`${baseClassName}-start`]: isStart[i],
        [`${baseClassName}-end`]: isEnd[i]
      }
    }, null));
  }
  return _createVNode("span", {
    "aria-hidden": "true",
    "class": `${prefixCls}-indent`
  }, [list]);
};
export default Indent;