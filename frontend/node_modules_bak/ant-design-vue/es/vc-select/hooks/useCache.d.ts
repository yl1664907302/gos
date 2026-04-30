import type { Ref } from 'vue';
import type { RawValueType } from '../BaseSelect';
import type { DefaultOptionType, LabelInValueType } from '../Select';
/**
 * Cache `value` related LabeledValue & options.
 */
declare const _default: (labeledValues: Ref<LabelInValueType[]>, valueOptions: Ref<Map<RawValueType, DefaultOptionType>>) => [Ref<LabelInValueType[], LabelInValueType[]>, (val: RawValueType) => DefaultOptionType];
export default _default;
