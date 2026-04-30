import type { ShallowRef } from 'vue';
import type { BasicDataNode, DataEntity, DataNode, Key } from './interface';
export default function useMaxLevel<TreeDataType extends BasicDataNode = DataNode>(keyEntities: ShallowRef<Record<Key, DataEntity<TreeDataType>>>): {
    maxLevel: import("vue").Ref<number, number>;
    levelEntities: ShallowRef<Map<number, Set<DataEntity<TreeDataType>>>, Map<number, Set<DataEntity<TreeDataType>>>>;
};
