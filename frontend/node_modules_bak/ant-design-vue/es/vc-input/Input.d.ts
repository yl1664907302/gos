import type { FocusEventHandler } from '../_util/EventInterface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    id: StringConstructor;
    placeholder: {
        type: import("vue").PropType<string | number>;
    };
    autocomplete: StringConstructor;
    type: {
        type: import("vue").PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    name: StringConstructor;
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    maxlength: NumberConstructor;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    showCount: {
        type: import("vue").PropType<boolean | import("./inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onFocus: import("vue").PropType<FocusEventHandler>;
    onBlur: import("vue").PropType<FocusEventHandler>;
    onChange: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    'onUpdate:value': import("vue").PropType<(val: string) => void>;
    onCompositionstart: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler>;
    onCompositionend: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler>;
    valueModifiers: ObjectConstructor;
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
    status: import("vue").PropType<"" | "error" | "warning">;
    value: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    defaultValue: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    triggerFocus: import("vue").PropType<() => void>;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    handleReset: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    addonBefore: import("vue-types").VueTypeValidableDef<any>;
    addonAfter: import("vue-types").VueTypeValidableDef<any>;
    prefix: import("vue-types").VueTypeValidableDef<any>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    affixWrapperClassName: StringConstructor;
    groupClassName: StringConstructor;
    wrapperClassName: StringConstructor;
    inputClassName: StringConstructor;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    id: StringConstructor;
    placeholder: {
        type: import("vue").PropType<string | number>;
    };
    autocomplete: StringConstructor;
    type: {
        type: import("vue").PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    name: StringConstructor;
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    lazy: {
        type: BooleanConstructor;
        default: boolean;
    };
    maxlength: NumberConstructor;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    showCount: {
        type: import("vue").PropType<boolean | import("./inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onFocus: import("vue").PropType<FocusEventHandler>;
    onBlur: import("vue").PropType<FocusEventHandler>;
    onChange: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: import("vue").PropType<import("../_util/EventInterface").ChangeEventHandler>;
    'onUpdate:value': import("vue").PropType<(val: string) => void>;
    onCompositionstart: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler>;
    onCompositionend: import("vue").PropType<import("../_util/EventInterface").CompositionEventHandler>;
    valueModifiers: ObjectConstructor;
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
    status: import("vue").PropType<"" | "error" | "warning">;
    value: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    defaultValue: {
        type: import("vue").PropType<string | number>;
        default: any;
    };
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    prefixCls: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    focused: {
        type: BooleanConstructor;
        default: any;
    };
    triggerFocus: import("vue").PropType<() => void>;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    handleReset: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    addonBefore: import("vue-types").VueTypeValidableDef<any>;
    addonAfter: import("vue-types").VueTypeValidableDef<any>;
    prefix: import("vue-types").VueTypeValidableDef<any>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    affixWrapperClassName: StringConstructor;
    groupClassName: StringConstructor;
    wrapperClassName: StringConstructor;
    inputClassName: StringConstructor;
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
