import type { MonthCellRender } from './MonthBody';
import type { PanelSharedProps } from '../../interface';
export type MonthPanelProps<DateType> = {
    monthCellContentRender?: MonthCellRender<DateType>;
} & PanelSharedProps<DateType>;
declare function MonthPanel<DateType>(_props: MonthPanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace MonthPanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default MonthPanel;
