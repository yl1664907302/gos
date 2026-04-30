import type { PanelMode, PickerMode } from '../../vc-picker/interface';
import type { GenerateConfig } from '../../vc-picker/generate/index';
import type { CustomSlotsType } from '../../_util/type';
export default function generateSinglePicker<DateType, ExtraProps = {}>(generateConfig: GenerateConfig<DateType>, extraProps: ExtraProps): {
    DatePicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    WeekPicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    MonthPicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    YearPicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    TimePicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    QuarterPicker: import("vue").DefineComponent<import("vue").ComponentObjectPropsOptions<{
        [x: string]: unknown;
    }> extends {
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
            type: import("vue").PropType<import("../../vc-picker/interface").PresetDate<DateType>[]>;
            default: import("../../vc-picker/interface").PresetDate<DateType>[];
        };
        disabledTime: {
            type: import("vue").PropType<import("../../vc-picker/interface").DisabledTime<DateType>>;
            default: import("../../vc-picker/interface").DisabledTime<DateType>;
        };
        renderExtraFooter: {
            type: import("vue").PropType<(mode: PanelMode) => import("../../_util/type").VueNode>;
            default: (mode: PanelMode) => import("../../_util/type").VueNode;
        };
        showNow: {
            type: BooleanConstructor;
            default: boolean;
        };
        monthCellRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
        };
        monthCellContentRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>>;
            default: import("../../vc-picker/panels/MonthPanel/MonthBody").MonthCellRender<DateType>;
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
        onChange: {
            type: import("vue").PropType<(value: string | DateType, dateString: string) => void>;
            default: (value: string | DateType, dateString: string) => void;
        };
        'onUpdate:value': {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
        };
        onOk: {
            type: import("vue").PropType<(value: string | DateType) => void>;
            default: (value: string | DateType) => void;
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
        showTime: {
            type: import("vue").PropType<boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>>;
            default: boolean | import("../../vc-picker/panels/TimePanel").SharedTimeProps<DateType>;
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
        dateRender: {
            type: import("vue").PropType<import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>>;
            default: import("../../vc-picker/panels/DatePanel/DateBody").DateRender<DateType>;
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
        monthCellRender?: any;
        monthCellContentRender?: any;
        clearIcon?: any;
        default?: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
};
