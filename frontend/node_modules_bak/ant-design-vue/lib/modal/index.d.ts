import type { Plugin } from 'vue';
import type { ModalFunc } from './Modal';
import useModal from './useModal';
export type { ActionButtonProps } from '../_util/ActionButton';
export type { ModalProps, ModalFuncProps } from './Modal';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        open: {
            type: BooleanConstructor;
            default: any;
        };
        confirmLoading: {
            type: BooleanConstructor;
            default: any;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        onOk: import("vue").PropType<(e: MouseEvent) => void>;
        onCancel: import("vue").PropType<(e: MouseEvent) => void>;
        'onUpdate:visible': import("vue").PropType<(visible: boolean) => void>;
        'onUpdate:open': import("vue").PropType<(open: boolean) => void>;
        onChange: import("vue").PropType<(open: boolean) => void>;
        afterClose: import("vue").PropType<() => void>;
        centered: {
            type: BooleanConstructor;
            default: any;
        };
        width: (StringConstructor | NumberConstructor)[];
        footer: import("vue-types").VueTypeValidableDef<any>;
        okText: import("vue-types").VueTypeValidableDef<any>;
        okType: import("vue").PropType<import("../button/buttonTypes").LegacyButtonType>;
        cancelText: import("vue-types").VueTypeValidableDef<any>;
        icon: import("vue-types").VueTypeValidableDef<any>;
        maskClosable: {
            type: BooleanConstructor;
            default: any;
        };
        forceRender: {
            type: BooleanConstructor;
            default: any;
        };
        okButtonProps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>>;
            default: Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>;
        };
        cancelButtonProps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>>;
            default: Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>;
        };
        destroyOnClose: {
            type: BooleanConstructor;
            default: any;
        };
        wrapClassName: StringConstructor;
        maskTransitionName: StringConstructor;
        transitionName: StringConstructor;
        getContainer: {
            type: import("vue").PropType<string | false | HTMLElement | (() => HTMLElement)>;
            default: any;
        };
        zIndex: NumberConstructor;
        bodyStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        maskStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        mask: {
            type: BooleanConstructor;
            default: any;
        };
        keyboard: {
            type: BooleanConstructor;
            default: any;
        };
        wrapProps: ObjectConstructor;
        focusTriggerAfterClose: {
            type: BooleanConstructor;
            default: any;
        };
        modalRender: import("vue").PropType<(arg: {
            originVNode: import("../_util/type").VueNode;
        }) => import("../_util/type").VueNode>;
        mousePosition: {
            type: import("vue").PropType<{
                x: number;
                y: number;
            }>;
            default: {
                x: number;
                y: number;
            };
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        mask: boolean;
        open: boolean;
        visible: boolean;
        getContainer: string | false | HTMLElement | (() => HTMLElement);
        forceRender: boolean;
        maskClosable: boolean;
        keyboard: boolean;
        closable: boolean;
        centered: boolean;
        bodyStyle: import("vue").CSSProperties;
        maskStyle: import("vue").CSSProperties;
        destroyOnClose: boolean;
        mousePosition: {
            x: number;
            y: number;
        };
        focusTriggerAfterClose: boolean;
        confirmLoading: boolean;
        okButtonProps: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
        cancelButtonProps: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        open: {
            type: BooleanConstructor;
            default: any;
        };
        confirmLoading: {
            type: BooleanConstructor;
            default: any;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        onOk: import("vue").PropType<(e: MouseEvent) => void>;
        onCancel: import("vue").PropType<(e: MouseEvent) => void>;
        'onUpdate:visible': import("vue").PropType<(visible: boolean) => void>;
        'onUpdate:open': import("vue").PropType<(open: boolean) => void>;
        onChange: import("vue").PropType<(open: boolean) => void>;
        afterClose: import("vue").PropType<() => void>;
        centered: {
            type: BooleanConstructor;
            default: any;
        };
        width: (StringConstructor | NumberConstructor)[];
        footer: import("vue-types").VueTypeValidableDef<any>;
        okText: import("vue-types").VueTypeValidableDef<any>;
        okType: import("vue").PropType<import("../button/buttonTypes").LegacyButtonType>;
        cancelText: import("vue-types").VueTypeValidableDef<any>;
        icon: import("vue-types").VueTypeValidableDef<any>;
        maskClosable: {
            type: BooleanConstructor;
            default: any;
        };
        forceRender: {
            type: BooleanConstructor;
            default: any;
        };
        okButtonProps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>>;
            default: Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>;
        };
        cancelButtonProps: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>>;
            default: Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                type: import("vue").PropType<import("../button").ButtonType>;
                htmlType: {
                    type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                    default: string;
                };
                shape: {
                    type: import("vue").PropType<import("../button").ButtonShape>;
                };
                size: {
                    type: import("vue").PropType<import("../config-provider").SizeType>;
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
            }>>;
        };
        destroyOnClose: {
            type: BooleanConstructor;
            default: any;
        };
        wrapClassName: StringConstructor;
        maskTransitionName: StringConstructor;
        transitionName: StringConstructor;
        getContainer: {
            type: import("vue").PropType<string | false | HTMLElement | (() => HTMLElement)>;
            default: any;
        };
        zIndex: NumberConstructor;
        bodyStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        maskStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        mask: {
            type: BooleanConstructor;
            default: any;
        };
        keyboard: {
            type: BooleanConstructor;
            default: any;
        };
        wrapProps: ObjectConstructor;
        focusTriggerAfterClose: {
            type: BooleanConstructor;
            default: any;
        };
        modalRender: import("vue").PropType<(arg: {
            originVNode: import("../_util/type").VueNode;
        }) => import("../_util/type").VueNode>;
        mousePosition: {
            type: import("vue").PropType<{
                x: number;
                y: number;
            }>;
            default: {
                x: number;
                y: number;
            };
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        mask: boolean;
        open: boolean;
        visible: boolean;
        getContainer: string | false | HTMLElement | (() => HTMLElement);
        forceRender: boolean;
        maskClosable: boolean;
        keyboard: boolean;
        closable: boolean;
        centered: boolean;
        bodyStyle: import("vue").CSSProperties;
        maskStyle: import("vue").CSSProperties;
        destroyOnClose: boolean;
        mousePosition: {
            x: number;
            y: number;
        };
        focusTriggerAfterClose: boolean;
        confirmLoading: boolean;
        okButtonProps: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
        cancelButtonProps: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    confirmLoading: {
        type: BooleanConstructor;
        default: any;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    onOk: import("vue").PropType<(e: MouseEvent) => void>;
    onCancel: import("vue").PropType<(e: MouseEvent) => void>;
    'onUpdate:visible': import("vue").PropType<(visible: boolean) => void>;
    'onUpdate:open': import("vue").PropType<(open: boolean) => void>;
    onChange: import("vue").PropType<(open: boolean) => void>;
    afterClose: import("vue").PropType<() => void>;
    centered: {
        type: BooleanConstructor;
        default: any;
    };
    width: (StringConstructor | NumberConstructor)[];
    footer: import("vue-types").VueTypeValidableDef<any>;
    okText: import("vue-types").VueTypeValidableDef<any>;
    okType: import("vue").PropType<import("../button/buttonTypes").LegacyButtonType>;
    cancelText: import("vue-types").VueTypeValidableDef<any>;
    icon: import("vue-types").VueTypeValidableDef<any>;
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    okButtonProps: {
        type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>>;
        default: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
    };
    cancelButtonProps: {
        type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>>;
        default: Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            type: import("vue").PropType<import("../button").ButtonType>;
            htmlType: {
                type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
                default: string;
            };
            shape: {
                type: import("vue").PropType<import("../button").ButtonShape>;
            };
            size: {
                type: import("vue").PropType<import("../config-provider").SizeType>;
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
        }>>;
    };
    destroyOnClose: {
        type: BooleanConstructor;
        default: any;
    };
    wrapClassName: StringConstructor;
    maskTransitionName: StringConstructor;
    transitionName: StringConstructor;
    getContainer: {
        type: import("vue").PropType<string | false | HTMLElement | (() => HTMLElement)>;
        default: any;
    };
    zIndex: NumberConstructor;
    bodyStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    maskStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    mask: {
        type: BooleanConstructor;
        default: any;
    };
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    wrapProps: ObjectConstructor;
    focusTriggerAfterClose: {
        type: BooleanConstructor;
        default: any;
    };
    modalRender: import("vue").PropType<(arg: {
        originVNode: import("../_util/type").VueNode;
    }) => import("../_util/type").VueNode>;
    mousePosition: {
        type: import("vue").PropType<{
            x: number;
            y: number;
        }>;
        default: {
            x: number;
            y: number;
        };
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    mask: boolean;
    open: boolean;
    visible: boolean;
    getContainer: string | false | HTMLElement | (() => HTMLElement);
    forceRender: boolean;
    maskClosable: boolean;
    keyboard: boolean;
    closable: boolean;
    centered: boolean;
    bodyStyle: import("vue").CSSProperties;
    maskStyle: import("vue").CSSProperties;
    destroyOnClose: boolean;
    mousePosition: {
        x: number;
        y: number;
    };
    focusTriggerAfterClose: boolean;
    confirmLoading: boolean;
    okButtonProps: Partial<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: import("vue").PropType<import("../button").ButtonType>;
        htmlType: {
            type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
            default: string;
        };
        shape: {
            type: import("vue").PropType<import("../button").ButtonShape>;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
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
    }>>;
    cancelButtonProps: Partial<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: import("vue").PropType<import("../button").ButtonType>;
        htmlType: {
            type: import("vue").PropType<import("../button/buttonTypes").ButtonHTMLType>;
            default: string;
        };
        shape: {
            type: import("vue").PropType<import("../button").ButtonShape>;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
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
    }>>;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly info: ModalFunc;
    readonly success: ModalFunc;
    readonly error: ModalFunc;
    readonly warn: ModalFunc;
    readonly warning: ModalFunc;
    readonly confirm: ModalFunc;
    readonly destroyAll: () => void;
    readonly useModal: typeof useModal;
};
export default _default;
