import type { PanelSharedProps, DisabledTimes } from '../../interface';
export type SharedTimeProps<DateType> = {
    format?: string;
    showNow?: boolean;
    showHour?: boolean;
    showMinute?: boolean;
    showSecond?: boolean;
    use12Hours?: boolean;
    hourStep?: number;
    minuteStep?: number;
    secondStep?: number;
    hideDisabledOptions?: boolean;
    defaultValue?: DateType;
    /** @deprecated Please use `disabledTime` instead. */
    disabledHours?: DisabledTimes['disabledHours'];
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes?: DisabledTimes['disabledMinutes'];
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds?: DisabledTimes['disabledSeconds'];
    disabledTime?: (date: DateType) => DisabledTimes;
};
export type TimePanelProps<DateType> = {
    format?: string;
    active?: boolean;
} & PanelSharedProps<DateType> & SharedTimeProps<DateType>;
declare function TimePanel<DateType>(_props: TimePanelProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace TimePanel {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default TimePanel;
