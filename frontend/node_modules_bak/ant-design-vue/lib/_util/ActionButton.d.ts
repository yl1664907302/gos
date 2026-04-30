import type { ExtractPropTypes, PropType } from 'vue';
import type { LegacyButtonType } from '../button/buttonTypes';
declare const actionButtonProps: {
    type: {
        type: PropType<LegacyButtonType>;
    };
    actionFn: PropType<(...args: any[]) => any | PromiseLike<any>>;
    close: FunctionConstructor;
    autofocus: BooleanConstructor;
    prefixCls: StringConstructor;
    buttonProps: {
        type: PropType<Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>>;
        default: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    emitEvent: BooleanConstructor;
    quitOnNullishReturnValue: BooleanConstructor;
};
export type ActionButtonProps = ExtractPropTypes<typeof actionButtonProps>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    type: {
        type: PropType<LegacyButtonType>;
    };
    actionFn: PropType<(...args: any[]) => any>;
    close: FunctionConstructor;
    autofocus: BooleanConstructor;
    prefixCls: StringConstructor;
    buttonProps: {
        type: PropType<Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>>;
        default: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    emitEvent: BooleanConstructor;
    quitOnNullishReturnValue: BooleanConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    type: {
        type: PropType<LegacyButtonType>;
    };
    actionFn: PropType<(...args: any[]) => any>;
    close: FunctionConstructor;
    autofocus: BooleanConstructor;
    prefixCls: StringConstructor;
    buttonProps: {
        type: PropType<Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>>;
        default: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: PropType<import("../button").ButtonType>;
            htmlType: {
                type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: PropType<import("../button").ButtonShape>;
            };
            size: {
                type: PropType<import("../button").ButtonSize>;
            };
            loading: {
                type: PropType<boolean | {
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
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    emitEvent: BooleanConstructor;
    quitOnNullishReturnValue: BooleanConstructor;
}>> & Readonly<{}>, {
    autofocus: boolean;
    buttonProps: Partial<ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: PropType<import("../button").ButtonType>;
        htmlType: {
            type: PropType<import("../button/buttonTypes").ButtonHTMLType>;
            default: string;
        };
        shape: {
            type: PropType<import("../button").ButtonShape>;
        };
        size: {
            type: PropType<import("../button").ButtonSize>;
        };
        loading: {
            type: PropType<boolean | {
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
            type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
        };
        onMousedown: {
            type: PropType<import("./EventInterface").MouseEventHandler | import("./EventInterface").MouseEventHandler[]>;
        };
    }>>;
    emitEvent: boolean;
    quitOnNullishReturnValue: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
