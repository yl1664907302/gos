import type { DatePanelProps } from '../DatePanel';
import type { SharedTimeProps } from '../TimePanel';
import type { DisabledTime } from '../../interface';
export type DatetimePanelProps<DateType> = {
    disabledTime?: DisabledTime<DateType>;
    showTime?: boolean | SharedTimeProps<DateType>;
    defaultValue?: DateType;
} & Omit<DatePanelProps<DateType>, 'disabledHours' | 'disabledMinutes' | 'disabledSeconds'>;
declare function DatetimePanel<DateType>(_props: DatetimePanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DatetimePanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DatetimePanel;
