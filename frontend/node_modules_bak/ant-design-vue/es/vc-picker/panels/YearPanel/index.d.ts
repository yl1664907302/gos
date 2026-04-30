import type { PanelSharedProps, PanelMode } from '../../interface';
export type YearPanelProps<DateType> = {
    sourceMode: PanelMode;
} & PanelSharedProps<DateType>;
export declare const YEAR_DECADE_COUNT = 10;
declare function YearPanel<DateType>(_props: YearPanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace YearPanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default YearPanel;
