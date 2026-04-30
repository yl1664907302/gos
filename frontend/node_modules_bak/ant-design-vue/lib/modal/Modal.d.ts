import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import type { ButtonProps as ButtonPropsType, LegacyButtonType } from '../button/buttonTypes';
import type { Direction } from '../config-provider';
import type { VueNode } from '../_util/type';
export declare const modalProps: () => {
    prefixCls: StringConstructor;
    /** @deprecated Please use `open` instead. */
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
    onOk: PropType<(e: MouseEvent) => void>;
    onCancel: PropType<(e: MouseEvent) => void>;
    'onUpdate:visible': PropType<(visible: boolean) => void>;
    'onUpdate:open': PropType<(open: boolean) => void>;
    onChange: PropType<(open: boolean) => void>;
    afterClose: PropType<() => void>;
    centered: {
        type: BooleanConstructor;
        default: any;
    };
    width: (StringConstructor | NumberConstructor)[];
    footer: import("vue-types").VueTypeValidableDef<any>;
    okText: import("vue-types").VueTypeValidableDef<any>;
    okType: PropType<LegacyButtonType>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    cancelButtonProps: {
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
        type: PropType<string | false | HTMLElement | getContainerFunc>;
        default: any;
    };
    zIndex: NumberConstructor;
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
    modalRender: PropType<(arg: {
        originVNode: VueNode;
    }) => VueNode>;
    mousePosition: {
        type: PropType<{
            x: number;
            y: number;
        }>;
        default: {
            x: number;
            y: number;
        };
    };
};
export type ModalProps = Partial<ExtractPropTypes<ReturnType<typeof modalProps>>>;
export interface ModalFuncProps {
    prefixCls?: string;
    class?: string;
    open?: boolean;
    title?: string | (() => VueNode) | VueNode;
    footer?: string | (() => VueNode) | VueNode;
    closable?: boolean;
    content?: string | (() => VueNode) | VueNode;
    onOk?: (...args: any[]) => any;
    onCancel?: (...args: any[]) => any;
    afterClose?: () => void;
    okButtonProps?: ButtonPropsType;
    cancelButtonProps?: ButtonPropsType;
    centered?: boolean;
    width?: string | number;
    okText?: string | (() => VueNode) | VueNode;
    okType?: LegacyButtonType;
    cancelText?: string | (() => VueNode) | VueNode;
    icon?: (() => VueNode) | VueNode;
    wrapClassName?: String;
    iconType?: string;
    mask?: boolean;
    maskClosable?: boolean;
    zIndex?: number;
    okCancel?: boolean;
    style?: CSSProperties | string;
    maskStyle?: CSSProperties;
    type?: 'info' | 'success' | 'error' | 'warn' | 'warning' | 'confirm';
    keyboard?: boolean;
    getContainer?: string | HTMLElement | getContainerFunc | false | null;
    autoFocusButton?: null | 'ok' | 'cancel';
    transitionName?: string;
    maskTransitionName?: string;
    direction?: Direction;
    bodyStyle?: CSSProperties;
    closeIcon?: string | (() => VueNode) | VueNode;
    modalRender?: (arg: {
        originVNode: VueNode;
    }) => VueNode;
    focusTriggerAfterClose?: boolean;
    /** @deprecated please use `appContext` instead */
    parentContext?: any;
    appContext?: any;
    /** @deprecated please use `open` instead */
    visible?: boolean;
}
type getContainerFunc = () => HTMLElement;
export type ModalFunc = (props: ModalFuncProps) => {
    destroy: () => void;
    update: (newConfig: ModalFuncProps) => void;
};
export interface ModalLocale {
    okText: string;
    cancelText: string;
    justOkText: string;
}
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    /** @deprecated Please use `open` instead. */
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
    onOk: PropType<(e: MouseEvent) => void>;
    onCancel: PropType<(e: MouseEvent) => void>;
    'onUpdate:visible': PropType<(visible: boolean) => void>;
    'onUpdate:open': PropType<(open: boolean) => void>;
    onChange: PropType<(open: boolean) => void>;
    afterClose: PropType<() => void>;
    centered: {
        type: BooleanConstructor;
        default: any;
    };
    width: (StringConstructor | NumberConstructor)[];
    footer: import("vue-types").VueTypeValidableDef<any>;
    okText: import("vue-types").VueTypeValidableDef<any>;
    okType: PropType<LegacyButtonType>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    cancelButtonProps: {
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
        type: PropType<string | false | HTMLElement | getContainerFunc>;
        default: any;
    };
    zIndex: NumberConstructor;
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
    modalRender: PropType<(arg: {
        originVNode: VueNode;
    }) => VueNode>;
    mousePosition: {
        type: PropType<{
            x: number;
            y: number;
        }>;
        default: {
            x: number;
            y: number;
        };
    };
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    /** @deprecated Please use `open` instead. */
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
    onOk: PropType<(e: MouseEvent) => void>;
    onCancel: PropType<(e: MouseEvent) => void>;
    'onUpdate:visible': PropType<(visible: boolean) => void>;
    'onUpdate:open': PropType<(open: boolean) => void>;
    onChange: PropType<(open: boolean) => void>;
    afterClose: PropType<() => void>;
    centered: {
        type: BooleanConstructor;
        default: any;
    };
    width: (StringConstructor | NumberConstructor)[];
    footer: import("vue-types").VueTypeValidableDef<any>;
    okText: import("vue-types").VueTypeValidableDef<any>;
    okType: PropType<LegacyButtonType>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
        }>>;
    };
    cancelButtonProps: {
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
            };
            onMousedown: {
                type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
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
        type: PropType<string | false | HTMLElement | getContainerFunc>;
        default: any;
    };
    zIndex: NumberConstructor;
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
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
    modalRender: PropType<(arg: {
        originVNode: VueNode;
    }) => VueNode>;
    mousePosition: {
        type: PropType<{
            x: number;
            y: number;
        }>;
        default: {
            x: number;
            y: number;
        };
    };
}>> & Readonly<{}>, {
    mask: boolean;
    open: boolean;
    visible: boolean;
    getContainer: string | false | HTMLElement | getContainerFunc;
    forceRender: boolean;
    maskClosable: boolean;
    keyboard: boolean;
    closable: boolean;
    centered: boolean;
    bodyStyle: CSSProperties;
    maskStyle: CSSProperties;
    destroyOnClose: boolean;
    mousePosition: {
        x: number;
        y: number;
    };
    focusTriggerAfterClose: boolean;
    confirmLoading: boolean;
    okButtonProps: Partial<ExtractPropTypes<{
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
            type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
        onMousedown: {
            type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
    }>>;
    cancelButtonProps: Partial<ExtractPropTypes<{
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
            type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
        onMousedown: {
            type: PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
        };
    }>>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
