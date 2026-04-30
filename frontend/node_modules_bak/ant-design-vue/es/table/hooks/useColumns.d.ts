import type { Ref } from 'vue';
import type { ContextSlots } from '../context';
import type { TransformColumns } from '../interface';
export default function useColumns<RecordType>(contextSlots: Ref<ContextSlots>): [TransformColumns<RecordType>];
