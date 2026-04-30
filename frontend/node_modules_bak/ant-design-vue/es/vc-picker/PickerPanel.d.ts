/**
 * Logic:
 *  When `mode` === `picker`,
 *  click will trigger `onSelect` (if value changed trigger `onChange` also).
 *  Panel change will not trigger `onSelect` but trigger `onPanelChange`
 */
import type { SharedTimeProps } from './panels/TimePanel';
import type { GenerateConfig } from './generate';
import type { Locale, PanelMode, PickerMode, DisabledTime, OnPanelChange, Components } from './interface';
import type { DateRender } from './panels/DatePanel/DateBody';
import type { MonthCellRender } from './panels/MonthPanel/MonthBody';
import type { VueNode } from '../_util/type';
export type PickerPanelSharedProps<DateType> = {
    prefixCls?: string;
    /** @deprecated Will be removed in next big version. Please use `mode` instead */
    mode?: PanelMode;
    tabindex?: number;
    locale: Locale;
    generateConfig: GenerateConfig<DateType>;
    value?: DateType | null;
    defaultValue?: DateType;
    /** [Legacy] Set default display picker view date */
    pickerValue?: DateType;
    /** [Legacy] Set default display picker view date */
    defaultPickerValue?: DateType;
    disabledDate?: (date: DateType) => boolean;
    dateRender?: DateRender<DateType>;
    monthCellRender?: MonthCellRender<DateType>;
    renderExtraFooter?: (mode: PanelMode) => VueNode;
    onSelect?: (value: DateType) => void;
    onChange?: (value: DateType) => void;
    onPanelChange?: OnPanelChange<DateType>;
    onMousedown?: (e: MouseEvent) => void;
    onOk?: (date: DateType) => void;
    direction?: 'ltr' | 'rtl';
    /** @private This is internal usage. Do not use in your production env */
    hideHeader?: boolean;
    /** @private This is internal usage. Do not use in your production env */
    onPickerValueChange?: (date: DateType) => void;
    /** @private Internal usage. Do not use in your production env */
    components?: Components;
};
export type PickerPanelBaseProps<DateType> = {
    picker: Exclude<PickerMode, 'date' | 'time'>;
} & PickerPanelSharedProps<DateType>;
export type PickerPanelDateProps<DateType> = {
    picker?: 'date';
    showToday?: boolean;
    showNow?: boolean;
    showTime?: boolean | SharedTimeProps<DateType>;
    disabledTime?: DisabledTime<DateType>;
} & PickerPanelSharedProps<DateType>;
export type PickerPanelTimeProps<DateType> = {
    picker: 'time';
} & PickerPanelSharedProps<DateType> & SharedTimeProps<DateType>;
export type PickerPanelProps<DateType> = PickerPanelBaseProps<DateType> | PickerPanelDateProps<DateType> | PickerPanelTimeProps<DateType>;
type OmitType<DateType> = Omit<PickerPanelBaseProps<DateType>, 'picker'> & Omit<PickerPanelDateProps<DateType>, 'picker'> & Omit<PickerPanelTimeProps<DateType>, 'picker'>;
type MergedPickerPanelProps<DateType> = {
    picker?: PickerMode;
} & OmitType<DateType>;
declare const _default: <DateType>(props: MergedPickerPanelProps<DateType>) => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>;
export default _default;
