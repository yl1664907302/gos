import type { ExtractPropTypes, InjectionKey, Ref } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { VueNode } from '../_util/type';
export type CheckboxValueType = string | number | boolean;
export interface CheckboxOptionType {
    label?: VueNode;
    value: CheckboxValueType;
    disabled?: boolean;
    indeterminate?: boolean;
    onChange?: (e: CheckboxChangeEvent) => void;
}
export interface CheckboxChangeEvent {
    target: CheckboxChangeEventTarget;
    stopPropagation: () => void;
    preventDefault: () => void;
    nativeEvent: MouseEvent;
}
export interface CheckboxChangeEventTarget extends CheckboxProps {
    checked: boolean;
}
export declare const abstractCheckboxGroupProps: () => {
    name: StringConstructor;
    prefixCls: StringConstructor;
    options: {
        type: import("vue").PropType<(string | number | CheckboxOptionType)[]>;
        default: (string | number | CheckboxOptionType)[];
    };
    disabled: BooleanConstructor;
    id: StringConstructor;
};
export declare const checkboxGroupProps: () => {
    defaultValue: {
        type: import("vue").PropType<CheckboxValueType[]>;
        default: CheckboxValueType[];
    };
    value: {
        type: import("vue").PropType<CheckboxValueType[]>;
        default: CheckboxValueType[];
    };
    onChange: {
        type: import("vue").PropType<(checkedValue: Array<CheckboxValueType>) => void>;
        default: (checkedValue: Array<CheckboxValueType>) => void;
    };
    'onUpdate:value': {
        type: import("vue").PropType<(checkedValue: Array<CheckboxValueType>) => void>;
        default: (checkedValue: Array<CheckboxValueType>) => void;
    };
    name: StringConstructor;
    prefixCls: StringConstructor;
    options: {
        type: import("vue").PropType<(string | number | CheckboxOptionType)[]>;
        default: (string | number | CheckboxOptionType)[];
    };
    disabled: BooleanConstructor;
    id: StringConstructor;
};
export type CheckboxGroupProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxGroupProps>>>;
export declare const abstractCheckboxProps: () => {
    prefixCls: StringConstructor;
    defaultChecked: {
        type: BooleanConstructor;
        default: boolean;
    };
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
    indeterminate: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: import("vue").PropType<"checkbox">;
        default: "checkbox";
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(e: CheckboxChangeEvent) => void>;
        default: (e: CheckboxChangeEvent) => void;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    skipGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export declare const checkboxProps: () => {
    indeterminate: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    defaultChecked: {
        type: BooleanConstructor;
        default: boolean;
    };
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
    type: {
        type: import("vue").PropType<"checkbox">;
        default: "checkbox";
    };
    autofocus: {
        type: BooleanConstructor;
        default: boolean;
    };
    onChange: {
        type: import("vue").PropType<(e: CheckboxChangeEvent) => void>;
        default: (e: CheckboxChangeEvent) => void;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    skipGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type CheckboxProps = Partial<ExtractPropTypes<ReturnType<typeof checkboxProps>>>;
export type CheckboxGroupContext = {
    cancelValue: (id: Symbol) => void;
    registerValue: (id: Symbol, value: string) => void;
    toggleOption: (option: CheckboxOptionType) => void;
    name: Ref<string>;
    disabled: Ref<boolean>;
    mergedValue: Ref<CheckboxValueType[]>;
};
export declare const CheckboxGroupContextKey: InjectionKey<CheckboxGroupContext>;
