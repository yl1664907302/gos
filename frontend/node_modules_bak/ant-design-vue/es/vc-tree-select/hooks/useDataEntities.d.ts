import type { DataEntity } from '../../vc-tree/interface';
import type { FieldNames, RawValueType } from '../TreeSelect';
import type { Ref, ShallowRef } from 'vue';
declare const _default: (treeData: ShallowRef<any>, fieldNames: Ref<FieldNames>) => {
    valueEntities: ShallowRef<Map<RawValueType, DataEntity<import("../../vc-tree/interface").DataNode>>, Map<RawValueType, DataEntity<import("../../vc-tree/interface").DataNode>>>;
    keyEntities: ShallowRef<Record<string, DataEntity<import("../../vc-tree/interface").DataNode>>, Record<string, DataEntity<import("../../vc-tree/interface").DataNode>>>;
};
export default _default;
