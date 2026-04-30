import type { Ref, ShallowRef } from 'vue';
import type { DefaultOptionType, InternalFieldName, TreeSelectProps } from '../TreeSelect';
declare const _default: (treeData: ShallowRef<DefaultOptionType[]>, searchValue: Ref<string>, { treeNodeFilterProp, filterTreeNode, fieldNames, }: {
    fieldNames: Ref<InternalFieldName>;
    treeNodeFilterProp: Ref<string>;
    filterTreeNode: Ref<TreeSelectProps['filterTreeNode']>;
}) => import("vue").ComputedRef<any[]>;
export default _default;
