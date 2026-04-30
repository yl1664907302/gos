import { filterEmpty } from '../_util/props-util';
const isValid = value => {
  return value !== undefined && value !== null && (Array.isArray(value) ? filterEmpty(value).length : true);
};
export function hasPrefixSuffix(propsAndSlots) {
  return isValid(propsAndSlots.prefix) || isValid(propsAndSlots.suffix) || isValid(propsAndSlots.allowClear);
}
export function hasAddon(propsAndSlots) {
  return isValid(propsAndSlots.addonBefore) || isValid(propsAndSlots.addonAfter);
}