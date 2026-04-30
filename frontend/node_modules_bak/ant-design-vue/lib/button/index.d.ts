import type { Plugin } from 'vue';
import ButtonGroup from './button-group';
import type { ButtonProps, ButtonShape, ButtonType } from './buttonTypes';
import type { ButtonGroupProps } from './button-group';
import type { SizeType as ButtonSize } from '../config-provider';
export type { ButtonProps, ButtonShape, ButtonType, ButtonGroupProps, ButtonSize };
export { ButtonGroup };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: import("vue").PropType<ButtonType>;
        htmlType: {
            type: import("vue").PropType<import("./buttonTypes").ButtonHTMLType>;
            default: string;
        };
        shape: {
            type: import("vue").PropType<ButtonShape>;
        };
        size: {
            type: import("vue").PropType<ButtonSize>;
        };
        loading: {
            type: import("vue").PropType<boolean | {
                delay?: number;
            }>;
            default: () => boolean | {
                delay?: number;
            };
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        ghost: {
            type: BooleanConstructor;
            default: any;
        };
        block: {
            type: BooleanConstructor;
            default: any;
        };
        danger: {
            type: BooleanConstructor;
            default: any;
        };
        icon: import("vue-types").VueTypeValidableDef<any>;
        href: StringConstructor;
        target: StringConstructor;
        title: StringConstructor;
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        block: boolean;
        disabled: boolean;
        danger: boolean;
        ghost: boolean;
        htmlType: import("./buttonTypes").ButtonHTMLType;
        loading: boolean | {
            delay?: number;
        };
    }, true, {}, import("../_util/type").CustomSlotsType<{
        icon: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: import("vue").PropType<ButtonType>;
        htmlType: {
            type: import("vue").PropType<import("./buttonTypes").ButtonHTMLType>;
            default: string;
        };
        shape: {
            type: import("vue").PropType<ButtonShape>;
        };
        size: {
            type: import("vue").PropType<ButtonSize>;
        };
        loading: {
            type: import("vue").PropType<boolean | {
                delay?: number;
            }>;
            default: () => boolean | {
                delay?: number;
            };
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        ghost: {
            type: BooleanConstructor;
            default: any;
        };
        block: {
            type: BooleanConstructor;
            default: any;
        };
        danger: {
            type: BooleanConstructor;
            default: any;
        };
        icon: import("vue-types").VueTypeValidableDef<any>;
        href: StringConstructor;
        target: StringConstructor;
        title: StringConstructor;
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
        onMousedown: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        block: boolean;
        disabled: boolean;
        danger: boolean;
        ghost: boolean;
        htmlType: import("./buttonTypes").ButtonHTMLType;
        loading: boolean | {
            delay?: number;
        };
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: import("vue").PropType<ButtonType>;
    htmlType: {
        type: import("vue").PropType<import("./buttonTypes").ButtonHTMLType>;
        default: string;
    };
    shape: {
        type: import("vue").PropType<ButtonShape>;
    };
    size: {
        type: import("vue").PropType<ButtonSize>;
    };
    loading: {
        type: import("vue").PropType<boolean | {
            delay?: number;
        }>;
        default: () => boolean | {
            delay?: number;
        };
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ghost: {
        type: BooleanConstructor;
        default: any;
    };
    block: {
        type: BooleanConstructor;
        default: any;
    };
    danger: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    target: StringConstructor;
    title: StringConstructor;
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    block: boolean;
    disabled: boolean;
    danger: boolean;
    ghost: boolean;
    htmlType: import("./buttonTypes").ButtonHTMLType;
    loading: boolean | {
        delay?: number;
    };
}, {}, string, import("../_util/type").CustomSlotsType<{
    icon: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Group: typeof ButtonGroup;
};
export default _default;
