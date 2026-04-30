import type { FunctionalComponent } from 'vue';
export interface RowProps {
    prefixCls: string;
    vertical: boolean;
    row: any[];
    bordered: boolean;
    colon: boolean;
    index: number;
}
declare const Row: FunctionalComponent<RowProps>;
export default Row;
