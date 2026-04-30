import type { GenerateConfig } from '../vc-picker/generate';
import type { PickerPanelBaseProps as RCPickerPanelBaseProps, PickerPanelDateProps as RCPickerPanelDateProps, PickerPanelTimeProps as RCPickerPanelTimeProps } from '../vc-picker/PickerPanel';
import enUS from './locale/en_US';
import type { VueNode } from '../_util/type';
type InjectDefaultProps<Props> = Omit<Props, 'locale' | 'generateConfig' | 'prevIcon' | 'nextIcon' | 'superPrevIcon' | 'superNextIcon'> & {
    locale?: typeof enUS;
    size?: 'large' | 'default' | 'small';
};
export interface SelectInfo {
    source: 'year' | 'month' | 'date' | 'customize';
}
export type PickerPanelBaseProps<DateType> = InjectDefaultProps<RCPickerPanelBaseProps<DateType>>;
export type PickerPanelDateProps<DateType> = InjectDefaultProps<RCPickerPanelDateProps<DateType>>;
export type PickerPanelTimeProps<DateType> = InjectDefaultProps<RCPickerPanelTimeProps<DateType>>;
export type PickerProps<DateType> = PickerPanelBaseProps<DateType> | PickerPanelDateProps<DateType> | PickerPanelTimeProps<DateType>;
export type CalendarMode = 'year' | 'month';
export type HeaderRender<DateType> = (config: {
    value: DateType;
    type: CalendarMode;
    onChange: (date: DateType) => void;
    onTypeChange: (type: CalendarMode) => void;
}) => VueNode;
type CustomRenderType<DateType> = (config: {
    current: DateType;
}) => VueNode;
export interface CalendarProps<DateType> {
    prefixCls?: string;
    locale?: typeof enUS;
    validRange?: [DateType, DateType];
    disabledDate?: (date: DateType) => boolean;
    dateFullCellRender?: CustomRenderType<DateType>;
    dateCellRender?: CustomRenderType<DateType>;
    monthFullCellRender?: CustomRenderType<DateType>;
    monthCellRender?: CustomRenderType<DateType>;
    headerRender?: HeaderRender<DateType>;
    value?: DateType | string;
    defaultValue?: DateType | string;
    mode?: CalendarMode;
    fullscreen?: boolean;
    onChange?: (date: DateType | string) => void;
    'onUpdate:value'?: (date: DateType | string) => void;
    onPanelChange?: (date: DateType | string, mode: CalendarMode) => void;
    onSelect?: (date: DateType, selectInfo: SelectInfo) => void;
    valueFormat?: string;
}
declare function generateCalendar<DateType, Props extends CalendarProps<DateType> = CalendarProps<DateType>>(generateConfig: GenerateConfig<DateType>): import("vue").DefineComponent<import("@vue/shared").IfAny<Props, false, Props extends object ? keyof Props extends string ? true : false : false> extends true ? Props : {}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("@vue/shared").IfAny<Props, false, Props extends object ? keyof Props extends string ? true : false : false> extends true ? Props : {}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, unknown extends Props ? true : false, {}, any>;
export default generateCalendar;
