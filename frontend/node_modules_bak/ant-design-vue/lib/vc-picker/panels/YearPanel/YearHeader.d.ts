import type { GenerateConfig } from '../../generate';
export type YearHeaderProps<DateType> = {
    prefixCls: string;
    viewDate: DateType;
    value?: DateType | null;
    generateConfig: GenerateConfig<DateType>;
    onPrevDecade: () => void;
    onNextDecade: () => void;
    onDecadeClick: () => void;
};
declare function YearHeader<DateType>(_props: YearHeaderProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace YearHeader {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default YearHeader;
