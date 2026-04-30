import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
export type MonthHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    onPrevYear: () => void;
    onNextYear: () => void;
    onYearClick: () => void;
};
declare function MonthHeader<DateType>(_props: MonthHeaderProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace MonthHeader {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default MonthHeader;
