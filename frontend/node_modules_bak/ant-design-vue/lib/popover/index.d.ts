import type { ExtractPropTypes } from 'vue';
export declare const popoverProps: () => {
    content: {
        default: any;
        type: import("vue").PropType<any>;
    };
    title: {
        default: any;
        type: import("vue").PropType<any>;
    };
    trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
    color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
    transitionName: StringConstructor;
    overlayStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayInnerStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayClassName: StringConstructor;
    openClassName: StringConstructor;
    prefixCls: StringConstructor;
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    arrowPointAtCenter: {
        type: BooleanConstructor;
        default: any;
    };
    arrow: {
        type: import("vue").PropType<boolean | {
            pointAtCenter?: boolean;
        }>;
        default: boolean | {
            pointAtCenter?: boolean;
        };
    };
    autoAdjustOverflow: {
        type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
        default: boolean | import("../tooltip").AdjustOverflow;
    };
    destroyTooltipOnHide: {
        type: BooleanConstructor;
        default: any;
    };
    align: {
        type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        default: import("../vc-trigger/interface").AlignType;
    };
    builtinPlacements: {
        type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
        default: import("../vc-trigger/interface").BuildInPlacements;
    };
    children: ArrayConstructor;
    onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
    'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
    onOpenChange: import("vue").PropType<(vis: boolean) => void>;
    'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
};
export type PopoverProps = Partial<ExtractPropTypes<ReturnType<typeof popoverProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        content: {
            default: any;
            type: import("vue").PropType<any>;
        };
        title: {
            default: any;
            type: import("vue").PropType<any>;
        };
        trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
        color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
        transitionName: StringConstructor;
        overlayStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayInnerStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayClassName: StringConstructor;
        openClassName: StringConstructor;
        prefixCls: StringConstructor;
        mouseEnterDelay: NumberConstructor;
        mouseLeaveDelay: NumberConstructor;
        getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
        arrowPointAtCenter: {
            type: BooleanConstructor;
            default: any;
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter?: boolean;
            }>;
            default: boolean | {
                pointAtCenter?: boolean;
            };
        };
        autoAdjustOverflow: {
            type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
            default: boolean | import("../tooltip").AdjustOverflow;
        };
        destroyTooltipOnHide: {
            type: BooleanConstructor;
            default: any;
        };
        align: {
            type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
            default: import("../vc-trigger/interface").AlignType;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
            default: import("../vc-trigger/interface").BuildInPlacements;
        };
        children: ArrayConstructor;
        onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
        onOpenChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        title: any;
        open: boolean;
        content: any;
        visible: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("../tooltip").AdjustOverflow;
        arrowPointAtCenter: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        content: {
            default: any;
            type: import("vue").PropType<any>;
        };
        title: {
            default: any;
            type: import("vue").PropType<any>;
        };
        trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
        color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
        transitionName: StringConstructor;
        overlayStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayInnerStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        overlayClassName: StringConstructor;
        openClassName: StringConstructor;
        prefixCls: StringConstructor;
        mouseEnterDelay: NumberConstructor;
        mouseLeaveDelay: NumberConstructor;
        getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
        arrowPointAtCenter: {
            type: BooleanConstructor;
            default: any;
        };
        arrow: {
            type: import("vue").PropType<boolean | {
                pointAtCenter?: boolean;
            }>;
            default: boolean | {
                pointAtCenter?: boolean;
            };
        };
        autoAdjustOverflow: {
            type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
            default: boolean | import("../tooltip").AdjustOverflow;
        };
        destroyTooltipOnHide: {
            type: BooleanConstructor;
            default: any;
        };
        align: {
            type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
            default: import("../vc-trigger/interface").AlignType;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
            default: import("../vc-trigger/interface").BuildInPlacements;
        };
        children: ArrayConstructor;
        onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
        onOpenChange: import("vue").PropType<(vis: boolean) => void>;
        'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        title: any;
        open: boolean;
        content: any;
        visible: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("../tooltip").AdjustOverflow;
        arrowPointAtCenter: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    content: {
        default: any;
        type: import("vue").PropType<any>;
    };
    title: {
        default: any;
        type: import("vue").PropType<any>;
    };
    trigger: import("vue").PropType<import("../tooltip/abstractTooltipProps").TriggerType | import("../tooltip/abstractTooltipProps").TriggerType[]>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    placement: import("vue").PropType<import("../tooltip").TooltipPlacement>;
    color: import("vue").PropType<import("../_util/type").LiteralUnion<import("../_util/colors").PresetColorType>>;
    transitionName: StringConstructor;
    overlayStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayInnerStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    overlayClassName: StringConstructor;
    openClassName: StringConstructor;
    prefixCls: StringConstructor;
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    getPopupContainer: import("vue").PropType<(triggerNode: HTMLElement) => HTMLElement>;
    arrowPointAtCenter: {
        type: BooleanConstructor;
        default: any;
    };
    arrow: {
        type: import("vue").PropType<boolean | {
            pointAtCenter?: boolean;
        }>;
        default: boolean | {
            pointAtCenter?: boolean;
        };
    };
    autoAdjustOverflow: {
        type: import("vue").PropType<boolean | import("../tooltip").AdjustOverflow>;
        default: boolean | import("../tooltip").AdjustOverflow;
    };
    destroyTooltipOnHide: {
        type: BooleanConstructor;
        default: any;
    };
    align: {
        type: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        default: import("../vc-trigger/interface").AlignType;
    };
    builtinPlacements: {
        type: import("vue").PropType<import("../vc-trigger/interface").BuildInPlacements>;
        default: import("../vc-trigger/interface").BuildInPlacements;
    };
    children: ArrayConstructor;
    onVisibleChange: import("vue").PropType<(vis: boolean) => void>;
    'onUpdate:visible': import("vue").PropType<(vis: boolean) => void>;
    onOpenChange: import("vue").PropType<(vis: boolean) => void>;
    'onUpdate:open': import("vue").PropType<(vis: boolean) => void>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    title: any;
    open: boolean;
    content: any;
    visible: boolean;
    align: import("../vc-trigger/interface").AlignType;
    arrow: boolean | {
        pointAtCenter?: boolean;
    };
    builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
    overlayInnerStyle: import("vue").CSSProperties;
    overlayStyle: import("vue").CSSProperties;
    destroyTooltipOnHide: boolean;
    autoAdjustOverflow: boolean | import("../tooltip").AdjustOverflow;
    arrowPointAtCenter: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
