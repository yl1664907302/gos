import type { GenerateConfig } from '../../generate';
import type { Locale } from '../../interface';
import type { VueNode } from '../../../_util/type';
export type DateRender<DateType> = (props: {
    current: DateType;
    today: DateType;
}) => VueNode;
export type DateBodyPassProps<DateType> = {
    dateRender?: DateRender<DateType>;
    disabledDate?: (date: DateType) => boolean;
    prefixColumn?: (date: DateType) => VueNode;
    rowClassName?: (date: DateType) => string;
};
export type DateBodyProps<DateType> = {
    prefixCls: string;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    viewDate: DateType;
    locale: Locale;
    rowCount: number;
    onSelect: (value: DateType) => void;
} & DateBodyPassProps<DateType>;
declare function DateBody<DateType>(_props: DateBodyProps<DateType>): import("vue/jsx-runtime").JSX.Element;
declare namespace DateBody {
    var displayName: string;
    var inheritAttrs: boolean;
    var props: string[];
}
export default DateBody;
