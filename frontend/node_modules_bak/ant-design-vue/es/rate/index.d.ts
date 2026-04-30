import type { ExtractPropTypes, PropType } from 'vue';
import type { Direction } from '../config-provider';
import type { FocusEventHandler, KeyboardEventHandler } from '../_util/EventInterface';
export declare const rateProps: () => {
    prefixCls: StringConstructor;
    count: NumberConstructor;
    value: NumberConstructor;
    allowHalf: {
        type: BooleanConstructor;
        default: any;
    };
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    tooltips: PropType<string[]>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    character: import("vue-types").VueTypeValidableDef<any>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    tabindex: import("vue-types").VueTypeDef<string | number>;
    direction: PropType<Direction>;
    id: StringConstructor;
    onChange: PropType<(value: number) => void>;
    onHoverChange: PropType<(value: number) => void>;
    'onUpdate:value': PropType<(value: number) => void>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onKeydown: PropType<KeyboardEventHandler>;
};
export type RateProps = Partial<ExtractPropTypes<ReturnType<typeof rateProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        count: NumberConstructor;
        value: NumberConstructor;
        allowHalf: {
            type: BooleanConstructor;
            default: any;
        };
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        tooltips: PropType<string[]>;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        character: import("vue-types").VueTypeValidableDef<any>;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        tabindex: import("vue-types").VueTypeDef<string | number>;
        direction: PropType<Direction>;
        id: StringConstructor;
        onChange: PropType<(value: number) => void>;
        onHoverChange: PropType<(value: number) => void>;
        'onUpdate:value': PropType<(value: number) => void>;
        onFocus: PropType<FocusEventHandler>;
        onBlur: PropType<FocusEventHandler>;
        onKeydown: PropType<KeyboardEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        disabled: boolean;
        autofocus: boolean;
        allowClear: boolean;
        allowHalf: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        count: NumberConstructor;
        value: NumberConstructor;
        allowHalf: {
            type: BooleanConstructor;
            default: any;
        };
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        tooltips: PropType<string[]>;
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        character: import("vue-types").VueTypeValidableDef<any>;
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        tabindex: import("vue-types").VueTypeDef<string | number>;
        direction: PropType<Direction>;
        id: StringConstructor;
        onChange: PropType<(value: number) => void>;
        onHoverChange: PropType<(value: number) => void>;
        'onUpdate:value': PropType<(value: number) => void>;
        onFocus: PropType<FocusEventHandler>;
        onBlur: PropType<FocusEventHandler>;
        onKeydown: PropType<KeyboardEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        disabled: boolean;
        autofocus: boolean;
        allowClear: boolean;
        allowHalf: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    count: NumberConstructor;
    value: NumberConstructor;
    allowHalf: {
        type: BooleanConstructor;
        default: any;
    };
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    tooltips: PropType<string[]>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    character: import("vue-types").VueTypeValidableDef<any>;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    tabindex: import("vue-types").VueTypeDef<string | number>;
    direction: PropType<Direction>;
    id: StringConstructor;
    onChange: PropType<(value: number) => void>;
    onHoverChange: PropType<(value: number) => void>;
    'onUpdate:value': PropType<(value: number) => void>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onKeydown: PropType<KeyboardEventHandler>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    disabled: boolean;
    autofocus: boolean;
    allowClear: boolean;
    allowHalf: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
