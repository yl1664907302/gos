import type { InjectionKey } from 'vue';
import type { ColumnType, StickyOffsets } from '../interface';
export type FlattenColumns<RecordType> = readonly (ColumnType<RecordType> & {
    scrollbar?: boolean;
})[];
type SummaryContextProps = {
    stickyOffsets?: StickyOffsets;
    scrollColumnIndex?: number;
    flattenColumns?: FlattenColumns<any>;
};
export declare const SummaryContextKey: InjectionKey<SummaryContextProps>;
export declare const useProvideSummary: (props: SummaryContextProps) => void;
export declare const useInjectSummary: () => SummaryContextProps;
export {};
