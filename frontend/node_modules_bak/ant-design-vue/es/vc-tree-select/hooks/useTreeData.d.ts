import type { Ref, ShallowRef } from 'vue';
import type { DataNode, SimpleModeConfig } from '../interface';
import type { DefaultOptionType } from '../TreeSelect';
import type { VueNode } from '../../_util/type';
/**
 * Convert `treeData` or `children` into formatted `treeData`.
 * Will not re-calculate if `treeData` or `children` not change.
 */
export default function useTreeData(treeData: Ref<DataNode[]>, children: Ref<VueNode[]>, simpleMode: Ref<boolean | SimpleModeConfig>): ShallowRef<DefaultOptionType[]>;
