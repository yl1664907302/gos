import { computed } from 'vue';
// recursion (flat tree structure)
function flatRecord(record, indent, childrenColumnName, expandedKeys, getRowKey, index) {
  const arr = [];
  arr.push({
    record,
    indent,
    index
  });
  const key = getRowKey(record);
  const expanded = expandedKeys === null || expandedKeys === void 0 ? void 0 : expandedKeys.has(key);
  if (record && Array.isArray(record[childrenColumnName]) && expanded) {
    // expanded state, flat record
    for (let i = 0; i < record[childrenColumnName].length; i += 1) {
      const tempArr = flatRecord(record[childrenColumnName][i], indent + 1, childrenColumnName, expandedKeys, getRowKey, i);
      arr.push(...tempArr);
    }
  }
  return arr;
}
/**
 * flat tree data on expanded state
 *
 * @export
 * @template T
 * @param {*} data : table data
 * @param {string} childrenColumnName : 指定树形结构的列名
 * @param {Set<Key>} expandedKeys : 展开的行对应的keys
 * @param {GetRowKey<T>} getRowKey  : 获取当前rowKey的方法
 * @returns flattened data
 */
export default function useFlattenRecords(dataRef, childrenColumnNameRef, expandedKeysRef, getRowKey) {
  const arr = computed(() => {
    const childrenColumnName = childrenColumnNameRef.value;
    const expandedKeys = expandedKeysRef.value;
    const data = dataRef.value;
    if (expandedKeys === null || expandedKeys === void 0 ? void 0 : expandedKeys.size) {
      const temp = [];
      // collect flattened record
      for (let i = 0; i < (data === null || data === void 0 ? void 0 : data.length); i += 1) {
        const record = data[i];
        temp.push(...flatRecord(record, 0, childrenColumnName, expandedKeys, getRowKey.value, i));
      }
      return temp;
    }
    return data === null || data === void 0 ? void 0 : data.map((item, index) => {
      return {
        record: item,
        indent: 0,
        index
      };
    });
  });
  return arr;
}