import type { DataEntity } from '../../vc-tree/interface';
import type { DefaultOptionType, InternalFieldNames } from '../Cascader';
import type { Ref } from 'vue';
export interface OptionsInfo {
    keyEntities: Record<string, DataEntity>;
    pathKeyEntities: Record<string, DataEntity>;
}
/** Lazy parse options data into conduct-able info to avoid perf issue in single mode */
declare const _default: (options: Ref<DefaultOptionType[]>, fieldNames: Ref<InternalFieldNames>) => import("vue").ComputedRef<any>;
export default _default;
