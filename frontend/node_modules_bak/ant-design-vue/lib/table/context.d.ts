import type { ComputedRef } from 'vue';
import type { ColumnType } from './interface';
export type ContextSlots = {
    emptyText?: (...args: any[]) => any;
    expandIcon?: (...args: any[]) => any;
    title?: (...args: any[]) => any;
    footer?: (...args: any[]) => any;
    summary?: (...args: any[]) => any;
    bodyCell?: (...args: any[]) => any;
    expandColumnTitle?: (...args: any[]) => any;
    headerCell?: (...args: any[]) => any;
    customFilterIcon?: (...args: any[]) => any;
    customFilterDropdown?: (...args: any[]) => any;
    [key: string]: ((...args: any[]) => any) | undefined;
};
type SlotsContextProps = ComputedRef<ContextSlots>;
export declare const useProvideSlots: (props: SlotsContextProps) => void;
export declare const useInjectSlots: () => SlotsContextProps;
type ContextProps = {
    onResizeColumn: (w: number, column: ColumnType<any>) => void;
};
export declare const useProvideTableContext: (props: ContextProps) => void;
export declare const useInjectTableContext: () => ContextProps;
export {};
