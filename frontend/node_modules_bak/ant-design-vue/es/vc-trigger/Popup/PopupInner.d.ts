import type { AlignType } from '../interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<string>;
    };
    align: {
        type: import("vue").PropType<AlignType>;
    };
    point: {
        type: import("vue").PropType<import("../interface").Point>;
    };
    getRootDomNode: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: import("vue").PropType<(align: AlignType) => string>;
    };
    onAlign: {
        type: import("vue").PropType<(popupDomNode: HTMLElement, align: AlignType) => void>;
    };
    onMouseenter: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onMousedown: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onTouchstart: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("mousedown" | "mouseenter" | "mouseleave" | "touchstart" | "align")[], "mousedown" | "mouseenter" | "mouseleave" | "touchstart" | "align", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<string>;
    };
    align: {
        type: import("vue").PropType<AlignType>;
    };
    point: {
        type: import("vue").PropType<import("../interface").Point>;
    };
    getRootDomNode: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: import("vue").PropType<(align: AlignType) => string>;
    };
    onAlign: {
        type: import("vue").PropType<(popupDomNode: HTMLElement, align: AlignType) => void>;
    };
    onMouseenter: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onMouseleave: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onMousedown: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
    onTouchstart: {
        type: import("vue").PropType<(align: MouseEvent) => void>;
    };
}>> & Readonly<{
    onMouseenter?: (...args: any[]) => any;
    onMouseleave?: (...args: any[]) => any;
    onMousedown?: (...args: any[]) => any;
    onTouchstart?: (...args: any[]) => any;
    onAlign?: (...args: any[]) => any;
}>, {
    visible: boolean;
    arrow: boolean;
    forceRender: boolean;
    destroyPopupOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
