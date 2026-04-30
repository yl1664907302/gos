import type { InjectionKey } from 'vue';
import type { GetComponent, TransformCellText } from '../interface';
import type { FixedInfo } from '../utils/fixUtil';
export interface TableContextProps {
    prefixCls: string;
    getComponent: GetComponent;
    scrollbarSize: number;
    direction: 'ltr' | 'rtl';
    fixedInfoList: readonly FixedInfo[];
    isSticky: boolean;
    summaryCollect: (uniKey: string, fixed: boolean | string) => void;
    transformCellText: TransformCellText<unknown>;
}
export declare const TableContextKey: InjectionKey<TableContextProps>;
export declare const useProvideTable: (props: TableContextProps) => void;
export declare const useInjectTable: () => TableContextProps;
