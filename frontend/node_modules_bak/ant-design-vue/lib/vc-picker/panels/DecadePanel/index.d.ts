import type { PanelSharedProps } from '../../interface';
export type DecadePanelProps<DateType> = PanelSharedProps<DateType>;
export declare const DECADE_UNIT_DIFF = 10;
export declare const DECADE_DISTANCE_COUNT: number;
declare function DecadePanel<DateType>(_props: DecadePanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DecadePanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DecadePanel;
