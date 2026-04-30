import { conductCheck } from '../../vc-tree/utils/conductUtil';
import { shallowRef, watchEffect } from 'vue';
export default ((rawLabeledValues, rawHalfCheckedValues, treeConduction, keyEntities, maxLevel, levelEntities) => {
  const newRawCheckedValues = shallowRef([]);
  const newRawHalfCheckedValues = shallowRef([]);
  watchEffect(() => {
    let checkedKeys = rawLabeledValues.value.map(_ref => {
      let {
        value
      } = _ref;
      return value;
    });
    let halfCheckedKeys = rawHalfCheckedValues.value.map(_ref2 => {
      let {
        value
      } = _ref2;
      return value;
    });
    const missingValues = checkedKeys.filter(key => !keyEntities.value[key]);
    if (treeConduction.value) {
      ({
        checkedKeys,
        halfCheckedKeys
      } = conductCheck(checkedKeys, true, keyEntities.value, maxLevel.value, levelEntities.value));
    }
    newRawCheckedValues.value = Array.from(new Set([...missingValues, ...checkedKeys]));
    newRawHalfCheckedValues.value = halfCheckedKeys;
  });
  return [newRawCheckedValues, newRawHalfCheckedValues];
});