import type { GenerateConfig } from '../../vc-picker/generate/index';
import type { PanelMode } from '../../vc-picker/interface';
import type { CustomSlotsType } from '../../_util/type';
export default function generateRangePicker<DateType, ExtraProps = {}>(generateConfig: GenerateConfig<DateType>, extraProps: ExtraProps): import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
    [x: string]: unknown;
}> extends {
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../../vc-picker/RangePicker").RangeDateRender<DateType>>;
        default: import("../../vc-picker/RangePicker").RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    value: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    presets: {
        type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType[]>[]>;
        default: import("../../vc-picker/interface").PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes>;
        default: (date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../../_util/type").VueNode>;
        default: () => import("../../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        })>;
        default: boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => [DateType, DateType])>>;
        default: Record<string, [DateType, DateType] | (() => [DateType, DateType])>;
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
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType], dateString: [string, string]) => void>;
        default: (value: [string, string] | [DateType, DateType], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType]) => void>;
        default: (value: [string, string] | [DateType, DateType]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void>;
        default: (values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [DateType, DateType]) => void>;
        default: (dates: [string, string] | [DateType, DateType]) => void;
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
        type: import("vue").PropType<string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[]>;
        default: string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode>;
        default: (originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<import("./interface").PickerLocale>;
        default: import("./interface").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../../config-provider").SizeType>;
        default: import("../../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../../vc-picker/interface").PickerMode>;
        default: import("../../vc-picker/interface").PickerMode;
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
} & ExtraProps ? {} : import("vue").ExtractPropTypes<{
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../../vc-picker/RangePicker").RangeDateRender<DateType>>;
        default: import("../../vc-picker/RangePicker").RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    value: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    presets: {
        type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType[]>[]>;
        default: import("../../vc-picker/interface").PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes>;
        default: (date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../../_util/type").VueNode>;
        default: () => import("../../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        })>;
        default: boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => [DateType, DateType])>>;
        default: Record<string, [DateType, DateType] | (() => [DateType, DateType])>;
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
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType], dateString: [string, string]) => void>;
        default: (value: [string, string] | [DateType, DateType], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType]) => void>;
        default: (value: [string, string] | [DateType, DateType]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void>;
        default: (values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [DateType, DateType]) => void>;
        default: (dates: [string, string] | [DateType, DateType]) => void;
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
        type: import("vue").PropType<string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[]>;
        default: string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode>;
        default: (originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<import("./interface").PickerLocale>;
        default: import("./interface").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../../config-provider").SizeType>;
        default: import("../../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../../vc-picker/interface").PickerMode>;
        default: import("../../vc-picker/interface").PickerMode;
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
} & ExtraProps>, () => import("../../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ComponentObjectPropsOptions<{
    [x: string]: unknown;
}> extends {
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../../vc-picker/RangePicker").RangeDateRender<DateType>>;
        default: import("../../vc-picker/RangePicker").RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    value: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    presets: {
        type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType[]>[]>;
        default: import("../../vc-picker/interface").PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes>;
        default: (date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../../_util/type").VueNode>;
        default: () => import("../../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        })>;
        default: boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => [DateType, DateType])>>;
        default: Record<string, [DateType, DateType] | (() => [DateType, DateType])>;
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
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType], dateString: [string, string]) => void>;
        default: (value: [string, string] | [DateType, DateType], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType]) => void>;
        default: (value: [string, string] | [DateType, DateType]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void>;
        default: (values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [DateType, DateType]) => void>;
        default: (dates: [string, string] | [DateType, DateType]) => void;
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
        type: import("vue").PropType<string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[]>;
        default: string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode>;
        default: (originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<import("./interface").PickerLocale>;
        default: import("./interface").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../../config-provider").SizeType>;
        default: import("../../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../../vc-picker/interface").PickerMode>;
        default: import("../../vc-picker/interface").PickerMode;
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
} & ExtraProps ? {} : import("vue").ExtractPropTypes<{
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../../vc-picker/RangePicker").RangeDateRender<DateType>>;
        default: import("../../vc-picker/RangePicker").RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    value: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    presets: {
        type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType[]>[]>;
        default: import("../../vc-picker/interface").PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes>;
        default: (date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../../_util/type").VueNode>;
        default: () => import("../../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        })>;
        default: boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => [DateType, DateType])>>;
        default: Record<string, [DateType, DateType] | (() => [DateType, DateType])>;
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
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType], dateString: [string, string]) => void>;
        default: (value: [string, string] | [DateType, DateType], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType]) => void>;
        default: (value: [string, string] | [DateType, DateType]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void>;
        default: (values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [DateType, DateType]) => void>;
        default: (dates: [string, string] | [DateType, DateType]) => void;
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
        type: import("vue").PropType<string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[]>;
        default: string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode>;
        default: (originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<import("./interface").PickerLocale>;
        default: import("./interface").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../../config-provider").SizeType>;
        default: import("../../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../../vc-picker/interface").PickerMode>;
        default: import("../../vc-picker/interface").PickerMode;
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
} & ExtraProps>> & Readonly<{}>, import("vue").ExtractDefaultPropTypes<{
    allowEmpty: {
        type: import("vue").PropType<[boolean, boolean]>;
        default: [boolean, boolean];
    };
    dateRender: {
        type: import("vue").PropType<import("../../vc-picker/RangePicker").RangeDateRender<DateType>>;
        default: import("../../vc-picker/RangePicker").RangeDateRender<DateType>;
    };
    defaultPickerValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    defaultValue: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    value: {
        type: import("vue").PropType<[string, string] | [DateType, DateType]>;
        default: [string, string] | [DateType, DateType];
    };
    presets: {
        type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType[]>[]>;
        default: import("../../vc-picker/interface").PresetDate<DateType[]>[];
    };
    disabledTime: {
        type: import("vue").PropType<(date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes>;
        default: (date: DateType, type: import("../../vc-picker/RangePicker").RangeType) => import("../../vc-picker/interface").DisabledTimes;
    };
    disabled: {
        type: import("vue").PropType<boolean | [boolean, boolean]>;
        default: boolean | [boolean, boolean];
    };
    renderExtraFooter: {
        type: import("vue").PropType<() => import("../../_util/type").VueNode>;
        default: () => import("../../_util/type").VueNode;
    };
    separator: {
        type: StringConstructor;
    };
    showTime: {
        type: import("vue").PropType<boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        })>;
        default: boolean | (Omit<import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>, "defaultValue"> & {
            defaultValue?: DateType[];
        });
    };
    ranges: {
        type: import("vue").PropType<Record<string, [DateType, DateType] | (() => [DateType, DateType])>>;
        default: Record<string, [DateType, DateType] | (() => [DateType, DateType])>;
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
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType], dateString: [string, string]) => void>;
        default: (value: [string, string] | [DateType, DateType], dateString: [string, string]) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(value: [string, string] | [DateType, DateType]) => void>;
        default: (value: [string, string] | [DateType, DateType]) => void;
    };
    onCalendarChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void>;
        default: (values: [string, string] | [DateType, DateType], formatString: [string, string], info: import("../../vc-picker/RangePicker").RangeInfo) => void;
    };
    onPanelChange: {
        type: import("vue").PropType<(values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void>;
        default: (values: [string, string] | [DateType, DateType], modes: [PanelMode, PanelMode]) => void;
    };
    onOk: {
        type: import("vue").PropType<(dates: [string, string] | [DateType, DateType]) => void>;
        default: (dates: [string, string] | [DateType, DateType]) => void;
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
        type: import("vue").PropType<string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[]>;
        default: string | import("../../vc-picker/interface").CustomFormat<DateType> | (string | import("../../vc-picker/interface").CustomFormat<DateType>)[];
    };
    getPopupContainer: {
        type: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        default: (node: HTMLElement) => HTMLElement;
    };
    panelRender: {
        type: import("vue").PropType<(originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode>;
        default: (originPanel: import("../../_util/type").VueNode) => import("../../_util/type").VueNode;
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
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<import("../../_util/EventInterface").FocusEventHandler>;
        default: import("../../_util/EventInterface").FocusEventHandler;
    };
    onMousedown: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseup: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseenter: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onMouseleave: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onClick: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
    };
    onContextmenu: {
        type: import("vue").PropType<import("../../_util/EventInterface").MouseEventHandler>;
        default: import("../../_util/EventInterface").MouseEventHandler;
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
        type: import("vue").PropType<import("./interface").PickerLocale>;
        default: import("./interface").PickerLocale;
    };
    size: {
        type: import("vue").PropType<import("../../config-provider").SizeType>;
        default: import("../../config-provider").SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabledDate: {
        type: import("vue").PropType<(date: DateType) => boolean>;
        default: (date: DateType) => boolean;
    };
    picker: {
        type: import("vue").PropType<import("../../vc-picker/interface").PickerMode>;
        default: import("../../vc-picker/interface").PickerMode;
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
} & ExtraProps>, CustomSlotsType<{
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
