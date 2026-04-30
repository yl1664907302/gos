import _extends from "@babel/runtime/helpers/esm/extends";
import { convertDataToEntities } from '../../vc-tree/utils/treeUtil';
import { VALUE_SPLIT } from '../utils/commonUtil';
import { computed } from 'vue';
/** Lazy parse options data into conduct-able info to avoid perf issue in single mode */
export default ((options, fieldNames) => {
  const entities = computed(() => {
    return convertDataToEntities(options.value, {
      fieldNames: fieldNames.value,
      initWrapper: wrapper => _extends(_extends({}, wrapper), {
        pathKeyEntities: {}
      }),
      processEntity: (entity, wrapper) => {
        const pathKey = entity.nodes.map(node => node[fieldNames.value.value]).join(VALUE_SPLIT);
        wrapper.pathKeyEntities[pathKey] = entity;
        // Overwrite origin key.
        // this is very hack but we need let conduct logic work with connect path
        entity.key = pathKey;
      }
    }).pathKeyEntities;
  });
  return entities;
});