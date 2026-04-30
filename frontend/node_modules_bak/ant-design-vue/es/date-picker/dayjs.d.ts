import type { Dayjs } from 'dayjs';
import type { App } from 'vue';
import type { PickerProps, PickerDateProps, RangePickerProps as BaseRangePickerProps } from './generatePicker';
import type { ExtraDatePickerProps, ExtraRangePickerProps } from './generatePicker/props';
export type DatePickerProps = PickerProps<Dayjs> & ExtraDatePickerProps<Dayjs>;
export type MonthPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type WeekPickerProps = Omit<PickerDateProps<Dayjs>, 'picker'> & ExtraDatePickerProps<Dayjs>;
export type RangePickerProps = BaseRangePickerProps<Dayjs> & ExtraRangePickerProps<Dayjs>;
declare const WeekPicker: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
    value: string | Dayjs;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Dayjs, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Dayjs) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
    status: "" | "error" | "warning";
    defaultValue: string | Dayjs;
    'onUpdate:value': (value: string | Dayjs) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    defaultPickerValue: string | Dayjs;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    onOk: (value: string | Dayjs) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
    value: string | Dayjs;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Dayjs, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Dayjs) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
    status: "" | "error" | "warning";
    defaultValue: string | Dayjs;
    'onUpdate:value': (value: string | Dayjs) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    defaultPickerValue: string | Dayjs;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    onOk: (value: string | Dayjs) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
    value: string | Dayjs;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Dayjs, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Dayjs) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
    status: "" | "error" | "warning";
    defaultValue: string | Dayjs;
    'onUpdate:value': (value: string | Dayjs) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    defaultPickerValue: string | Dayjs;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    onOk: (value: string | Dayjs) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Dayjs>>;
        default: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    value: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs[]>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
        default: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
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
        type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
            defaultValue?: Dayjs[];
        })>;
        default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
            defaultValue?: Dayjs[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>>;
        default: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
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
        type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void>;
        default: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs]) => void>;
        default: (value: [string, string] | [Dayjs, Dayjs]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
        default: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [Dayjs, Dayjs]) => void>;
        default: (dates: [string, string] | [Dayjs, Dayjs]) => void;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
        type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Dayjs>>;
        default: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    value: {
        type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
        default: [string, string] | [Dayjs, Dayjs];
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs[]>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
        default: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
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
        type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
            defaultValue?: Dayjs[];
        })>;
        default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
            defaultValue?: Dayjs[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>>;
        default: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
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
        type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void>;
        default: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs]) => void>;
        default: (value: [string, string] | [Dayjs, Dayjs]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
        default: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [Dayjs, Dayjs]) => void>;
        default: (dates: [string, string] | [Dayjs, Dayjs]) => void;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
    value: [string, string] | [Dayjs, Dayjs];
    mode: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean | [boolean, boolean];
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Dayjs) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    onPanelChange: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
    status: "" | "error" | "warning";
    defaultValue: [string, string] | [Dayjs, Dayjs];
    'onUpdate:value': (value: [string, string] | [Dayjs, Dayjs]) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    placeholder: string[];
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
    defaultPickerValue: [string, string] | [Dayjs, Dayjs];
    showTime: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
        defaultValue?: Dayjs[];
    });
    onOk: (dates: [string, string] | [Dayjs, Dayjs]) => void;
    renderExtraFooter: () => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    ranges: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
    allowEmpty: [boolean, boolean];
    onCalendarChange: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    defaultPickerValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    defaultValue: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    value: {
        type: import("vue").PropType<string | Dayjs>;
        default: string | Dayjs;
    };
    presets: {
        type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
        default: import("../vc-picker/interface").PresetDate<Dayjs>[];
    };
    disabledTime: {
        type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
        default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    };
    monthCellContentRender: {
        type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
        default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
        type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
        default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
        type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
        default: (value: string | Dayjs, dateString: string) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
    };
    onOk: {
        type: import("vue").PropType<(value: string | Dayjs) => void>;
        default: (value: string | Dayjs) => void;
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
        type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
        default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
        type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
        default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    };
    disabledDate: {
        type: import("vue").PropType<(date: Dayjs) => boolean>;
        default: (date: Dayjs) => boolean;
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
    value: string | Dayjs;
    mode: import("../vc-picker/interface").PanelMode;
    onMouseenter: import("../_util/EventInterface").MouseEventHandler;
    onMouseleave: import("../_util/EventInterface").MouseEventHandler;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onFocus: import("../_util/EventInterface").FocusEventHandler;
    onBlur: import("../_util/EventInterface").FocusEventHandler;
    onChange: (value: string | Dayjs, dateString: string) => void;
    onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
    onContextmenu: import("../_util/EventInterface").MouseEventHandler;
    onMousedown: import("../_util/EventInterface").MouseEventHandler;
    onMouseup: import("../_util/EventInterface").MouseEventHandler;
    open: boolean;
    direction: "rtl" | "ltr";
    disabled: boolean;
    autofocus: boolean;
    getPopupContainer: (node: HTMLElement) => HTMLElement;
    disabledDate: (date: Dayjs) => boolean;
    picker: import("../vc-picker/interface").PickerMode;
    locale: import("./generatePicker").PickerLocale;
    format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
    disabledHours: () => number[];
    disabledMinutes: (hour: number) => number[];
    disabledSeconds: (hour: number, minute: number) => number[];
    disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
    status: "" | "error" | "warning";
    defaultValue: string | Dayjs;
    'onUpdate:value': (value: string | Dayjs) => void;
    popupStyle: import("vue").CSSProperties;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    onOpenChange: (open: boolean) => void;
    'onUpdate:open': (open: boolean) => void;
    bordered: boolean;
    allowClear: boolean;
    defaultOpen: boolean;
    dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
    defaultPickerValue: string | Dayjs;
    showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
    monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
    onOk: (value: string | Dayjs) => void;
    showNow: boolean;
    renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
    showToday: boolean;
    presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
    inputReadOnly: boolean;
    panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Dayjs>>;
            default: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
        };
        defaultPickerValue: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        defaultValue: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        value: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs[]>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
        };
        disabledTime: {
            type: import("vue").PropType<(date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
            default: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
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
            type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
                defaultValue?: Dayjs[];
            })>;
            default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
                defaultValue?: Dayjs[];
            });
        };
        ranges: {
            type: import("vue").PropType<Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>>;
            default: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
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
            type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void>;
            default: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs]) => void>;
            default: (value: [string, string] | [Dayjs, Dayjs]) => void;
        };
        onCalendarChange: {
            type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
            default: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
        };
        onPanelChange: {
            type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
            default: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        };
        onOk: {
            type: import("vue").PropType<(dates: [string, string] | [Dayjs, Dayjs]) => void>;
            default: (dates: [string, string] | [Dayjs, Dayjs]) => void;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<import("../vc-picker/RangePicker").RangeDateRender<Dayjs>>;
            default: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
        };
        defaultPickerValue: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        defaultValue: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        value: {
            type: import("vue").PropType<[string, string] | [Dayjs, Dayjs]>;
            default: [string, string] | [Dayjs, Dayjs];
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs[]>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
        };
        disabledTime: {
            type: import("vue").PropType<(date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes>;
            default: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
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
            type: import("vue").PropType<boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
                defaultValue?: Dayjs[];
            })>;
            default: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
                defaultValue?: Dayjs[];
            });
        };
        ranges: {
            type: import("vue").PropType<Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>>;
            default: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
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
            type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void>;
            default: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: [string, string] | [Dayjs, Dayjs]) => void>;
            default: (value: [string, string] | [Dayjs, Dayjs]) => void;
        };
        onCalendarChange: {
            type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void>;
            default: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
        };
        onPanelChange: {
            type: import("vue").PropType<(values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void>;
            default: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        };
        onOk: {
            type: import("vue").PropType<(dates: [string, string] | [Dayjs, Dayjs]) => void>;
            default: (dates: [string, string] | [Dayjs, Dayjs]) => void;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: [string, string] | [Dayjs, Dayjs];
        mode: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode];
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: [string, string] | [Dayjs, Dayjs], dateString: [string, string]) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean | [boolean, boolean];
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        onPanelChange: (values: [string, string] | [Dayjs, Dayjs], modes: [import("../vc-picker/interface").PanelMode, import("../vc-picker/interface").PanelMode]) => void;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: (date: Dayjs, type: import("../vc-picker/RangePicker").RangeType) => import("../vc-picker/interface").DisabledTimes;
        status: "" | "error" | "warning";
        defaultValue: [string, string] | [Dayjs, Dayjs];
        'onUpdate:value': (value: [string, string] | [Dayjs, Dayjs]) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        placeholder: string[];
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/RangePicker").RangeDateRender<Dayjs>;
        defaultPickerValue: [string, string] | [Dayjs, Dayjs];
        showTime: boolean | (Omit<import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>, "defaultValue"> & {
            defaultValue?: Dayjs[];
        });
        onOk: (dates: [string, string] | [Dayjs, Dayjs]) => void;
        renderExtraFooter: () => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs[]>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        ranges: Record<string, [Dayjs, Dayjs] | (() => [Dayjs, Dayjs])>;
        allowEmpty: [boolean, boolean];
        onCalendarChange: (values: [string, string] | [Dayjs, Dayjs], formatString: [string, string], info: import("../vc-picker/RangePicker").RangeInfo) => void;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        defaultValue: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        value: {
            type: import("vue").PropType<string | Dayjs>;
            default: string | Dayjs;
        };
        presets: {
            type: import("vue").PropType<import("../vc-picker/interface").PresetDate<Dayjs>[]>;
            default: import("../vc-picker/interface").PresetDate<Dayjs>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../vc-picker/interface").DisabledTime<Dayjs>>;
            default: import("../vc-picker/interface").DisabledTime<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>>;
            default: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
            type: import("vue").PropType<string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[]>;
            default: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
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
            type: import("vue").PropType<(value: string | Dayjs, dateString: string) => void>;
            default: (value: string | Dayjs, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | Dayjs) => void>;
            default: (value: string | Dayjs) => void;
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
            type: import("vue").PropType<boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>>;
            default: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
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
            type: import("vue").PropType<import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>>;
            default: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        };
        disabledDate: {
            type: import("vue").PropType<(date: Dayjs) => boolean>;
            default: (date: Dayjs) => boolean;
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
        value: string | Dayjs;
        mode: import("../vc-picker/interface").PanelMode;
        onMouseenter: import("../_util/EventInterface").MouseEventHandler;
        onMouseleave: import("../_util/EventInterface").MouseEventHandler;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onFocus: import("../_util/EventInterface").FocusEventHandler;
        onBlur: import("../_util/EventInterface").FocusEventHandler;
        onChange: (value: string | Dayjs, dateString: string) => void;
        onKeydown: (event: KeyboardEvent, preventDefault: () => void) => void;
        onContextmenu: import("../_util/EventInterface").MouseEventHandler;
        onMousedown: import("../_util/EventInterface").MouseEventHandler;
        onMouseup: import("../_util/EventInterface").MouseEventHandler;
        open: boolean;
        direction: "rtl" | "ltr";
        disabled: boolean;
        autofocus: boolean;
        getPopupContainer: (node: HTMLElement) => HTMLElement;
        disabledDate: (date: Dayjs) => boolean;
        picker: import("../vc-picker/interface").PickerMode;
        locale: import("./generatePicker").PickerLocale;
        format: string | import("../vc-picker/interface").CustomFormat<Dayjs> | (string | import("../vc-picker/interface").CustomFormat<Dayjs>)[];
        disabledHours: () => number[];
        disabledMinutes: (hour: number) => number[];
        disabledSeconds: (hour: number, minute: number) => number[];
        disabledTime: import("../vc-picker/interface").DisabledTime<Dayjs>;
        status: "" | "error" | "warning";
        defaultValue: string | Dayjs;
        'onUpdate:value': (value: string | Dayjs) => void;
        popupStyle: import("vue").CSSProperties;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        onOpenChange: (open: boolean) => void;
        'onUpdate:open': (open: boolean) => void;
        bordered: boolean;
        allowClear: boolean;
        defaultOpen: boolean;
        dateRender: import("../vc-picker/panels/DatePanel/DateBody").DateRender<Dayjs>;
        defaultPickerValue: string | Dayjs;
        showTime: boolean | import("../vc-picker/panels/TimePanel").SharedTimeProps<Dayjs>;
        monthCellRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
        onOk: (value: string | Dayjs) => void;
        showNow: boolean;
        renderExtraFooter: (mode: import("../vc-picker/interface").PanelMode) => import("../_util/type").VueNode;
        showToday: boolean;
        presets: import("../vc-picker/interface").PresetDate<Dayjs>[];
        inputReadOnly: boolean;
        panelRender: (originPanel: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        monthCellContentRender: import("../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<Dayjs>;
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
