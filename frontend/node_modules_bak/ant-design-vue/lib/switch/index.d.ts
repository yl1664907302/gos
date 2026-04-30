import type { ExtractPropTypes, PropType } from 'vue';
import type { CustomSlotsType } from '../_util/type';
import type { FocusEventHandler } from '../_util/EventInterface';
export declare const SwitchSizes: ["small", "default"];
type CheckedType = boolean | string | number;
export declare const switchProps: () => {
    id: StringConstructor;
    prefixCls: StringConstructor;
    size: import("vue-types").VueTypeDef<"default" | "small">;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    checkedChildren: import("vue-types").VueTypeValidableDef<any>;
    unCheckedChildren: import("vue-types").VueTypeValidableDef<any>;
    tabindex: import("vue-types").VueTypeDef<string | number>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    checked: import("vue-types").VueTypeDef<string | number | boolean>;
    checkedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
        default: string | number | boolean;
    };
    unCheckedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
        default: string | number | boolean;
    };
    onChange: {
        type: PropType<(checked: CheckedType, e: Event) => void>;
    };
    onClick: {
        type: PropType<(checked: CheckedType, e: Event) => void>;
    };
    onKeydown: {
        type: PropType<(e: Event) => void>;
    };
    onMouseup: {
        type: PropType<(e: Event) => void>;
    };
    'onUpdate:checked': {
        type: PropType<(checked: CheckedType) => void>;
    };
    onBlur: PropType<FocusEventHandler>;
    onFocus: PropType<FocusEventHandler>;
};
export type SwitchProps = Partial<ExtractPropTypes<ReturnType<typeof switchProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        size: import("vue-types").VueTypeDef<"default" | "small">;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        checkedChildren: import("vue-types").VueTypeValidableDef<any>;
        unCheckedChildren: import("vue-types").VueTypeValidableDef<any>;
        tabindex: import("vue-types").VueTypeDef<string | number>;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        checked: import("vue-types").VueTypeDef<string | number | boolean>;
        checkedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
            default: string | number | boolean;
        };
        unCheckedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
            default: string | number | boolean;
        };
        onChange: {
            type: PropType<(checked: CheckedType, e: Event) => void>;
        };
        onClick: {
            type: PropType<(checked: CheckedType, e: Event) => void>;
        };
        onKeydown: {
            type: PropType<(e: Event) => void>;
        };
        onMouseup: {
            type: PropType<(e: Event) => void>;
        };
        'onUpdate:checked': {
            type: PropType<(checked: CheckedType) => void>;
        };
        onBlur: PropType<FocusEventHandler>;
        onFocus: PropType<FocusEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        disabled: boolean;
        autofocus: boolean;
        loading: boolean;
        checkedValue: string | number | boolean;
        unCheckedValue: string | number | boolean;
    }, true, {}, CustomSlotsType<{
        checkedChildren: any;
        unCheckedChildren: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        size: import("vue-types").VueTypeDef<"default" | "small">;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        checkedChildren: import("vue-types").VueTypeValidableDef<any>;
        unCheckedChildren: import("vue-types").VueTypeValidableDef<any>;
        tabindex: import("vue-types").VueTypeDef<string | number>;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        checked: import("vue-types").VueTypeDef<string | number | boolean>;
        checkedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
            default: string | number | boolean;
        };
        unCheckedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
            default: string | number | boolean;
        };
        onChange: {
            type: PropType<(checked: CheckedType, e: Event) => void>;
        };
        onClick: {
            type: PropType<(checked: CheckedType, e: Event) => void>;
        };
        onKeydown: {
            type: PropType<(e: Event) => void>;
        };
        onMouseup: {
            type: PropType<(e: Event) => void>;
        };
        'onUpdate:checked': {
            type: PropType<(checked: CheckedType) => void>;
        };
        onBlur: PropType<FocusEventHandler>;
        onFocus: PropType<FocusEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        disabled: boolean;
        autofocus: boolean;
        loading: boolean;
        checkedValue: string | number | boolean;
        unCheckedValue: string | number | boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    size: import("vue-types").VueTypeDef<"default" | "small">;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    checkedChildren: import("vue-types").VueTypeValidableDef<any>;
    unCheckedChildren: import("vue-types").VueTypeValidableDef<any>;
    tabindex: import("vue-types").VueTypeDef<string | number>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    checked: import("vue-types").VueTypeDef<string | number | boolean>;
    checkedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
        default: string | number | boolean;
    };
    unCheckedValue: import("vue-types").VueTypeDef<string | number | boolean> & {
        default: string | number | boolean;
    };
    onChange: {
        type: PropType<(checked: CheckedType, e: Event) => void>;
    };
    onClick: {
        type: PropType<(checked: CheckedType, e: Event) => void>;
    };
    onKeydown: {
        type: PropType<(e: Event) => void>;
    };
    onMouseup: {
        type: PropType<(e: Event) => void>;
    };
    'onUpdate:checked': {
        type: PropType<(checked: CheckedType) => void>;
    };
    onBlur: PropType<FocusEventHandler>;
    onFocus: PropType<FocusEventHandler>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    disabled: boolean;
    autofocus: boolean;
    loading: boolean;
    checkedValue: string | number | boolean;
    unCheckedValue: string | number | boolean;
}, {}, string, CustomSlotsType<{
    checkedChildren: any;
    unCheckedChildren: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
