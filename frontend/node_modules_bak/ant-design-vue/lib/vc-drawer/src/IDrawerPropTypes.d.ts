import type { CSSProperties, PropType, TransitionProps } from 'vue';
export type IPlacement = 'left' | 'top' | 'right' | 'bottom';
type ILevelMove = number | [number, number];
declare const drawerProps: () => {
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: import("vue-types").VueTypeDef<any>;
    prefixCls: StringConstructor;
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    style: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    class: StringConstructor;
    rootClassName: StringConstructor;
    rootStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    placement: {
        type: PropType<IPlacement>;
    };
    wrapperClassName: StringConstructor;
    level: {
        type: PropType<string | string[]>;
    };
    levelMove: {
        type: PropType<ILevelMove | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => ILevelMove)>;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    afterVisibleChange: FunctionConstructor;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    contentWrapperStyle: {
        type: PropType<CSSProperties[]>;
        default: CSSProperties[];
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
        type: PropType<(placement: IPlacement) => TransitionProps>;
        default: (placement: IPlacement) => TransitionProps;
    };
    maskMotion: {
        type: PropType<TransitionProps>;
        default: TransitionProps;
    };
};
declare const drawerChildProps: () => {
    getContainer: FunctionConstructor;
    getOpenCount: PropType<() => number>;
    scrollLocker: import("vue-types").VueTypeValidableDef<any>;
    inline: BooleanConstructor;
    prefixCls: StringConstructor;
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    style: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    class: StringConstructor;
    rootClassName: StringConstructor;
    rootStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    placement: {
        type: PropType<IPlacement>;
    };
    wrapperClassName: StringConstructor;
    level: {
        type: PropType<string | string[]>;
    };
    levelMove: {
        type: PropType<ILevelMove | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => ILevelMove)>;
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
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    afterVisibleChange: FunctionConstructor;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    contentWrapperStyle: {
        type: PropType<CSSProperties[]>;
        default: CSSProperties[];
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
        type: PropType<(placement: IPlacement) => TransitionProps>;
        default: (placement: IPlacement) => TransitionProps;
    };
    maskMotion: {
        type: PropType<TransitionProps>;
        default: TransitionProps;
    };
};
export { drawerProps, drawerChildProps };
