import _extends from "@babel/runtime/helpers/esm/extends";
import { convertDataToEntities } from '../../vc-tree/utils/treeUtil';
import { isNil } from '../utils/valueUtil';
import { shallowRef, watchEffect } from 'vue';
import { warning } from '../../vc-util/warning';
export default ((treeData, fieldNames) => {
  const valueEntities = shallowRef(new Map());
  const keyEntities = shallowRef({});
  watchEffect(() => {
    const fieldNamesValue = fieldNames.value;
    const collection = convertDataToEntities(treeData.value, {
      fieldNames: fieldNamesValue,
      initWrapper: wrapper => _extends(_extends({}, wrapper), {
        valueEntities: new Map()
      }),
      processEntity: (entity, wrapper) => {
        const val = entity.node[fieldNamesValue.value];
        // Check if exist same value
        if (process.env.NODE_ENV !== 'production') {
          const key = entity.node.key;
          warning(!isNil(val), 'TreeNode `value` is invalidate: undefined');
          warning(!wrapper.valueEntities.has(val), `Same \`value\` exist in the tree: ${val}`);
          warning(!key || String(key) === String(val), `\`key\` or \`value\` with TreeNode must be the same or you can remove one of them. key: ${key}, value: ${val}.`);
        }
        wrapper.valueEntities.set(val, entity);
      }
    });
    valueEntities.value = collection.valueEntities;
    keyEntities.value = collection.keyEntities;
  });
  return {
    valueEntities,
    keyEntities
  };
});