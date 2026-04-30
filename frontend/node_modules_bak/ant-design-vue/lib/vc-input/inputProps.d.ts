import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import type { VueNode } from '../_util/type';
import type { ChangeEventHandler, CompositionEventHandler, FocusEventHandler, KeyboardEventHandler, MouseEventHandler } from '../_util/EventInterface';
import type { InputFocusOptions } from './utils/commonUtils';
export declare const inputDefaultValue: string;
export declare const commonInputProps: () => {
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
};
export declare const baseInputProps: () => {
    value: {
        type: PropType<string | number>;
        default: any;
    };
    defaultValue: {
        type: PropType<string | number>;
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
    triggerFocus: PropType<() => void>;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    handleReset: PropType<MouseEventHandler>;
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
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
};
export declare const inputProps: () => {
    id: StringConstructor;
    placeholder: {
        type: PropType<string | number>;
    };
    autocomplete: StringConstructor;
    type: {
        type: PropType<"number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel">;
        default: "number" | "reset" | "submit" | "button" | "time" | "image" | "text" | "search" | "hidden" | "color" | "checkbox" | "radio" | "range" | "date" | "url" | "email" | "week" | "month" | "datetime-local" | "file" | "password" | "tel";
    };
    name: StringConstructor;
    size: {
        type: PropType<SizeType>;
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
        type: PropType<boolean | ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: PropType<KeyboardEventHandler>;
    onKeydown: PropType<KeyboardEventHandler>;
    onKeyup: PropType<KeyboardEventHandler>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onChange: PropType<ChangeEventHandler>;
    onInput: PropType<ChangeEventHandler>;
    'onUpdate:value': PropType<(val: string) => void>;
    onCompositionstart: PropType<CompositionEventHandler>;
    onCompositionend: PropType<CompositionEventHandler>;
    valueModifiers: ObjectConstructor;
    hidden: {
        type: BooleanConstructor;
        default: any;
    };
    status: PropType<"" | "error" | "warning">;
    value: {
        type: PropType<string | number>;
        default: any;
    };
    defaultValue: {
        type: PropType<string | number>;
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
    triggerFocus: PropType<() => void>;
    readonly: {
        type: BooleanConstructor;
        default: any;
    };
    handleReset: PropType<MouseEventHandler>;
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
};
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;
export interface ShowCountProps {
    formatter: (args: {
        count: number;
        maxlength?: number;
        value?: string;
    }) => VueNode;
}
export interface InputRef {
    focus: (options?: InputFocusOptions) => void;
    blur: () => void;
    setSelectionRange: (start: number, end: number, direction?: 'forward' | 'backward' | 'none') => void;
    select: () => void;
    input: HTMLInputElement | null;
}
