declare const DrawerWrapper: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: import("vue-types").VueTypeDef<any>;
    prefixCls: StringConstructor;
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    style: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    class: StringConstructor;
    rootClassName: StringConstructor;
    rootStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    placement: {
        type: import("vue").PropType<import("./IDrawerPropTypes").IPlacement>;
    };
    wrapperClassName: StringConstructor;
    level: {
        type: import("vue").PropType<string | string[]>;
    };
    levelMove: {
        type: import("vue").PropType<(number | [number, number]) | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => number | [number, number])>;
    };
    duration: StringConstructor;
    ease: StringConstructor;
    showMask: {
        type: BooleanConstructor;
        default: any;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    maskStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    afterVisibleChange: FunctionConstructor;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    contentWrapperStyle: {
        type: import("vue").PropType<import("vue").CSSProperties[]>;
        default: import("vue").CSSProperties[];
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    motion: {
        type: import("vue").PropType<(placement: import("./IDrawerPropTypes").IPlacement) => import("vue").TransitionProps>;
        default: (placement: import("./IDrawerPropTypes").IPlacement) => import("vue").TransitionProps;
    };
    maskMotion: {
        type: import("vue").PropType<import("vue").TransitionProps>;
        default: import("vue").TransitionProps;
    };
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("close" | "handleClick")[], "close" | "handleClick", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: import("vue-types").VueTypeDef<any>;
    prefixCls: StringConstructor;
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    style: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    class: StringConstructor;
    rootClassName: StringConstructor;
    rootStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    placement: {
        type: import("vue").PropType<import("./IDrawerPropTypes").IPlacement>;
    };
    wrapperClassName: StringConstructor;
    level: {
        type: import("vue").PropType<string | string[]>;
    };
    levelMove: {
        type: import("vue").PropType<(number | [number, number]) | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => number | [number, number])>;
    };
    duration: StringConstructor;
    ease: StringConstructor;
    showMask: {
        type: BooleanConstructor;
        default: any;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    maskStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    afterVisibleChange: FunctionConstructor;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    contentWrapperStyle: {
        type: import("vue").PropType<import("vue").CSSProperties[]>;
        default: import("vue").CSSProperties[];
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    motion: {
        type: import("vue").PropType<(placement: import("./IDrawerPropTypes").IPlacement) => import("vue").TransitionProps>;
        default: (placement: import("./IDrawerPropTypes").IPlacement) => import("vue").TransitionProps;
    };
    maskMotion: {
        type: import("vue").PropType<import("vue").TransitionProps>;
        default: import("vue").TransitionProps;
    };
}>> & Readonly<{
    onClose?: (...args: any[]) => any;
    onHandleClick?: (...args: any[]) => any;
}>, {
    style: import("vue").CSSProperties;
    open: boolean;
    motion: (placement: import("./IDrawerPropTypes").IPlacement) => import("vue").TransitionProps;
    autofocus: boolean;
    forceRender: boolean;
    maskClosable: boolean;
    rootStyle: import("vue").CSSProperties;
    keyboard: boolean;
    showMask: boolean;
    maskStyle: import("vue").CSSProperties;
    contentWrapperStyle: import("vue").CSSProperties[];
    maskMotion: import("vue").TransitionProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default DrawerWrapper;
