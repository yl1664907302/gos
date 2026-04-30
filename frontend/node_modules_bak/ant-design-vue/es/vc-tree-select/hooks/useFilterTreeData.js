import _extends from "@babel/runtime/helpers/esm/extends";
import { computed } from 'vue';
import { fillLegacyProps } from '../utils/legacyUtil';
export default ((treeData, searchValue, _ref) => {
  let {
    treeNodeFilterProp,
    filterTreeNode,
    fieldNames
  } = _ref;
  return computed(() => {
    const {
      children: fieldChildren
    } = fieldNames.value;
    const searchValueVal = searchValue.value;
    const treeNodeFilterPropValue = treeNodeFilterProp === null || treeNodeFilterProp === void 0 ? void 0 : treeNodeFilterProp.value;
    if (!searchValueVal || filterTreeNode.value === false) {
      return treeData.value;
    }
    let filterOptionFunc;
    if (typeof filterTreeNode.value === 'function') {
      filterOptionFunc = filterTreeNode.value;
    } else {
      const upperStr = searchValueVal.toUpperCase();
      filterOptionFunc = (_, dataNode) => {
        const value = dataNode[treeNodeFilterPropValue];
        return String(value).toUpperCase().includes(upperStr);
      };
    }
    function dig(list) {
      let keepAll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      const res = [];
      for (let index = 0, len = list.length; index < len; index++) {
        const dataNode = list[index];
        const children = dataNode[fieldChildren];
        const match = keepAll || filterOptionFunc(searchValueVal, fillLegacyProps(dataNode));
        const childList = dig(children || [], match);
        if (match || childList.length) {
          res.push(_extends(_extends({}, dataNode), {
            [fieldChildren]: childList
          }));
        }
      }
      return res;
    }
    return dig(treeData.value);
  });
});