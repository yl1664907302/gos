import type { GenerateConfig } from '../../generate';
import type { Locale } from '../../interface';
export declare const QUARTER_COL_COUNT = 4;
export type QuarterBodyProps<DateType> = {
    prefixCls: string;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
};
declare function QuarterBody<DateType>(_props: QuarterBodyProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace QuarterBody {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default QuarterBody;
