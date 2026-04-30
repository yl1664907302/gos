import type { CSSProperties, ExtractPropTypes, TransitionProps, PropType } from 'vue';
import type { VueNode } from '../_util/type';
/** Two char of 't' 'b' 'c' 'l' 'r'. Example: 'lt' */
export type AlignPoint = string;
export type OffsetType = number | `${number}%`;
export interface AlignType {
    /**
     * move point of source node to align with point of target node.
     * Such as ['tr','cc'], align top right point of source node with center point of target node.
     * Point can be 't'(top), 'b'(bottom), 'c'(center), 'l'(left), 'r'(right) */
    points?: (string | AlignPoint)[];
    /**
     * offset source node by offset[0] in x and offset[1] in y.
     * If offset contains percentage string value, it is relative to sourceNode region.
     */
    offset?: OffsetType[];
    /**
     * offset target node by offset[0] in x and offset[1] in y.
     * If targetOffset contains percentage string value, it is relative to targetNode region.
     */
    targetOffset?: OffsetType[];
    /**
     * If adjustX field is true, will adjust source node in x direction if source node is invisible.
     * If adjustY field is true, will adjust source node in y direction if source node is invisible.
     */
    overflow?: {
        adjustX?: boolean | number;
        adjustY?: boolean | number;
        shiftX?: boolean | number;
        shiftY?: boolean | number;
    };
    /** Auto adjust arrow position */
    autoArrow?: boolean;
    /**
     * Config visible region check of html node. Default `visible`:
     *  - `visible`:
     *    The visible region of user browser window.
     *    Use `clientHeight` for check.
     *    If `visible` region not satisfy, fallback to `scroll`.
     *  - `scroll`:
     *    The whole region of the html scroll area.
     *    Use `scrollHeight` for check.
     *  - `visibleFirst`:
     *    Similar to `visible`, but if `visible` region not satisfy, fallback to `scroll`.
     */
    htmlRegion?: 'visible' | 'scroll' | 'visibleFirst';
    /**
     * Whether use css right instead of left to position
     */
    useCssRight?: boolean;
    /**
     * Whether use css bottom instead of top to position
     */
    useCssBottom?: boolean;
    /**
     * Whether use css transform instead of left/top/right/bottom to position if browser supports.
     * Defaults to false.
     */
    useCssTransform?: boolean;
    ignoreShake?: boolean;
}
export type BuildInPlacements = Record<string, AlignType>;
export type StretchType = string;
export type ActionType = string;
export type AnimationType = string;
export type TransitionNameType = string;
export interface Point {
    pageX: number;
    pageY: number;
}
export interface CommonEventHandler {
    remove: () => void;
}
export interface MobileConfig {
    /** Set popup motion. You can ref `rc-motion` for more info. */
    popupMotion?: TransitionProps;
    popupClassName?: string;
    popupStyle?: CSSProperties;
    popupRender?: (originNode: VueNode) => VueNode;
}
export declare function noop(): void;
export declare const triggerProps: () => {
    action: import("vue-types").VueTypeDef<string | string[]> & {
        default: string | (() => string[]);
    };
    showAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    hideAction: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    getPopupClassNameFromAlign: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    onPopupVisibleChange: PropType<(open: boolean) => void>;
    afterPopupVisibleChange: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    popup: import("vue-types").VueTypeValidableDef<any>;
    arrow: import("vue-types").VueTypeValidableDef<boolean> & {
        default: boolean;
    } & {
        default: boolean;
    };
    popupStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    prefixCls: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupClassName: import("vue-types").VueTypeValidableDef<string> & {
        default: string;
    } & {
        default: string;
    };
    popupPlacement: StringConstructor;
    builtinPlacements: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    popupTransitionName: StringConstructor;
    popupAnimation: import("vue-types").VueTypeValidableDef<any>;
    mouseEnterDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    mouseLeaveDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    zIndex: NumberConstructor;
    focusDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    blurDelay: import("vue-types").VueTypeValidableDef<number> & {
        default: number;
    } & {
        default: number;
    };
    getPopupContainer: FunctionConstructor;
    getDocument: import("vue-types").VueTypeValidableDef<(...args: any[]) => any> & {
        default: (...args: any[]) => any;
    } & {
        default: (...args: any[]) => any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    destroyPopupOnHide: {
        type: BooleanConstructor;
        default: boolean;
    };
    mask: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: boolean;
    };
    popupAlign: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    } & {
        default: () => {
            [key: string]: any;
        };
    };
    popupVisible: {
        type: BooleanConstructor;
        default: any;
    };
    defaultPopupVisible: {
        type: BooleanConstructor;
        default: boolean;
    };
    maskTransitionName: StringConstructor;
    maskAnimation: StringConstructor;
    stretch: StringConstructor;
    alignPoint: {
        type: BooleanConstructor;
        default: any;
    };
    autoDestroy: {
        type: BooleanConstructor;
        default: boolean;
    };
    mobile: ObjectConstructor;
    getTriggerDOMNode: PropType<(d?: HTMLElement) => HTMLElement>;
};
export type TriggerProps = Partial<ExtractPropTypes<ReturnType<typeof triggerProps>>>;
