import type { Locale } from '../../interface';
import type { GenerateConfig } from '../../generate';
export type TimeHeaderProps<DateType> = {
    prefixCls: string;
    value?: DateType | null;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    format: string;
};
declare function TimeHeader<DateType>(_props: TimeHeaderProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace TimeHeader {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default TimeHeader;
