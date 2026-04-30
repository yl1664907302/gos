import type { ExtractPropTypes, PropType } from 'vue';
import type { VueNode } from '../_util/type';
import type { CompositionEventHandler } from '../_util/EventInterface';
export declare const inputDefaultValue: string;
export interface AutoSizeType {
    minRows?: number;
    maxRows?: number;
}
declare const inputProps: () => Omit<{
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
        type: PropType<import("../config-provider").SizeType>;
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
        type: PropType<boolean | import("../vc-input/inputProps").ShowCountProps>;
    };
    htmlSize: NumberConstructor;
    onPressEnter: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeydown: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onKeyup: PropType<import("../_util/EventInterface").KeyboardEventHandler>;
    onFocus: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: PropType<import("../_util/EventInterface").FocusEventHandler>;
    onChange: PropType<import("../_util/EventInterface").ChangeEventHandler>;
    onInput: PropType<import("../_util/EventInterface").ChangeEventHandler>;
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
    handleReset: PropType<import("../_util/EventInterface").MouseEventHandler>;
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
}, "wrapperClassName" | "affixWrapperClassName" | "groupClassName" | "inputClassName">;
export default inputProps;
export type InputProps = Partial<ExtractPropTypes<ReturnType<typeof inputProps>>>;
export interface ShowCountProps {
    formatter: (args: {
        count: number;
        maxlength?: number;
    }) => VueNode;
}
declare const textAreaProps: () => {
    rows: NumberConstructor;
    autosize: {
        type: PropType<boolean | AutoSizeType>;
        default: any;
    };
    autoSize: {
        type: PropType<boolean | AutoSizeType>;
        default: any;
    };
    onResize: {
        type: PropType<(size: {
            width: number;
            height: number;
        }) => void>;
    };
    onCompositionstart: {
        type: PropType<CompositionEventHandler | CompositionEventHandler[]>;
    };
    onCompositionend: {
        type: PropType<CompositionEventHandler | CompositionEventHandler[]>;
    };
    valueModifiers: ObjectConstructor;
    size: {
        type: PropType<import("../config-provider").SizeType>;
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
    inputElement: import("vue-types").VueTypeValidableDef<any>;
    triggerFocus: PropType<() => void>;
    handleReset: PropType<import("../_util/EventInterface").MouseEventHandler>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
};
export { textAreaProps };
export type TextAreaProps = Partial<ExtractPropTypes<ReturnType<typeof textAreaProps>>>;
