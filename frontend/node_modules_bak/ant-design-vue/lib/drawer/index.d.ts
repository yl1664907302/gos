import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { CustomSlotsType } from '../_util/type';
import type { KeyboardEventHandler, MouseEventHandler } from '../_util/EventInterface';
type ILevelMove = number | [number, number];
declare const PlacementTypes: readonly ["top", "right", "bottom", "left"];
export type placementType = (typeof PlacementTypes)[number];
declare const SizeTypes: readonly ["default", "large"];
export type sizeType = (typeof SizeTypes)[number];
export interface PushState {
    distance: string | number;
}
type getContainerFunc = () => HTMLElement;
export declare const drawerProps: () => {
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    destroyOnClose: {
        type: BooleanConstructor;
        default: any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: {
        type: PropType<string | false | HTMLElement | getContainerFunc>;
        default: string | false | HTMLElement | getContainerFunc;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    mask: {
        type: BooleanConstructor;
        default: any;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    rootClassName: StringConstructor;
    rootStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    size: {
        type: PropType<"default" | "large">;
    };
    drawerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    headerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentWrapperStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Please use `open` instead */
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    zIndex: NumberConstructor;
    prefixCls: StringConstructor;
    push: import("vue-types").VueTypeDef<boolean | PushState>;
    placement: import("vue-types").VueTypeDef<"left" | "right" | "top" | "bottom">;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    extra: import("vue-types").VueTypeValidableDef<any>;
    footer: import("vue-types").VueTypeValidableDef<any>;
    footerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    level: import("vue-types").VueTypeValidableDef<any>;
    levelMove: {
        type: PropType<ILevelMove | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => ILevelMove)>;
    };
    handle: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Use `@afterVisibleChange` instead */
    afterVisibleChange: PropType<(visible: boolean) => void>;
    /** @deprecated Please use `@afterOpenChange` instead */
    onAfterVisibleChange: PropType<(visible: boolean) => void>;
    onAfterOpenChange: PropType<(open: boolean) => void>;
    /** @deprecated Please use `onUpdate:open` instead */
    'onUpdate:visible': PropType<(visible: boolean) => void>;
    'onUpdate:open': PropType<(open: boolean) => void>;
    onClose: PropType<MouseEventHandler | KeyboardEventHandler>;
};
export type DrawerProps = Partial<ExtractPropTypes<ReturnType<typeof drawerProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        destroyOnClose: {
            type: BooleanConstructor;
            default: any;
        };
        forceRender: {
            type: BooleanConstructor;
            default: any;
        };
        getContainer: {
            type: PropType<string | false | HTMLElement | getContainerFunc>;
            default: string | false | HTMLElement | getContainerFunc;
        };
        maskClosable: {
            type: BooleanConstructor;
            default: any;
        };
        mask: {
            type: BooleanConstructor;
            default: any;
        };
        maskStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        rootClassName: StringConstructor;
        rootStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        size: {
            type: PropType<"default" | "large">;
        };
        drawerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        headerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        bodyStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        contentWrapperStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated Please use `open` instead */
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        open: {
            type: BooleanConstructor;
            default: any;
        };
        width: import("vue-types").VueTypeDef<string | number>;
        height: import("vue-types").VueTypeDef<string | number>;
        zIndex: NumberConstructor;
        prefixCls: StringConstructor;
        push: import("vue-types").VueTypeDef<boolean | PushState>;
        placement: import("vue-types").VueTypeDef<"left" | "right" | "top" | "bottom">;
        keyboard: {
            type: BooleanConstructor;
            default: any;
        };
        extra: import("vue-types").VueTypeValidableDef<any>;
        footer: import("vue-types").VueTypeValidableDef<any>;
        footerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        level: import("vue-types").VueTypeValidableDef<any>;
        levelMove: {
            type: PropType<ILevelMove | ((e: {
                target: HTMLElement;
                open: boolean;
            }) => ILevelMove)>;
        };
        handle: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated Use `@afterVisibleChange` instead */
        afterVisibleChange: PropType<(visible: boolean) => void>;
        /** @deprecated Please use `@afterOpenChange` instead */
        onAfterVisibleChange: PropType<(visible: boolean) => void>;
        onAfterOpenChange: PropType<(open: boolean) => void>;
        /** @deprecated Please use `onUpdate:open` instead */
        'onUpdate:visible': PropType<(visible: boolean) => void>;
        'onUpdate:open': PropType<(open: boolean) => void>;
        onClose: PropType<MouseEventHandler | KeyboardEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        mask: boolean;
        open: boolean;
        visible: boolean;
        autofocus: boolean;
        getContainer: string | false | HTMLElement | getContainerFunc;
        forceRender: boolean;
        maskClosable: boolean;
        rootStyle: CSSProperties;
        keyboard: boolean;
        closable: boolean;
        bodyStyle: CSSProperties;
        maskStyle: CSSProperties;
        contentWrapperStyle: CSSProperties;
        destroyOnClose: boolean;
        drawerStyle: CSSProperties;
        headerStyle: CSSProperties;
        footerStyle: CSSProperties;
    }, true, {}, CustomSlotsType<{
        closeIcon: any;
        title: any;
        extra: any;
        footer: any;
        handle: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        closable: {
            type: BooleanConstructor;
            default: any;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        destroyOnClose: {
            type: BooleanConstructor;
            default: any;
        };
        forceRender: {
            type: BooleanConstructor;
            default: any;
        };
        getContainer: {
            type: PropType<string | false | HTMLElement | getContainerFunc>;
            default: string | false | HTMLElement | getContainerFunc;
        };
        maskClosable: {
            type: BooleanConstructor;
            default: any;
        };
        mask: {
            type: BooleanConstructor;
            default: any;
        };
        maskStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        rootClassName: StringConstructor;
        rootStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        size: {
            type: PropType<"default" | "large">;
        };
        drawerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        headerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        bodyStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        contentWrapperStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated Please use `open` instead */
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        open: {
            type: BooleanConstructor;
            default: any;
        };
        width: import("vue-types").VueTypeDef<string | number>;
        height: import("vue-types").VueTypeDef<string | number>;
        zIndex: NumberConstructor;
        prefixCls: StringConstructor;
        push: import("vue-types").VueTypeDef<boolean | PushState>;
        placement: import("vue-types").VueTypeDef<"left" | "right" | "top" | "bottom">;
        keyboard: {
            type: BooleanConstructor;
            default: any;
        };
        extra: import("vue-types").VueTypeValidableDef<any>;
        footer: import("vue-types").VueTypeValidableDef<any>;
        footerStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        level: import("vue-types").VueTypeValidableDef<any>;
        levelMove: {
            type: PropType<ILevelMove | ((e: {
                target: HTMLElement;
                open: boolean;
            }) => ILevelMove)>;
        };
        handle: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated Use `@afterVisibleChange` instead */
        afterVisibleChange: PropType<(visible: boolean) => void>;
        /** @deprecated Please use `@afterOpenChange` instead */
        onAfterVisibleChange: PropType<(visible: boolean) => void>;
        onAfterOpenChange: PropType<(open: boolean) => void>;
        /** @deprecated Please use `onUpdate:open` instead */
        'onUpdate:visible': PropType<(visible: boolean) => void>;
        'onUpdate:open': PropType<(open: boolean) => void>;
        onClose: PropType<MouseEventHandler | KeyboardEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        mask: boolean;
        open: boolean;
        visible: boolean;
        autofocus: boolean;
        getContainer: string | false | HTMLElement | getContainerFunc;
        forceRender: boolean;
        maskClosable: boolean;
        rootStyle: CSSProperties;
        keyboard: boolean;
        closable: boolean;
        bodyStyle: CSSProperties;
        maskStyle: CSSProperties;
        contentWrapperStyle: CSSProperties;
        destroyOnClose: boolean;
        drawerStyle: CSSProperties;
        headerStyle: CSSProperties;
        footerStyle: CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    closable: {
        type: BooleanConstructor;
        default: any;
    };
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    destroyOnClose: {
        type: BooleanConstructor;
        default: any;
    };
    forceRender: {
        type: BooleanConstructor;
        default: any;
    };
    getContainer: {
        type: PropType<string | false | HTMLElement | getContainerFunc>;
        default: string | false | HTMLElement | getContainerFunc;
    };
    maskClosable: {
        type: BooleanConstructor;
        default: any;
    };
    mask: {
        type: BooleanConstructor;
        default: any;
    };
    maskStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    rootClassName: StringConstructor;
    rootStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    size: {
        type: PropType<"default" | "large">;
    };
    drawerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    headerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentWrapperStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Please use `open` instead */
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    width: import("vue-types").VueTypeDef<string | number>;
    height: import("vue-types").VueTypeDef<string | number>;
    zIndex: NumberConstructor;
    prefixCls: StringConstructor;
    push: import("vue-types").VueTypeDef<boolean | PushState>;
    placement: import("vue-types").VueTypeDef<"left" | "right" | "top" | "bottom">;
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    extra: import("vue-types").VueTypeValidableDef<any>;
    footer: import("vue-types").VueTypeValidableDef<any>;
    footerStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    level: import("vue-types").VueTypeValidableDef<any>;
    levelMove: {
        type: PropType<ILevelMove | ((e: {
            target: HTMLElement;
            open: boolean;
        }) => ILevelMove)>;
    };
    handle: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated Use `@afterVisibleChange` instead */
    afterVisibleChange: PropType<(visible: boolean) => void>;
    /** @deprecated Please use `@afterOpenChange` instead */
    onAfterVisibleChange: PropType<(visible: boolean) => void>;
    onAfterOpenChange: PropType<(open: boolean) => void>;
    /** @deprecated Please use `onUpdate:open` instead */
    'onUpdate:visible': PropType<(visible: boolean) => void>;
    'onUpdate:open': PropType<(open: boolean) => void>;
    onClose: PropType<MouseEventHandler | KeyboardEventHandler>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    mask: boolean;
    open: boolean;
    visible: boolean;
    autofocus: boolean;
    getContainer: string | false | HTMLElement | getContainerFunc;
    forceRender: boolean;
    maskClosable: boolean;
    rootStyle: CSSProperties;
    keyboard: boolean;
    closable: boolean;
    bodyStyle: CSSProperties;
    maskStyle: CSSProperties;
    contentWrapperStyle: CSSProperties;
    destroyOnClose: boolean;
    drawerStyle: CSSProperties;
    headerStyle: CSSProperties;
    footerStyle: CSSProperties;
}, {}, string, CustomSlotsType<{
    closeIcon: any;
    title: any;
    extra: any;
    footer: any;
    handle: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
