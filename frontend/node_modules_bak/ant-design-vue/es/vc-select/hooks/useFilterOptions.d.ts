import type { FieldNames, DefaultOptionType, SelectProps } from '../Select';
import type { Ref, ShallowRef } from 'vue';
declare const _default: (options: ShallowRef<DefaultOptionType[]>, fieldNames: Ref<FieldNames>, searchValue?: Ref<string>, filterOption?: Ref<SelectProps['filterOption']>, optionFilterProp?: Ref<string>) => import("vue").ComputedRef<DefaultOptionType[]>;
export default _default;
