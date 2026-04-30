import type { Ref } from 'vue';
import type { TablePaginationConfig } from '../interface';
export declare const DEFAULT_PAGE_SIZE = 10;
export declare function getPaginationParam(mergedPagination: TablePaginationConfig, pagination: TablePaginationConfig | boolean | undefined): any;
export default function usePagination(totalRef: Ref<number>, paginationRef: Ref<TablePaginationConfig | false | undefined>, onChange: (current: number, pageSize: number) => void): [Ref<TablePaginationConfig>, () => void];
