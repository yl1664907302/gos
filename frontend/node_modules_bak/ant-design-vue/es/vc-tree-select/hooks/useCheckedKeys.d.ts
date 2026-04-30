import type { Key } from '../../_util/type';
import type { DataEntity } from '../../vc-tree/interface';
import type { LabeledValueType, RawValueType } from '../TreeSelect';
import type { Ref, ShallowRef } from 'vue';
declare const _default: (rawLabeledValues: ShallowRef<LabeledValueType[]>, rawHalfCheckedValues: ShallowRef<LabeledValueType[]>, treeConduction: Ref<boolean>, keyEntities: Ref<Record<Key, DataEntity>>, maxLevel: Ref<number>, levelEntities: ShallowRef<Map<number, Set<DataEntity>>>) => ShallowRef<RawValueType[], RawValueType[]>[];
export default _default;
