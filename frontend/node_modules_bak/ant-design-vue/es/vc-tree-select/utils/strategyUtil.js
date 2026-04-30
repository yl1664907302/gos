import { isCheckDisabled } from './valueUtil';
export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_PARENT = 'SHOW_PARENT';
export const SHOW_CHILD = 'SHOW_CHILD';
export function formatStrategyValues(values, strategy, keyEntities, fieldNames) {
  const valueSet = new Set(values);
  if (strategy === SHOW_CHILD) {
    return values.filter(key => {
      const entity = keyEntities[key];
      if (entity && entity.children && entity.children.some(_ref => {
        let {
          node
        } = _ref;
        return valueSet.has(node[fieldNames.value]);
      }) && entity.children.every(_ref2 => {
        let {
          node
        } = _ref2;
        return isCheckDisabled(node) || valueSet.has(node[fieldNames.value]);
      })) {
        return false;
      }
      return true;
    });
  }
  if (strategy === SHOW_PARENT) {
    return values.filter(key => {
      const entity = keyEntities[key];
      const parent = entity ? entity.parent : null;
      if (parent && !isCheckDisabled(parent.node) && valueSet.has(parent.key)) {
        return false;
      }
      return true;
    });
  }
  return values;
}