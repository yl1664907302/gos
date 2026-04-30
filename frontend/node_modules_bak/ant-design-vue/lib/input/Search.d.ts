import type { PropType } from 'vue';
import type { ChangeEvent, CompositionEventHandler, MouseEventHandler } from '../_util/EventInterface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    inputPrefixCls: StringConstructor;
    enterButton: import("vue-types").VueTypeValidableDef<any>;
    onSearch: {
        type: PropType<(value: string, event?: ChangeEvent | MouseEvent | KeyboardEvent) => void>;
    };
    size: {
        type: PropType<import("../button").ButtonSize>;
    };
    value: {
        type: PropType<string | number>;
        default: any;
    };
    name: StringConstructor;
    type: {
        type: PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    onCompositionend: PropType<CompositionEventHandler>;
    onCompositionstart: PropType<CompositionEventHandler>;
    onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onChange: PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onKeydown: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
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
    prefix: import("vue-types").VueTypeValidableDef<any>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    autocomplete: StringConstructor;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    status: PropType<"" | "error" | "warning">;
    defaultValue: {
        type: PropType<string | number>;
        default: any;
    };
    'onUpdate:value': PropType<(val: string) => void>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: {
        type: PropType<string | number>;
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
        type: PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    valueModifiers: ObjectConstructor;
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    triggerFocus: PropType<() => void>;
    handleReset: PropType<MouseEventHandler>;
    addonBefore: import("vue-types").VueTypeValidableDef<any>;
    addonAfter: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    inputPrefixCls: StringConstructor;
    enterButton: import("vue-types").VueTypeValidableDef<any>;
    onSearch: {
        type: PropType<(value: string, event?: ChangeEvent | MouseEvent | KeyboardEvent) => void>;
    };
    size: {
        type: PropType<import("../button").ButtonSize>;
    };
    value: {
        type: PropType<string | number>;
        default: any;
    };
    name: StringConstructor;
    type: {
        type: PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    onCompositionend: PropType<CompositionEventHandler>;
    onCompositionstart: PropType<CompositionEventHandler>;
    onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onChange: PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onKeydown: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
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
    prefix: import("vue-types").VueTypeValidableDef<any>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    autocomplete: StringConstructor;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    status: PropType<"" | "error" | "warning">;
    defaultValue: {
        type: PropType<string | number>;
        default: any;
    };
    'onUpdate:value': PropType<(val: string) => void>;
    suffix: import("vue-types").VueTypeValidableDef<any>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: {
        type: PropType<string | number>;
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
        type: PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    valueModifiers: ObjectConstructor;
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    triggerFocus: PropType<() => void>;
    handleReset: PropType<MouseEventHandler>;
    addonBefore: import("vue-types").VueTypeValidableDef<any>;
    addonAfter: import("vue-types").VueTypeValidableDef<any>;
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
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
