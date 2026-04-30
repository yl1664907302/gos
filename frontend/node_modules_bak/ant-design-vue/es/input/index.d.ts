import type { Plugin } from 'vue';
import Group from './Group';
import Search from './Search';
import TextArea from './TextArea';
import Password from './Password';
export type { InputProps, TextAreaProps } from './inputProps';
export { Group as InputGroup, Search as InputSearch, TextArea as Textarea, Password as InputPassword, };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<Omit<{
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
            type: import("vue").PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
        };
        htmlSize: NumberConstructor;
        onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
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
    }, "wrapperClassName" | "affixWrapperClassName" | "groupClassName" | "inputClassName">>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
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
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<Omit<{
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
            type: import("vue").PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
        };
        htmlSize: NumberConstructor;
        onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
        onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
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
    }, "wrapperClassName" | "affixWrapperClassName" | "groupClassName" | "inputClassName">>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
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
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<Omit<{
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
        type: import("vue").PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeydown: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: import("vue").PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
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
}, "wrapperClassName" | "affixWrapperClassName" | "groupClassName" | "inputClassName">>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
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
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Group: typeof Group;
    readonly Search: typeof Search;
    readonly TextArea: typeof TextArea;
    readonly Password: typeof Password;
};
export default _default;
