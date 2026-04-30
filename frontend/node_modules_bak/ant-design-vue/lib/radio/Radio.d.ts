import type { ExtractPropTypes } from 'vue';
import type { RadioChangeEvent } from './interface';
import type { FocusEventHandler, MouseEventHandler } from '../_util/EventInterface';
export declare const radioProps: () => {
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    isGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    name: StringConstructor;
    id: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(event: RadioChangeEvent) => void>;
        default: (event: RadioChangeEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
};
export type RadioProps = Partial<ExtractPropTypes<ReturnType<typeof radioProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    isGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    name: StringConstructor;
    id: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(event: RadioChangeEvent) => void>;
        default: (event: RadioChangeEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: boolean;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    isGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    name: StringConstructor;
    id: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(event: RadioChangeEvent) => void>;
        default: (event: RadioChangeEvent) => void;
    };
    onFocus: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onBlur: {
        type: import("vue").PropType<FocusEventHandler>;
        default: FocusEventHandler;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
}>> & Readonly<{}>, {
    onClick: MouseEventHandler;
    onFocus: FocusEventHandler;
    onBlur: FocusEventHandler;
    onChange: (event: RadioChangeEvent) => void;
    disabled: boolean;
    autofocus: boolean;
    checked: boolean;
    isGroup: boolean;
    'onUpdate:checked': (checked: boolean) => void;
    'onUpdate:value': (checked: boolean) => void;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
