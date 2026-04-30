import type { FunctionalComponent } from 'vue';
import type { ColumnType } from '../interface';
export type ColumnProps<RecordType> = ColumnType<RecordType>;
/**
 * This is a syntactic sugar for `columns` prop.
 * So HOC will not work on this.
 */
declare const Column: {
    <T>(arg: T): FunctionalComponent<ColumnProps<T>>;
};
export default Column;
