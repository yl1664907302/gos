import type { GenerateConfig } from '../../generate';
export declare const DECADE_COL_COUNT = 3;
export type YearBodyProps<DateType> = {
    prefixCls: string;
    generateConfig: GenerateConfig<DateType>;
    viewDate: DateType;
    disabledDate?: (date: DateType) => boolean;
    onSelect: (value: DateType) => void;
};
declare function DecadeBody<DateType>(_props: YearBodyProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DecadeBody {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default DecadeBody;
