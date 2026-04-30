import type { ColumnType } from '../interface';
import type { FunctionalComponent } from 'vue';
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
export type ColumnGroupProps<RecordType> = ColumnType<RecordType>;
declare const ColumnGroup: {
    <T>(arg: T): FunctionalComponent<ColumnGroupProps<T>>;
};
export default ColumnGroup;
