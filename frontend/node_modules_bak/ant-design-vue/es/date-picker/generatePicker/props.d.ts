import type { FocusEventHandler, MouseEventHandler } from '../../_util/EventInterface';
import type { CSSProperties } from 'vue';
import type { PickerLocale } from '.';
import type { SizeType } from '../../config-provider';
import type { PresetDate, CustomFormat, DisabledTime, DisabledTimes, EventValue, PanelMode, PickerMode, RangeValue } from '../../vc-picker/interface';
import type { DateRender } from '../../vc-picker/panels/DatePanel/DateBody';
import type { MonthCellRender } from '../../vc-picker/panels/MonthPanel/MonthBody';
import type { SharedTimeProps } from '../../vc-picker/panels/TimePanel';
import type { RangeDateRender, RangeInfo, RangeType } from '../../vc-picker/RangePicker';
import type { VueNode } from '../../_util/type';
import type { InputStatus } from '../../_util/statusUtils';
declare const DataPickerPlacements: readonly ["bottomLeft", "bottomRight", "topLeft", "topRight"];
type DataPickerPlacement = (typeof DataPickerPlacements)[number];
type RangeShowTimeObject<DateType> = Omit<SharedTimeProps<DateType>, 'defaultValue'> & {
    defaultValue?: DateType[];
};
declare function commonProps<DateType = any>(): {
    id: StringConstructor;
    /**
     * @deprecated `dropdownClassName` is deprecated which will be removed in next major
     *   version.Please use `popupClassName` instead.
     */
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    transitionName: StringConstructor;
    placeholder: StringConstructor;
    allowClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabindex: NumberConstructor;
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: boolean;
    };
    /** Make input readOnly to avoid popup keyboard in mobile */
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[]>;
        default: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: VueNode) => VueNode>;
        default: (originPanel: VueNode) => VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: DateType | string | null, dateString: string) => void>;
        default: (value: DateType | string | null, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: DateType | string | null) => void>;
        default: (value: DateType | string | null) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: DateType | string | null) => void>;
        default: (value: DateType | string | null) => void;
    };
    onOpenChange: {
        type: import("vue").PropType<(open: boolean) => void>;
        default: (open: boolean) => void;
    };
    'onUpdate:open': {
        type: import("vue").PropType<(open: boolean) => void>;
        default: (open: boolean) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onKeydown: {
        type: import("vue").PropType<(event: KeyboardEvent, preventDefault: () => void) => void>;
        default: (event: KeyboardEvent, preventDefault: () => void) => void;
    };
    role: StringConstructor;
    name: StringConstructor;
    autocomplete: StringConstructor;
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: "rtl" | "ltr";
    };
    showToday: {
        type: BooleanConstructor;
        default: boolean;
    };
    showTime: {
        type: import("vue").PropType<boolean | SharedTimeProps<DateType>>;
        default: boolean | SharedTimeProps<DateType>;
    };
    locale: {
        type: import("vue").PropType<PickerLocale>;
        default: PickerLocale;
    };
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<DateRender<DateType>>;
        default: DateRender<DateType>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    mode: {
        type: import("vue").PropType<PanelMode>;
        default: PanelMode;
    };
    picker: {
        type: import("vue").PropType<PickerMode>;
        default: PickerMode;
    };
    valueFormat: StringConstructor;
    placement: {
        type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    /** @deprecated Please use `disabledTime` instead. */
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    /** @deprecated Please use `disabledTime` instead. */
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    /** @deprecated Please use `disabledTime` instead. */
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
};
export interface CommonProps<DateType> {
    id?: string;
    prefixCls?: string;
    /**
     * @deprecated `dropdownClassName` is deprecated which will be removed in next major
     *   version.Please use `popupClassName` instead.
     */
    dropdownClassName?: string;
    popupClassName?: string;
    popupStyle?: CSSProperties;
    transitionName?: string;
    placeholder?: string;
    allowClear?: boolean;
    autofocus?: boolean;
    disabled?: boolean;
    tabindex?: number;
    open?: boolean;
    defaultOpen?: boolean;
    inputReadOnly?: boolean;
    format?: string | CustomFormat<DateType> | (string | CustomFormat<DateType>)[];
    suffixIcon?: VueNode;
    clearIcon?: VueNode;
    prevIcon?: VueNode;
    nextIcon?: VueNode;
    superPrevIcon?: VueNode;
    superNextIcon?: VueNode;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    panelRender?: (originPanel: VueNode) => VueNode;
    onChange?: (value: DateType | string | null, dateString: string) => void;
    'onUpdate:value'?: (value: DateType | string | null) => void;
    onOk?: (value: DateType | string | null) => void;
    onOpenChange?: (open: boolean) => void;
    'onUpdate:open'?: (open: boolean) => void;
    onFocus?: FocusEventHandler;
    onBlur?: FocusEventHandler;
    onMousedown?: MouseEventHandler;
    onMouseup?: MouseEventHandler;
    onMouseenter?: MouseEventHandler;
    onMouseleave?: MouseEventHandler;
    onClick?: MouseEventHandler;
    onContextmenu?: MouseEventHandler;
    onKeydown?: (event: KeyboardEvent, preventDefault: () => void) => void;
    role?: string;
    name?: string;
    autocomplete?: string;
    direction?: 'ltr' | 'rtl';
    showToday?: boolean;
    showTime?: boolean | SharedTimeProps<DateType>;
    locale?: PickerLocale;
    size?: SizeType;
    bordered?: boolean;
    dateRender?: DateRender<DateType>;
    disabledDate?: (date: DateType) => boolean;
    mode?: PanelMode;
    picker?: PickerMode;
    valueFormat?: string;
    placement?: DataPickerPlacement;
    status?: InputStatus;
}
declare function datePickerProps<DateType = any>(): {
    defaultPickerValue: {
        type: import("vue").PropType<string | DateType>;
        default: string | DateType;
    };
    defaultValue: {
        type: import("vue").PropType<string | DateType>;
        default: string | DateType;
    };
    value: {
        type: import("vue").PropType<string | DateType>;
        default: string | DateType;
    };
    presets: {
        type: import("vue").PropType<PresetDate<DateType>[]>;
        default: PresetDate<DateType>[];
    };
    disabledTime: {
        type: import("vue").PropType<DisabledTime<DateType>>;
        default: DisabledTime<DateType>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: PanelMode) => VueNode>;
        default: (mode: PanelMode) => VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<MonthCellRender<DateType>>;
        default: MonthCellRender<DateType>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<MonthCellRender<DateType>>;
        default: MonthCellRender<DateType>;
    };
};
export interface DatePickerProps<DateType> {
    defaultPickerValue?: DateType | string;
    defaultValue?: DateType | string;
    value?: DateType | string;
    presets?: PresetDate<DateType>[];
    disabledTime?: DisabledTime<DateType>;
    renderExtraFooter?: (mode: PanelMode) => VueNode;
    showNow?: boolean;
    monthCellRender?: MonthCellRender<DateType>;
    monthCellContentRender?: MonthCellRender<DateType>;
}
declare function rangePickerProps<DateType>(): {
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<RangeDateRender<DateType>>;
        default: RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[DateType, DateType] | [string, string]>;
        default: [DateType, DateType] | [string, string];
    };
    defaultValue: {
        type: import("vue").PropType<[DateType, DateType] | [string, string]>;
        default: [DateType, DateType] | [string, string];
    };
    value: {
        type: import("vue").PropType<[DateType, DateType] | [string, string]>;
        default: [DateType, DateType] | [string, string];
    };
    presets: {
        type: import("vue").PropType<PresetDate<DateType[]>[]>;
        default: PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: EventValue<DateType>, type: RangeType) => DisabledTimes>;
        default: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => VueNode>;
        default: () => VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | RangeShowTimeObject<DateType>>;
        default: boolean | RangeShowTimeObject<DateType>;
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => Exclude<RangeValue<DateType>, null>)>>;
        default: Record<string, [DateType, DateType] | (() => Exclude<RangeValue<DateType>, null>)>;
    };
    placeholder: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    mode: {
        type: import("vue").PropType<[PanelMode, PanelMode]>;
        default: [PanelMode, PanelMode];
    };
    onChange: {
        type: import("vue").PropType<(value: RangeValue<DateType> | RangeValue<string> | null, dateString: [string, string]) => void>;
        default: (value: RangeValue<DateType> | RangeValue<string> | null, dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: RangeValue<DateType> | RangeValue<string> | null) => void>;
        default: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: RangeValue<DateType> | RangeValue<string>, formatString: [string, string], info: RangeInfo) => void>;
        default: (values: RangeValue<DateType> | RangeValue<string>, formatString: [string, string], info: RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void>;
        default: (values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: RangeValue<DateType> | RangeValue<string>) => void>;
        default: (dates: RangeValue<DateType> | RangeValue<string>) => void;
    };
};
export interface RangePickerProps<DateType> {
    allowEmpty?: [boolean, boolean];
    dateRender?: RangeDateRender<DateType>;
    defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
    defaultValue?: RangeValue<DateType> | RangeValue<string>;
    value?: RangeValue<DateType> | RangeValue<string>;
    presets?: PresetDate<RangeValue<DateType>>[];
    disabledTime?: (date: EventValue<DateType>, type: RangeType) => DisabledTimes;
    disabled?: [boolean, boolean];
    renderExtraFooter?: () => VueNode;
    separator?: string;
    showTime?: boolean | RangeShowTimeObject<DateType>;
    ranges?: Record<string, Exclude<RangeValue<DateType>, null> | (() => Exclude<RangeValue<DateType>, null>)>;
    placeholder?: [string, string];
    mode?: [PanelMode, PanelMode];
    onChange?: (value: RangeValue<DateType> | RangeValue<string> | null, dateString: [string, string]) => void;
    'onUpdate:value'?: (value: RangeValue<DateType> | RangeValue<string> | null) => void;
    onCalendarChange?: (values: RangeValue<DateType> | RangeValue<string>, formatString: [string, string], info: RangeInfo) => void;
    onPanelChange?: (values: RangeValue<DateType> | RangeValue<string>, modes: [PanelMode, PanelMode]) => void;
    onOk?: (dates: RangeValue<DateType> | RangeValue<string>) => void;
}
export type ExtraDatePickerProps<DateType> = {
    valueFormat?: string;
    defaultPickerValue?: DateType | string;
    defaultValue?: DateType | string;
    value?: DateType | string;
};
export type ExtraRangePickerProps<DateType> = {
    valueFormat?: string;
    defaultPickerValue?: RangeValue<DateType> | RangeValue<string>;
    defaultValue?: RangeValue<DateType> | RangeValue<string>;
    value?: RangeValue<DateType> | RangeValue<string>;
};
export { commonProps, datePickerProps, rangePickerProps };
