import type { ExtractPropTypes } from 'vue';
import type { RadioChangeEvent, RadioGroupButtonStyle, RadioGroupOptionType } from './interface';
declare const RadioGroupSizeTypes: readonly ["large", "default", "small"];
export type RadioGroupSize = (typeof RadioGroupSizeTypes)[number];
export type RadioGroupOption = RadioGroupOptionType;
export type RadioGroupChildOption = {
    label?: any;
    value: any;
    disabled?: boolean;
};
export declare const radioGroupProps: () => {
    prefixCls: StringConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<"default" | "small" | "large">;
        default: "default" | "small" | "large";
    };
    options: {
        type: import("vue").PropType<(string | number | RadioGroupChildOption)[]>;
        default: (string | number | RadioGroupChildOption)[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    name: StringConstructor;
    buttonStyle: {
        type: import("vue").PropType<RadioGroupButtonStyle>;
        default: RadioGroupButtonStyle;
    };
    id: StringConstructor;
    optionType: {
        type: import("vue").PropType<RadioGroupOptionType>;
        default: RadioGroupOptionType;
    };
    onChange: {
        type: import("vue").PropType<(e: RadioChangeEvent) => void>;
        default: (e: RadioChangeEvent) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(val: any) => void>;
        default: (val: any) => void;
    };
};
export type RadioGroupProps = Partial<ExtractPropTypes<ReturnType<typeof radioGroupProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<"default" | "small" | "large">;
        default: "default" | "small" | "large";
    };
    options: {
        type: import("vue").PropType<(string | number | RadioGroupChildOption)[]>;
        default: (string | number | RadioGroupChildOption)[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    name: StringConstructor;
    buttonStyle: {
        type: import("vue").PropType<RadioGroupButtonStyle>;
        default: RadioGroupButtonStyle;
    };
    id: StringConstructor;
    optionType: {
        type: import("vue").PropType<RadioGroupOptionType>;
        default: RadioGroupOptionType;
    };
    onChange: {
        type: import("vue").PropType<(e: RadioChangeEvent) => void>;
        default: (e: RadioChangeEvent) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(val: any) => void>;
        default: (val: any) => void;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    value: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<"default" | "small" | "large">;
        default: "default" | "small" | "large";
    };
    options: {
        type: import("vue").PropType<(string | number | RadioGroupChildOption)[]>;
        default: (string | number | RadioGroupChildOption)[];
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    name: StringConstructor;
    buttonStyle: {
        type: import("vue").PropType<RadioGroupButtonStyle>;
        default: RadioGroupButtonStyle;
    };
    id: StringConstructor;
    optionType: {
        type: import("vue").PropType<RadioGroupOptionType>;
        default: RadioGroupOptionType;
    };
    onChange: {
        type: import("vue").PropType<(e: RadioChangeEvent) => void>;
        default: (e: RadioChangeEvent) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(val: any) => void>;
        default: (val: any) => void;
    };
}>> & Readonly<{}>, {
    size: "default" | "small" | "large";
    onChange: (e: RadioChangeEvent) => void;
    disabled: boolean;
    'onUpdate:value': (val: any) => void;
    options: (string | number | RadioGroupChildOption)[];
    buttonStyle: RadioGroupButtonStyle;
    optionType: RadioGroupOptionType;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
