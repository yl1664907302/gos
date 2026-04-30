import type { Point, AlignType, MobileConfig } from '../interface';
import type { ExtractPropTypes, PropType } from 'vue';
export declare const innerProps: {
    visible: BooleanConstructor;
    prefixCls: StringConstructor;
    zIndex: NumberConstructor;
    destroyPopupOnHide: BooleanConstructor;
    forceRender: BooleanConstructor;
    arrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    animation: (ObjectConstructor | StringConstructor)[];
    transitionName: StringConstructor;
    stretch: {
        type: PropType<string>;
    };
    align: {
        type: PropType<AlignType>;
    };
    point: {
        type: PropType<Point>;
    };
    getRootDomNode: {
        type: PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: PropType<(align: AlignType) => string>;
    };
    onAlign: {
        type: PropType<(popupDomNode: HTMLElement, align: AlignType) => void>;
    };
    onMouseenter: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMouseleave: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMousedown: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onTouchstart: {
        type: PropType<(align: MouseEvent) => void>;
    };
};
export type PopupInnerProps = Partial<ExtractPropTypes<typeof innerProps>> & {
    align?: AlignType;
};
export declare const mobileProps: {
    mobile: {
        type: PropType<MobileConfig>;
    };
    visible: BooleanConstructor;
    prefixCls: StringConstructor;
    zIndex: NumberConstructor;
    destroyPopupOnHide: BooleanConstructor;
    forceRender: BooleanConstructor;
    arrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    animation: (ObjectConstructor | StringConstructor)[];
    transitionName: StringConstructor;
    stretch: {
        type: PropType<string>;
    };
    align: {
        type: PropType<AlignType>;
    };
    point: {
        type: PropType<Point>;
    };
    getRootDomNode: {
        type: PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: PropType<(align: AlignType) => string>;
    };
    onAlign: {
        type: PropType<(popupDomNode: HTMLElement, align: AlignType) => void>;
    };
    onMouseenter: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMouseleave: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMousedown: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onTouchstart: {
        type: PropType<(align: MouseEvent) => void>;
    };
};
export type MobilePopupProps = Partial<ExtractPropTypes<typeof mobileProps>> & {
    align?: AlignType;
    mobile: MobileConfig;
};
export declare const popupProps: {
    mask: BooleanConstructor;
    mobile: {
        type: PropType<MobileConfig>;
    };
    maskAnimation: StringConstructor;
    maskTransitionName: StringConstructor;
    visible: BooleanConstructor;
    prefixCls: StringConstructor;
    zIndex: NumberConstructor;
    destroyPopupOnHide: BooleanConstructor;
    forceRender: BooleanConstructor;
    arrow: {
        type: BooleanConstructor;
        default: boolean;
    };
    animation: (ObjectConstructor | StringConstructor)[];
    transitionName: StringConstructor;
    stretch: {
        type: PropType<string>;
    };
    align: {
        type: PropType<AlignType>;
    };
    point: {
        type: PropType<Point>;
    };
    getRootDomNode: {
        type: PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: PropType<(align: AlignType) => string>;
    };
    onAlign: {
        type: PropType<(popupDomNode: HTMLElement, align: AlignType) => void>;
    };
    onMouseenter: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMouseleave: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onMousedown: {
        type: PropType<(align: MouseEvent) => void>;
    };
    onTouchstart: {
        type: PropType<(align: MouseEvent) => void>;
    };
};
export type PopupProps = Partial<ExtractPropTypes<typeof popupProps>> & {
    align?: AlignType;
    mobile: MobileConfig;
};
