import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
export type DateHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    value?: DateType | null;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    onPrevYear: () => void;
    onNextYear: () => void;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    onYearClick: () => void;
    onMonthClick: () => void;
};
declare function DateHeader<DateType>(_props: DateHeaderProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DateHeader {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DateHeader;
