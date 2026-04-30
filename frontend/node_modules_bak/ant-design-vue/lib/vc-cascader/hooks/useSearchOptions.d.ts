import type { Ref } from 'vue';
import type { DefaultOptionType, ShowSearchType, InternalFieldNames } from '../Cascader';
export declare const SEARCH_MARK = "__rc_cascader_search_mark__";
declare const _default: (search: Ref<string>, options: Ref<DefaultOptionType[]>, fieldNames: Ref<InternalFieldNames>, prefixCls: Ref<string>, config: Ref<ShowSearchType>, changeOnSelect: Ref<boolean>) => import("vue").ComputedRef<DefaultOptionType[]>;
export default _default;
