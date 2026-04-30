import type { GenerateConfig } from '../../generate';
export type YearHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    generateConfig: GenerateConfig<DateType>;
    onPrevDecades: () => void;
    onNextDecades: () => void;
};
declare function DecadeHeader<DateType>(_props: YearHeaderProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DecadeHeader {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DecadeHeader;
