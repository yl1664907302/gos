import type { GenerateConfig } from '../generate';
import type { PanelMode } from '../interface';
import type { VueNode } from '../../_util/type';
export type PanelBodyProps<DateType> = {
    prefixCls: string;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
    picker?: PanelMode;
    headerCells?: VueNode[];
    rowNum: number;
    colNum: number;
    baseDate: DateType;
    getCellClassName: (date: DateType) => Record<string, boolean | undefined>;
    getCellDate: (date: DateType, offset: number) => DateType;
    getCellText: (date: DateType) => VueNode;
    getCellNode?: (date: DateType) => VueNode;
    titleCell?: (date: DateType) => string;
    generateConfig: GenerateConfig<DateType>;
    prefixColumn?: (date: DateType) => VueNode;
    rowClassName?: (date: DateType) => string;
};
declare function PanelBody<DateType>(_props: PanelBodyProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace PanelBody {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default PanelBody;
