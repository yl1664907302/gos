import type { Ref } from 'vue';
import type { TransformColumns, ColumnTitleProps } from '../interface';
export default function useTitleColumns<RecordType>(columnTitleProps: Ref<ColumnTitleProps<RecordType>>): [TransformColumns<RecordType>];
