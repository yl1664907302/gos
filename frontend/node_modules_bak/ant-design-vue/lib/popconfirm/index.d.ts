import type { ExtractPropTypes, HTMLAttributes, PropType } from 'vue';
import type { LegacyButtonType } from '../button/buttonTypes';
import type { CustomSlotsType } from '../_util/type';
export declare const popconfirmProps: () => {
    prefixCls: StringConstructor;
    content: {
        default: any;
        type: PropType<any>;
    };
    title: {
        default: string | number;
        type: PropType<string | number>;
    };
    description: {
        default: string | number;
        type: PropType<string | number>;
    };
    okType: {
        type: PropType<LegacyButtonType>;
        default: LegacyButtonType;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    okText: {
        default: any;
        type: PropType<any>;
    };
    cancelText: {
        default: any;
        type: PropType<any>;
    };
    icon: {
        default: any;
        type: PropType<any>;
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
        }>> & HTMLAttributes>;
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
        }>> & HTMLAttributes;
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
        }>> & HTMLAttributes>;
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
        }>> & HTMLAttributes;
    };
    showCancel: {
        type: BooleanConstructor;
        default: boolean;
    };
    onConfirm: PropType<(e: MouseEvent) => void>;
    onCancel: PropType<(e: MouseEvent) => void>;
    trigger: PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    placement: PropType<import("../tooltip/abstractTooltipProps").TooltipPlacement>;
    color: PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
    transitionName: StringConstructor;
    overlayStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayInnerStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayClassName: StringConstructor;
    openClassName: StringConstructor;
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    getPopupContainer: PropType<(triggerNode: HTMLElement) => HTMLElement>;
    arrowPointAtCenter: {
        type: BooleanConstructor;
        default: any;
    };
    arrow: {
        type: PropType<boolean | {
            pointAtCenter?: boolean;
        }>;
        default: boolean | {
            pointAtCenter?: boolean;
        };
    };
    autoAdjustOverflow: {
        type: PropType<boolean | import("../_util/placements").AdjustOverflow>;
        default: boolean | import("../_util/placements").AdjustOverflow;
    };
    destroyTooltipOnHide: {
        type: BooleanConstructor;
        default: any;
    };
    align: {
        type: PropType<import("../vc-trigger/interface").AlignType>;
        default: import("../vc-trigger/interface").AlignType;
    };
    builtinPlacements: {
        type: PropType<import("../vc-trigger/interface").BuildInPlacements>;
        default: import("../vc-trigger/interface").BuildInPlacements;
    };
    children: ArrayConstructor;
    onVisibleChange: PropType<(vis: boolean) => void>;
    'onUpdate:visible': PropType<(vis: boolean) => void>;
    onOpenChange: PropType<(vis: boolean) => void>;
    'onUpdate:open': PropType<(vis: boolean) => void>;
};
export type PopconfirmProps = Partial<ExtractPropTypes<ReturnType<typeof popconfirmProps>>>;
export interface PopconfirmLocale {
    okText: string;
    cancelText: string;
}
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<{
        title?: string | number;
        description?: string | number;
        disabled?: boolean;
        align?: import("../vc-trigger/interface").AlignType;
        arrow?: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements?: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle?: import("vue").CSSProperties;
        overlayStyle?: import("vue").CSSProperties;
        autoAdjustOverflow?: boolean | import("../_util/placements").AdjustOverflow;
        okType?: LegacyButtonType;
        okButtonProps?: Partial<ExtractPropTypes<{
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
        }>> & HTMLAttributes;
        cancelButtonProps?: Partial<ExtractPropTypes<{
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
        }>> & HTMLAttributes;
        showCancel?: boolean;
        children?: unknown[];
        open?: boolean;
        content?: any;
        color?: string;
        visible?: boolean;
        icon?: any;
        trigger?: import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[];
        prefixCls?: string;
        onCancel?: (e: MouseEvent) => void;
        getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
        mouseEnterDelay?: number;
        mouseLeaveDelay?: number;
        transitionName?: string;
        overlayClassName?: string;
        onVisibleChange?: (vis: boolean) => void;
        placement?: import("../tooltip/abstractTooltipProps").TooltipPlacement;
        destroyTooltipOnHide?: boolean;
        arrowPointAtCenter?: boolean;
        openClassName?: string;
        'onUpdate:visible'?: (vis: boolean) => void;
        onOpenChange?: (vis: boolean) => void;
        'onUpdate:open'?: (vis: boolean) => void;
        okText?: any;
        cancelText?: any;
        onConfirm?: (e: MouseEvent) => void;
    }> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        title: string | number;
        description: string | number;
        open: boolean;
        content: any;
        visible: boolean;
        icon: any;
        disabled: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("../_util/placements").AdjustOverflow;
        arrowPointAtCenter: boolean;
        okText: any;
        cancelText: any;
        okType: LegacyButtonType;
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
        }>> & HTMLAttributes;
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
        }>> & HTMLAttributes;
        showCancel: boolean;
    }, true, {}, CustomSlotsType<{
        title?: any;
        content?: any;
        description?: any;
        okText?: any;
        icon?: any;
        cancel?: any;
        cancelText?: any;
        cancelButton?: any;
        okButton?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<{
        title?: string | number;
        description?: string | number;
        disabled?: boolean;
        align?: import("../vc-trigger/interface").AlignType;
        arrow?: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements?: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle?: import("vue").CSSProperties;
        overlayStyle?: import("vue").CSSProperties;
        autoAdjustOverflow?: boolean | import("../_util/placements").AdjustOverflow;
        okType?: LegacyButtonType;
        okButtonProps?: Partial<ExtractPropTypes<{
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
        }>> & HTMLAttributes;
        cancelButtonProps?: Partial<ExtractPropTypes<{
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
        }>> & HTMLAttributes;
        showCancel?: boolean;
        children?: unknown[];
        open?: boolean;
        content?: any;
        color?: string;
        visible?: boolean;
        icon?: any;
        trigger?: import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[];
        prefixCls?: string;
        onCancel?: (e: MouseEvent) => void;
        getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
        mouseEnterDelay?: number;
        mouseLeaveDelay?: number;
        transitionName?: string;
        overlayClassName?: string;
        onVisibleChange?: (vis: boolean) => void;
        placement?: import("../tooltip/abstractTooltipProps").TooltipPlacement;
        destroyTooltipOnHide?: boolean;
        arrowPointAtCenter?: boolean;
        openClassName?: string;
        'onUpdate:visible'?: (vis: boolean) => void;
        onOpenChange?: (vis: boolean) => void;
        'onUpdate:open'?: (vis: boolean) => void;
        okText?: any;
        cancelText?: any;
        onConfirm?: (e: MouseEvent) => void;
    }> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        title: string | number;
        description: string | number;
        open: boolean;
        content: any;
        visible: boolean;
        icon: any;
        disabled: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("../_util/placements").AdjustOverflow;
        arrowPointAtCenter: boolean;
        okText: any;
        cancelText: any;
        okType: LegacyButtonType;
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
        }>> & HTMLAttributes;
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
        }>> & HTMLAttributes;
        showCancel: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<{
    title?: string | number;
    description?: string | number;
    disabled?: boolean;
    align?: import("../vc-trigger/interface").AlignType;
    arrow?: boolean | {
        pointAtCenter?: boolean;
    };
    builtinPlacements?: import("../vc-trigger/interface").BuildInPlacements;
    overlayInnerStyle?: import("vue").CSSProperties;
    overlayStyle?: import("vue").CSSProperties;
    autoAdjustOverflow?: boolean | import("../_util/placements").AdjustOverflow;
    okType?: LegacyButtonType;
    okButtonProps?: Partial<ExtractPropTypes<{
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
    }>> & HTMLAttributes;
    cancelButtonProps?: Partial<ExtractPropTypes<{
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
    }>> & HTMLAttributes;
    showCancel?: boolean;
    children?: unknown[];
    open?: boolean;
    content?: any;
    color?: string;
    visible?: boolean;
    icon?: any;
    trigger?: import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[];
    prefixCls?: string;
    onCancel?: (e: MouseEvent) => void;
    getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    transitionName?: string;
    overlayClassName?: string;
    onVisibleChange?: (vis: boolean) => void;
    placement?: import("../tooltip/abstractTooltipProps").TooltipPlacement;
    destroyTooltipOnHide?: boolean;
    arrowPointAtCenter?: boolean;
    openClassName?: string;
    'onUpdate:visible'?: (vis: boolean) => void;
    onOpenChange?: (vis: boolean) => void;
    'onUpdate:open'?: (vis: boolean) => void;
    okText?: any;
    cancelText?: any;
    onConfirm?: (e: MouseEvent) => void;
}> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    title: string | number;
    description: string | number;
    open: boolean;
    content: any;
    visible: boolean;
    icon: any;
    disabled: boolean;
    align: import("../vc-trigger/interface").AlignType;
    arrow: boolean | {
        pointAtCenter?: boolean;
    };
    builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
    overlayInnerStyle: import("vue").CSSProperties;
    overlayStyle: import("vue").CSSProperties;
    destroyTooltipOnHide: boolean;
    autoAdjustOverflow: boolean | import("../_util/placements").AdjustOverflow;
    arrowPointAtCenter: boolean;
    okText: any;
    cancelText: any;
    okType: LegacyButtonType;
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
    }>> & HTMLAttributes;
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
    }>> & HTMLAttributes;
    showCancel: boolean;
}, {}, string, CustomSlotsType<{
    title?: any;
    content?: any;
    description?: any;
    okText?: any;
    icon?: any;
    cancel?: any;
    cancelText?: any;
    cancelButton?: any;
    okButton?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
