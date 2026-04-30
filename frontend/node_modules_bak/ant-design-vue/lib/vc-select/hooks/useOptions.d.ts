import type { Ref } from 'vue';
import type { FieldNames } from '../Select';
/**
 * Parse `children` to `options` if `options` is not provided.
 * Then flatten the `options`.
 */
export default function useOptions<OptionType>(options: Ref<OptionType[]>, children: Ref<any>, fieldNames: Ref<FieldNames>): {
    options: import("vue").ShallowRef<any, any>;
    valueOptions: import("vue").ShallowRef<any, any>;
    labelOptions: import("vue").ShallowRef<any, any>;
};
