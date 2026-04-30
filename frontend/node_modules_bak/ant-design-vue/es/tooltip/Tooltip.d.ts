import type { CSSProperties, ExtractPropTypes } from 'vue';
export type { TriggerType, TooltipPlacement } from './abstractTooltipProps';
export type { AdjustOverflow, PlacementsConfig } from '../_util/placements';
import type { CustomSlotsType } from '../_util/type';
export interface TooltipAlignConfig {
    points?: [string, string];
    offset?: [number | string, number | string];
    targetOffset?: [number | string, number | string];
    overflow?: {
        adjustX: boolean;
        adjustY: boolean;
    };
    useCssRight?: boolean;
    useCssBottom?: boolean;
    useCssTransform?: boolean;
}
export declare const tooltipProps: () => {
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
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    overlayInnerStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
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
        type: import("vue").PropType<boolean | import("../_util/placements").AdjustOverflow>;
        default: boolean | import("../_util/placements").AdjustOverflow;
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
export declare const tooltipDefaultProps: () => {
    trigger: string;
    align: {};
    placement: string;
    mouseEnterDelay: number;
    mouseLeaveDelay: number;
    arrowPointAtCenter: boolean;
    autoAdjustOverflow: boolean;
};
export type TooltipProps = Partial<ExtractPropTypes<ReturnType<typeof tooltipProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
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
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    overlayInnerStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
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
        type: import("vue").PropType<boolean | import("../_util/placements").AdjustOverflow>;
        default: boolean | import("../_util/placements").AdjustOverflow;
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
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
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
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    overlayInnerStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
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
        type: import("vue").PropType<boolean | import("../_util/placements").AdjustOverflow>;
        default: boolean | import("../_util/placements").AdjustOverflow;
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
}>> & Readonly<{}>, {
    open: boolean;
    visible: boolean;
    align: import("../vc-trigger/interface").AlignType;
    arrow: boolean | {
        pointAtCenter?: boolean;
    };
    builtinPlacements: import("../vc-trigger/interface").BuildInPlacements;
    overlayInnerStyle: CSSProperties;
    overlayStyle: CSSProperties;
    destroyTooltipOnHide: boolean;
    autoAdjustOverflow: boolean | import("../_util/placements").AdjustOverflow;
    arrowPointAtCenter: boolean;
}, CustomSlotsType<{
    title?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
