declare const ResizableTextArea: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    rows: NumberConstructor;
    autosize: {
        type: import("vue").PropType<boolean | import("./inputProps").AutoSizeType>;
        default: any;
    };
    autoSize: {
        type: import("vue").PropType<boolean | import("./inputProps").AutoSizeType>;
        default: any;
    };
    onResize: {
        type: import("vue").PropType<(size: {
            width: number;
            height: number;
        }) => void>;
    };
    onCompositionstart: {
        type: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler | import("../_util/EventInterface").CompositionEventHandler[]>;
    };
    onCompositionend: {
        type: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler | import("../_util/EventInterface").CompositionEventHandler[]>;
    };
    valueModifiers: ObjectConstructor;
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
    };
    value: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    name: StringConstructor;
    type: {
        type: import("vue").PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onChange: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    autocomplete: StringConstructor;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    status: import("vue").PropType<"" | "error" | "warning">;
    defaultValue: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    'onUpdate:value': import("vue").PropType<(val: string) => void>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: {
        type: import("vue").PropType<string | number>;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    maxlength: NumberConstructor;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    showCount: {
        type: import("vue").PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    triggerFocus: import("vue").PropType<() => void>;
    handleReset: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    rows: NumberConstructor;
    autosize: {
        type: import("vue").PropType<boolean | import("./inputProps").AutoSizeType>;
        default: any;
    };
    autoSize: {
        type: import("vue").PropType<boolean | import("./inputProps").AutoSizeType>;
        default: any;
    };
    onResize: {
        type: import("vue").PropType<(size: {
            width: number;
            height: number;
        }) => void>;
    };
    onCompositionstart: {
        type: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler | import("../_util/EventInterface").CompositionEventHandler[]>;
    };
    onCompositionend: {
        type: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler | import("../_util/EventInterface").CompositionEventHandler[]>;
    };
    valueModifiers: ObjectConstructor;
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
    };
    value: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    name: StringConstructor;
    type: {
        type: import("vue").PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onChange: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    autocomplete: StringConstructor;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    status: import("vue").PropType<"" | "error" | "warning">;
    defaultValue: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    'onUpdate:value': import("vue").PropType<(val: string) => void>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: {
        type: import("vue").PropType<string | number>;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    maxlength: NumberConstructor;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    showCount: {
        type: import("vue").PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    triggerFocus: import("vue").PropType<() => void>;
    handleReset: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, {
    value: string | number;
    type: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    focused: boolean;
    hidden: boolean;
    disabled: boolean;
    autofocus: boolean;
    readonly: boolean;
    defaultValue: string | number;
    loading: boolean;
    lazy: boolean;
    bordered: boolean;
    allowClear: boolean;
    autosize: any;
    autoSize: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default ResizableTextArea;
