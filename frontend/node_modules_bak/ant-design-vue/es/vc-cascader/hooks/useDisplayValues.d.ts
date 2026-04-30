import type { DefaultOptionType, SingleValueType, BaseCascaderProps, InternalFieldNames } from '../Cascader';
import type { Ref } from 'vue';
declare const _default: (rawValues: Ref<SingleValueType[]>, options: Ref<DefaultOptionType[]>, fieldNames: Ref<InternalFieldNames>, multiple: Ref<boolean>, displayRender: Ref<BaseCascaderProps['displayRender']>) => import("vue").ComputedRef<{
    label: any;
    value: string;
    key: string;
    valueCells: SingleValueType;
}[]>;
export default _default;
