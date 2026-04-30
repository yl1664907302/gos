import type { DateBodyPassProps, DateRender } from './DateBody';
import type { PanelSharedProps } from '../../interface';
import type { KeyboardConfig } from '../../utils/uiUtil';
export type DatePanelProps<DateType> = {
    active?: boolean;
    dateRender?: DateRender<DateType>;
    panelName?: string;
    keyboardConfig?: KeyboardConfig;
} & PanelSharedProps<DateType> & DateBodyPassProps<DateType>;
declare function DatePanel<DateType>(_props: DatePanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DatePanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DatePanel;
