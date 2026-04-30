import type { CSSProperties, PropType } from 'vue';
import type { AlignType, BuildInPlacements } from '../vc-trigger/interface';
import type { AdjustOverflow } from '../_util/placements';
export type TriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';
import type { PresetColorType } from '../_util/colors';
import type { LiteralUnion } from '../_util/type';
export type TooltipPlacement = 'top' | 'left' | 'right' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'leftTop' | 'leftBottom' | 'rightTop' | 'rightBottom';
declare const _default: () => {
    trigger: PropType<TriggerType | TriggerType[]>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    /** @deprecated Please use `open` instead. */
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    placement: PropType<TooltipPlacement>;
    color: PropType<LiteralUnion<PresetColorType>>;
    transitionName: StringConstructor;
    overlayStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    overlayInnerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    overlayClassName: StringConstructor;
    openClassName: StringConstructor;
    prefixCls: StringConstructor;
    mouseEnterDelay: NumberConstructor;
    mouseLeaveDelay: NumberConstructor;
    getPopupContainer: PropType<(triggerNode: HTMLElement) => HTMLElement>;
    /**@deprecated Please use `arrow={{ pointAtCenter: true }}` instead. */
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
        type: PropType<boolean | AdjustOverflow>;
        default: boolean | AdjustOverflow;
    };
    destroyTooltipOnHide: {
        type: BooleanConstructor;
        default: any;
    };
    align: {
        type: PropType<AlignType>;
        default: AlignType;
    };
    builtinPlacements: {
        type: PropType<BuildInPlacements>;
        default: BuildInPlacements;
    };
    children: ArrayConstructor;
    /** @deprecated Please use `onOpenChange` instead. */
    onVisibleChange: PropType<(vis: boolean) => void>;
    /** @deprecated Please use `onUpdate:open` instead. */
    'onUpdate:visible': PropType<(vis: boolean) => void>;
    onOpenChange: PropType<(vis: boolean) => void>;
    'onUpdate:open': PropType<(vis: boolean) => void>;
};
export default _default;
