import { watch, shallowRef } from 'vue';
export default function useLazyKVMap(dataRef, childrenColumnNameRef, getRowKeyRef) {
  const mapCacheRef = shallowRef({});
  watch([dataRef, childrenColumnNameRef, getRowKeyRef], () => {
    const kvMap = new Map();
    const getRowKey = getRowKeyRef.value;
    const childrenColumnName = childrenColumnNameRef.value;
    /* eslint-disable no-inner-declarations */
    function dig(records) {
      records.forEach((record, index) => {
        const rowKey = getRowKey(record, index);
        kvMap.set(rowKey, record);
        if (record && typeof record === 'object' && childrenColumnName in record) {
          dig(record[childrenColumnName] || []);
        }
      });
    }
    /* eslint-enable */
    dig(dataRef.value);
    mapCacheRef.value = {
      kvMap
    };
  }, {
    deep: true,
    immediate: true
  });
  function getRecordByKey(key) {
    return mapCacheRef.value.kvMap.get(key);
  }
  return [getRecordByKey];
}