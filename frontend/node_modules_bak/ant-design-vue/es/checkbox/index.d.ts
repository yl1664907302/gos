import type { Plugin } from 'vue';
import CheckboxGroup from './Group';
export type { CheckboxProps, CheckboxGroupProps, CheckboxOptionType } from './interface';
export { checkboxProps, checkboxGroupProps } from './interface';
export { CheckboxGroup };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<(e: import("./interface").CheckboxChangeEvent) => void>;
            default: (e: import("./interface").CheckboxChangeEvent) => void;
        };
        'onUpdate:checked': {
            type: import("vue").PropType<(checked: boolean) => void>;
            default: (checked: boolean) => void;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        skipGroup: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        type: "checkbox";
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onChange: (e: import("./interface").CheckboxChangeEvent) => void;
        disabled: boolean;
        autofocus: boolean;
        defaultChecked: boolean;
        checked: boolean;
        indeterminate: boolean;
        isGroup: boolean;
        'onUpdate:checked': (checked: boolean) => void;
        skipGroup: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<(e: import("./interface").CheckboxChangeEvent) => void>;
            default: (e: import("./interface").CheckboxChangeEvent) => void;
        };
        'onUpdate:checked': {
            type: import("vue").PropType<(checked: boolean) => void>;
            default: (checked: boolean) => void;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        skipGroup: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        type: "checkbox";
        onClick: import("../_util/EventInterface").MouseEventHandler;
        onChange: (e: import("./interface").CheckboxChangeEvent) => void;
        disabled: boolean;
        autofocus: boolean;
        defaultChecked: boolean;
        checked: boolean;
        indeterminate: boolean;
        isGroup: boolean;
        'onUpdate:checked': (checked: boolean) => void;
        skipGroup: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<(e: import("./interface").CheckboxChangeEvent) => void>;
        default: (e: import("./interface").CheckboxChangeEvent) => void;
    };
    'onUpdate:checked': {
        type: import("vue").PropType<(checked: boolean) => void>;
        default: (checked: boolean) => void;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    skipGroup: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    type: "checkbox";
    onClick: import("../_util/EventInterface").MouseEventHandler;
    onChange: (e: import("./interface").CheckboxChangeEvent) => void;
    disabled: boolean;
    autofocus: boolean;
    defaultChecked: boolean;
    checked: boolean;
    indeterminate: boolean;
    isGroup: boolean;
    'onUpdate:checked': (checked: boolean) => void;
    skipGroup: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Group: typeof CheckboxGroup;
};
export default _default;
