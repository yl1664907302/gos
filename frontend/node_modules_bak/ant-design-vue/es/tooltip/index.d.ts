import { tooltipProps } from './Tooltip';
export type { TooltipProps, AdjustOverflow, PlacementsConfig, TooltipAlignConfig, TooltipPlacement, } from './Tooltip';
export { tooltipProps };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        title: import("vue-types").VueTypeValidableDef<any>;
        trigger: import("vue").PropType<import("./abstractTooltipProps").TriggerType | import("./abstractTooltipProps").TriggerType[]>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        placement: import("vue").PropType<import("./abstractTooltipProps").TooltipPlacement>;
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
            type: import("vue").PropType<boolean | import("./Tooltip").AdjustOverflow>;
            default: boolean | import("./Tooltip").AdjustOverflow;
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
        open: boolean;
        visible: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("./Tooltip").AdjustOverflow;
        arrowPointAtCenter: boolean;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        title?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        title: import("vue-types").VueTypeValidableDef<any>;
        trigger: import("vue").PropType<import("./abstractTooltipProps").TriggerType | import("./abstractTooltipProps").TriggerType[]>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        placement: import("vue").PropType<import("./abstractTooltipProps").TooltipPlacement>;
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
            type: import("vue").PropType<boolean | import("./Tooltip").AdjustOverflow>;
            default: boolean | import("./Tooltip").AdjustOverflow;
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
        open: boolean;
        visible: boolean;
        align: import("../vc-trigger/interface").AlignType;
        arrow: boolean | {
            pointAtCenter?: boolean;
        };
        builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
        overlayInnerStyle: import("vue").CSSProperties;
        overlayStyle: import("vue").CSSProperties;
        destroyTooltipOnHide: boolean;
        autoAdjustOverflow: boolean | import("./Tooltip").AdjustOverflow;
        arrowPointAtCenter: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    title: import("vue-types").VueTypeValidableDef<any>;
    trigger: import("vue").PropType<import("./abstractTooltipProps").TriggerType | import("./abstractTooltipProps").TriggerType[]>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    placement: import("vue").PropType<import("./abstractTooltipProps").TooltipPlacement>;
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
        type: import("vue").PropType<boolean | import("./Tooltip").AdjustOverflow>;
        default: boolean | import("./Tooltip").AdjustOverflow;
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
    open: boolean;
    visible: boolean;
    align: import("../vc-trigger/interface").AlignType;
    arrow: boolean | {
        pointAtCenter?: boolean;
    };
    builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
    overlayInnerStyle: import("vue").CSSProperties;
    overlayStyle: import("vue").CSSProperties;
    destroyTooltipOnHide: boolean;
    autoAdjustOverflow: boolean | import("./Tooltip").AdjustOverflow;
    arrowPointAtCenter: boolean;
}, {}, string, import("../_util/type").CustomSlotsType<{
    title?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
