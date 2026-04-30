import type { Moment } from 'moment';
import type { App } from 'vue';
import type { PickerProps, PickerDateProps, RangePickerProps as BaseRangePickerProps } from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';
export type DatePickerProps = PickerProps<Moment> & ExtraDatePickerProps<Moment>;
export type MonthPickerProps = Omit<PickerDateProps<Moment>, 'picker'> & ExtraDatePickerProps<Moment>;
export type WeekPickerProps = Omit<PickerDateProps<Moment>, 'picker'> & ExtraDatePickerProps<Moment>;
export type RangePickerProps = BaseRangePickerProps<Moment> & ExtraRangePickerProps<Moment>;
declare const WeekPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>> & Readonly<{}>, {
    size: import("../config-provider").SizeType;
    value: string | Moment;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Moment, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Moment) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
    status: "" | "error" | "warning";
    defaultValue: string | Moment;
    'onUpdate:value': (value: string | Moment) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    defaultPickerValue: string | Moment;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    onOk: (value: string | Moment) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Moment>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
}, import("../_util/type").CustomSlotsType<{
    suffixIcon?: any;
    prevIcon?: any;
    nextIcon?: any;
    superPrevIcon?: any;
    superNextIcon?: any;
    dateRender?: any;
    renderExtraFooter?: any;
    monthCellRender?: any;
    monthCellContentRender?: any;
    clearIcon?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, MonthPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>> & Readonly<{}>, {
    size: import("../config-provider").SizeType;
    value: string | Moment;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Moment, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Moment) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
    status: "" | "error" | "warning";
    defaultValue: string | Moment;
    'onUpdate:value': (value: string | Moment) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    defaultPickerValue: string | Moment;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    onOk: (value: string | Moment) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Moment>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
}, import("../_util/type").CustomSlotsType<{
    suffixIcon?: any;
    prevIcon?: any;
    nextIcon?: any;
    superPrevIcon?: any;
    superNextIcon?: any;
    dateRender?: any;
    renderExtraFooter?: any;
    monthCellRender?: any;
    monthCellContentRender?: any;
    clearIcon?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, QuarterPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>> & Readonly<{}>, {
    size: import("../config-provider").SizeType;
    value: string | Moment;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Moment, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Moment) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
    status: "" | "error" | "warning";
    defaultValue: string | Moment;
    'onUpdate:value': (value: string | Moment) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    defaultPickerValue: string | Moment;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    onOk: (value: string | Moment) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Moment>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
}, import("../_util/type").CustomSlotsType<{
    suffixIcon?: any;
    prevIcon?: any;
    nextIcon?: any;
    superPrevIcon?: any;
    superNextIcon?: any;
    dateRender?: any;
    renderExtraFooter?: any;
    monthCellRender?: any;
    monthCellContentRender?: any;
    clearIcon?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>, RangePicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Moment>>;
        default: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    value: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment[]>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
        default: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../_util/type").VueNode>;
        default: () => import("../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
            defaultValue?: Moment[];
        })>;
        default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
            defaultValue?: Moment[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [Moment, Moment] | (() => [Moment, Moment])>>;
        default: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
    };
    placeholder: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    mode: {
        type: import("vue").PropType<[import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]>;
        default: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
    };
    onChange: {
        type: import("vue").PropType<(value: [string, string] | [Moment, Moment], dateString: [string, string]) => void>;
        default: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [Moment, Moment]) => void>;
        default: (value: [string, string] | [Moment, Moment]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
        default: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [Moment, Moment]) => void>;
        default: (dates: [string, string] | [Moment, Moment]) => void;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    transitionName: StringConstructor;
    allowClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Moment>>;
        default: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    value: {
        type: import("vue").PropType<[string, string] | [Moment, Moment]>;
        default: [string, string] | [Moment, Moment];
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment[]>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
        default: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../_util/type").VueNode>;
        default: () => import("../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
            defaultValue?: Moment[];
        })>;
        default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
            defaultValue?: Moment[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [Moment, Moment] | (() => [Moment, Moment])>>;
        default: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
    };
    placeholder: {
        type: import("vue").PropType<string[]>;
        default: string[];
    };
    mode: {
        type: import("vue").PropType<[import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]>;
        default: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
    };
    onChange: {
        type: import("vue").PropType<(value: [string, string] | [Moment, Moment], dateString: [string, string]) => void>;
        default: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [Moment, Moment]) => void>;
        default: (value: [string, string] | [Moment, Moment]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
        default: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [Moment, Moment]) => void>;
        default: (dates: [string, string] | [Moment, Moment]) => void;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    transitionName: StringConstructor;
    allowClear: {
        type: BooleanConstructor;
        default: boolean;
    };
    autofocus: {
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>> & Readonly<{}>, {
    size: import("../config-provider").SizeType;
    value: [string, string] | [Moment, Moment];
    mode: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean | [boolean, boolean];
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Moment) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    onPanelChange: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
    status: "" | "error" | "warning";
    defaultValue: [string, string] | [Moment, Moment];
    'onUpdate:value': (value: [string, string] | [Moment, Moment]) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    placeholder: string[];
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
    defaultPickerValue: [string, string] | [Moment, Moment];
    showTime: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
        defaultValue?: Moment[];
    });
    onOk: (dates: [string, string] | [Moment, Moment]) => void;
    renderExtraFooter: () => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Moment[]>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    ranges: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
    allowEmpty: [boolean, boolean];
    onCalendarChange: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
}, import("../_util/type").CustomSlotsType<{
    suffixIcon?: any;
    prevIcon?: any;
    nextIcon?: any;
    superPrevIcon?: any;
    superNextIcon?: any;
    dateRender?: any;
    renderExtraFooter?: any;
    default?: any;
    separator?: any;
    clearIcon?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export { RangePicker, WeekPicker, MonthPicker, QuarterPicker };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    defaultValue: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    value: {
        type: import("vue").PropType<string | Moment>;
        default: string | Moment;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
        default: import("../vc-picker/interface").PresetDate<Moment>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
        default: import("../vc-picker/interface").DisabledTime<Moment>;
    };
    renderExtraFooter: {
        type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
        default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    };
    showNow: {
        type: BooleanConstructor;
        default: boolean;
    };
    monthCellRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    };
    id: StringConstructor;
    dropdownClassName: StringConstructor;
    popupClassName: StringConstructor;
    popupStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
    inputReadOnly: {
        type: BooleanConstructor;
        default: boolean;
    };
    format: {
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    onChange: {
        type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
        default: (value: string | Moment, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Moment) => void>;
        default: (value: string | Moment) => void;
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
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        default: import("../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    };
    locale: {
        type: import("vue").PropType<import("./generatePicker").PickerLocale>;
        default: import("./generatePicker").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    dateRender: {
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Moment) => boolean>;
        default: (date: Moment) => boolean;
    };
    mode: {
        type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
        default: import("../vc-picker/interface").PanelMode;
    };
    picker: {
        type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
        default: import("../vc-picker/interface").PickerMode;
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
    disabledHours: {
        type: import("vue").PropType<() => number[]>;
        default: () => number[];
    };
    disabledMinutes: {
        type: import("vue").PropType<(hour: number) => number[]>;
        default: (hour: number) => number[];
    };
    disabledSeconds: {
        type: import("vue").PropType<(hour: number, minute: number) => number[]>;
        default: (hour: number, minute: number) => number[];
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("../config-provider").SizeType;
    value: string | Moment;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Moment, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Moment) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
    status: "" | "error" | "warning";
    defaultValue: string | Moment;
    'onUpdate:value': (value: string | Moment) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
    defaultPickerValue: string | Moment;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    onOk: (value: string | Moment) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Moment>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
}, {}, string, import("../_util/type").CustomSlotsType<{
    suffixIcon?: any;
    prevIcon?: any;
    nextIcon?: any;
    superPrevIcon?: any;
    superNextIcon?: any;
    dateRender?: any;
    renderExtraFooter?: any;
    monthCellRender?: any;
    monthCellContentRender?: any;
    clearIcon?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    WeekPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    MonthPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    YearPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    RangePicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        allowEmpty: {
            type: import("vue").PropType<[boolean, boolean]>;
            default: [boolean, boolean];
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Moment>>;
            default: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
        };
        defaultPickerValue: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        defaultValue: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        value: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment[]>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment[]>[];
        };
        disabledTime: {
            type: import("vue").PropType<(date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
            default: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
        };
        disabled: {
            type: import("vue").PropType<boolean | [boolean, boolean]>;
            default: boolean | [boolean, boolean];
        };
        renderExtraFooter: {
            type: import("vue").PropType<() => import("../_util/type").VueNode>;
            default: () => import("../_util/type").VueNode;
        };
        separator: {
            type: StringConstructor;
        };
        showTime: {
            type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
                defaultValue?: Moment[];
            })>;
            default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
                defaultValue?: Moment[];
            });
        };
        ranges: {
            type: import("vue").PropType<Record<string, [Moment, Moment] | (() => [Moment, Moment])>>;
            default: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
        };
        placeholder: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        mode: {
            type: import("vue").PropType<[import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]>;
            default: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
        };
        onChange: {
            type: import("vue").PropType<(value: [string, string] | [Moment, Moment], dateString: [string, string]) => void>;
            default: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: [string, string] | [Moment, Moment]) => void>;
            default: (value: [string, string] | [Moment, Moment]) => void;
        };
        onCalendarChange: {
            type: import("vue").PropType<(values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
            default: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
        };
        onPanelChange: {
            type: import("vue").PropType<(values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
            default: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        };
        onOk: {
            type: import("vue").PropType<(dates: [string, string] | [Moment, Moment]) => void>;
            default: (dates: [string, string] | [Moment, Moment]) => void;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        transitionName: StringConstructor;
        allowClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        autofocus: {
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        allowEmpty: {
            type: import("vue").PropType<[boolean, boolean]>;
            default: [boolean, boolean];
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Moment>>;
            default: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
        };
        defaultPickerValue: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        defaultValue: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        value: {
            type: import("vue").PropType<[string, string] | [Moment, Moment]>;
            default: [string, string] | [Moment, Moment];
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment[]>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment[]>[];
        };
        disabledTime: {
            type: import("vue").PropType<(date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
            default: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
        };
        disabled: {
            type: import("vue").PropType<boolean | [boolean, boolean]>;
            default: boolean | [boolean, boolean];
        };
        renderExtraFooter: {
            type: import("vue").PropType<() => import("../_util/type").VueNode>;
            default: () => import("../_util/type").VueNode;
        };
        separator: {
            type: StringConstructor;
        };
        showTime: {
            type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
                defaultValue?: Moment[];
            })>;
            default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
                defaultValue?: Moment[];
            });
        };
        ranges: {
            type: import("vue").PropType<Record<string, [Moment, Moment] | (() => [Moment, Moment])>>;
            default: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
        };
        placeholder: {
            type: import("vue").PropType<string[]>;
            default: string[];
        };
        mode: {
            type: import("vue").PropType<[import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]>;
            default: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
        };
        onChange: {
            type: import("vue").PropType<(value: [string, string] | [Moment, Moment], dateString: [string, string]) => void>;
            default: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: [string, string] | [Moment, Moment]) => void>;
            default: (value: [string, string] | [Moment, Moment]) => void;
        };
        onCalendarChange: {
            type: import("vue").PropType<(values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
            default: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
        };
        onPanelChange: {
            type: import("vue").PropType<(values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
            default: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        };
        onOk: {
            type: import("vue").PropType<(dates: [string, string] | [Moment, Moment]) => void>;
            default: (dates: [string, string] | [Moment, Moment]) => void;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        transitionName: StringConstructor;
        allowClear: {
            type: BooleanConstructor;
            default: boolean;
        };
        autofocus: {
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: [string, string] | [Moment, Moment];
        mode: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: [string, string] | [Moment, Moment], dateString: [string, string]) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean | [boolean, boolean];
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        onPanelChange: (values: [string, string] | [Moment, Moment], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: (date: Moment, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
        status: "" | "error" | "warning";
        defaultValue: [string, string] | [Moment, Moment];
        'onUpdate:value': (value: [string, string] | [Moment, Moment]) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        placeholder: string[];
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/RangePicker").RangeDateRender<Moment>;
        defaultPickerValue: [string, string] | [Moment, Moment];
        showTime: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>, "defaultValue"> & {
            defaultValue?: Moment[];
        });
        onOk: (dates: [string, string] | [Moment, Moment]) => void;
        renderExtraFooter: () => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment[]>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        ranges: Record<string, [Moment, Moment] | (() => [Moment, Moment])>;
        allowEmpty: [boolean, boolean];
        onCalendarChange: (values: [string, string] | [Moment, Moment], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        default?: any;
        separator?: any;
        clearIcon?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    TimePicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    QuarterPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        defaultPickerValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        defaultValue: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        value: {
            type: import("vue").PropType<string | Moment>;
            default: string | Moment;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Moment>[]>;
            default: import("../vc-picker/interface").PresetDate<Moment>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Moment>>;
            default: import("../vc-picker/interface").DisabledTime<Moment>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode>;
            default: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        };
        id: StringConstructor;
        dropdownClassName: StringConstructor;
        popupClassName: StringConstructor;
        popupStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
        inputReadOnly: {
            type: BooleanConstructor;
            default: boolean;
        };
        format: {
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        };
        getPopupContainer: {
            type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
            default: (node: HTMLElement) => HTMLElement;
        };
        panelRender: {
            type: import("vue").PropType<(originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        onChange: {
            type: import("vue").PropType<(value: string | Moment, dateString: string) => void>;
            default: (value: string | Moment, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Moment) => void>;
            default: (value: string | Moment) => void;
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
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onBlur: {
            type: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
            default: import("../_util/EventInterface").FocusEventHandler;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseup: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseenter: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onMouseleave: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onContextmenu: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        };
        locale: {
            type: import("vue").PropType<import("./generatePicker").PickerLocale>;
            default: import("./generatePicker").PickerLocale;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        dateRender: {
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Moment) => boolean>;
            default: (date: Moment) => boolean;
        };
        mode: {
            type: import("vue").PropType<import("../vc-picker/interface").PanelMode>;
            default: import("../vc-picker/interface").PanelMode;
        };
        picker: {
            type: import("vue").PropType<import("../vc-picker/interface").PickerMode>;
            default: import("../vc-picker/interface").PickerMode;
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
        disabledHours: {
            type: import("vue").PropType<() => number[]>;
            default: () => number[];
        };
        disabledMinutes: {
            type: import("vue").PropType<(hour: number) => number[]>;
            default: (hour: number) => number[];
        };
        disabledSeconds: {
            type: import("vue").PropType<(hour: number, minute: number) => number[]>;
            default: (hour: number, minute: number) => number[];
        };
    }>> & Readonly<{}>, {
        size: import("../config-provider").SizeType;
        value: string | Moment;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Moment, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Moment) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Moment> | (string | import("../vc-picker/interface").CustomFormat<Moment>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Moment>;
        status: "" | "error" | "warning";
        defaultValue: string | Moment;
        'onUpdate:value': (value: string | Moment) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Moment>;
        defaultPickerValue: string | Moment;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Moment>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
        onOk: (value: string | Moment) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Moment>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Moment>;
    }, import("../_util/type").CustomSlotsType<{
        suffixIcon?: any;
        prevIcon?: any;
        nextIcon?: any;
        superPrevIcon?: any;
        superNextIcon?: any;
        dateRender?: any;
        renderExtraFooter?: any;
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    install: (app: App) => App<any>;
};
export default _default;
