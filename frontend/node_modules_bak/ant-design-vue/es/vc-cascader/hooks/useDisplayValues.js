import { toPathOptions } from '../utils/treeUtil';
import { toPathKey } from '../utils/commonUtil';
import { computed } from 'vue';
import { isValidElement } from '../../_util/props-util';
import { cloneElement } from '../../_util/vnode';
export default ((rawValues, options, fieldNames, multiple, displayRender) => {
  return computed(() => {
    const mergedDisplayRender = displayRender.value || (
    // Default displayRender
    _ref => {
      let {
        labels
      } = _ref;
      const mergedLabels = multiple.value ? labels.slice(-1) : labels;
      const SPLIT = ' / ';
      if (mergedLabels.every(label => ['string', 'number'].includes(typeof label))) {
        return mergedLabels.join(SPLIT);
      }
      // If exist non-string value, use VueNode instead
      return mergedLabels.reduce((list, label, index) => {
        const keyedLabel = isValidElement(label) ? cloneElement(label, {
          key: index
        }) : label;
        if (index === 0) {
          return [keyedLabel];
        }
        return [...list, SPLIT, keyedLabel];
      }, []);
    });
    return rawValues.value.map(valueCells => {
      const valueOptions = toPathOptions(valueCells, options.value, fieldNames.value);
      const label = mergedDisplayRender({
        labels: valueOptions.map(_ref2 => {
          let {
            option,
            value
          } = _ref2;
          var _a;
          return (_a = option === null || option === void 0 ? void 0 : option[fieldNames.value.label]) !== null && _a !== void 0 ? _a : value;
        }),
        selectedOptions: valueOptions.map(_ref3 => {
          let {
            option
          } = _ref3;
          return option;
        })
      });
      const value = toPathKey(valueCells);
      return {
        label,
        value,
        key: value,
        valueCells
      };
    });
  });
});