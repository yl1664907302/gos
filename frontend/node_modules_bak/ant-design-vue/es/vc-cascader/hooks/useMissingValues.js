import { computed } from 'vue';
import { toPathOptions } from '../utils/treeUtil';
export default ((options, fieldNames, rawValues) => {
  return computed(() => {
    const missingValues = [];
    const existsValues = [];
    rawValues.value.forEach(valueCell => {
      const pathOptions = toPathOptions(valueCell, options.value, fieldNames.value);
      if (pathOptions.every(opt => opt.option)) {
        existsValues.push(valueCell);
      } else {
        missingValues.push(valueCell);
      }
    });
    return [existsValues, missingValues];
  });
});