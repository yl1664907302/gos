declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    mask: BooleanConstructor;
    mobile: {
        type: import("vue").PropType<import("../interface").MobileConfig>;
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
        type: import("vue").PropType<string>;
    };
    align: {
        type: import("vue").PropType<import("../interface").AlignType>;
    };
    point: {
        type: import("vue").PropType<import("../interface").Point>;
    };
    getRootDomNode: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: import("vue").PropType<(align: import("../interface").AlignType) => string>;
    };
    onAlign: {
        type: import("vue").PropType<(popupDomNode: HTMLElement, align: import("../interface").AlignType) => void>;
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
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    mask: BooleanConstructor;
    mobile: {
        type: import("vue").PropType<import("../interface").MobileConfig>;
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
        type: import("vue").PropType<string>;
    };
    align: {
        type: import("vue").PropType<import("../interface").AlignType>;
    };
    point: {
        type: import("vue").PropType<import("../interface").Point>;
    };
    getRootDomNode: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    getClassNameFromAlign: {
        type: import("vue").PropType<(align: import("../interface").AlignType) => string>;
    };
    onAlign: {
        type: import("vue").PropType<(popupDomNode: HTMLElement, align: import("../interface").AlignType) => void>;
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
}>> & Readonly<{}>, {
    mask: boolean;
    visible: boolean;
    arrow: boolean;
    forceRender: boolean;
    destroyPopupOnHide: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
