import type { App } from 'vue';
export type { BasicProps as LayoutProps } from './layout';
export type { SiderProps } from './Sider';
export declare const LayoutHeader: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const LayoutFooter: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const LayoutSider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    collapsible: {
        type: BooleanConstructor;
        default: any;
    };
    collapsed: {
        type: BooleanConstructor;
        default: any;
    };
    defaultCollapsed: {
        type: BooleanConstructor;
        default: any;
    };
    reverseArrow: {
        type: BooleanConstructor;
        default: any;
    };
    zeroWidthTriggerStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    trigger: import("vue-types").VueTypeValidableDef<any>;
    width: import("vue-types").VueTypeDef<string | number>;
    collapsedWidth: import("vue-types").VueTypeDef<string | number>;
    breakpoint: import("vue-types").VueTypeDef<string>;
    theme: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    onBreakpoint: import("vue").PropType<(broken: boolean) => void>;
    onCollapse: import("vue").PropType<(collapsed: boolean, type: import("./Sider").CollapseType) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("breakpoint" | "collapse" | "update:collapsed")[], "breakpoint" | "collapse" | "update:collapsed", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    collapsible: {
        type: BooleanConstructor;
        default: any;
    };
    collapsed: {
        type: BooleanConstructor;
        default: any;
    };
    defaultCollapsed: {
        type: BooleanConstructor;
        default: any;
    };
    reverseArrow: {
        type: BooleanConstructor;
        default: any;
    };
    zeroWidthTriggerStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    trigger: import("vue-types").VueTypeValidableDef<any>;
    width: import("vue-types").VueTypeDef<string | number>;
    collapsedWidth: import("vue-types").VueTypeDef<string | number>;
    breakpoint: import("vue-types").VueTypeDef<string>;
    theme: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    onBreakpoint: import("vue").PropType<(broken: boolean) => void>;
    onCollapse: import("vue").PropType<(collapsed: boolean, type: import("./Sider").CollapseType) => void>;
}>> & Readonly<{
    onBreakpoint?: (...args: any[]) => any;
    onCollapse?: (...args: any[]) => any;
    "onUpdate:collapsed"?: (...args: any[]) => any;
}>, {
    theme: string;
    collapsible: boolean;
    collapsed: boolean;
    defaultCollapsed: boolean;
    reverseArrow: boolean;
    zeroWidthTriggerStyle: import("vue").CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const LayoutContent: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        hasSider: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        hasSider: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    hasSider: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Header: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>> & Readonly<{}>, {
        hasSider: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Footer: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>> & Readonly<{}>, {
        hasSider: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Content: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        hasSider: {
            type: BooleanConstructor;
            default: any;
        };
        tagName: StringConstructor;
    }>> & Readonly<{}>, {
        hasSider: boolean;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    Sider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        collapsible: {
            type: BooleanConstructor;
            default: any;
        };
        collapsed: {
            type: BooleanConstructor;
            default: any;
        };
        defaultCollapsed: {
            type: BooleanConstructor;
            default: any;
        };
        reverseArrow: {
            type: BooleanConstructor;
            default: any;
        };
        zeroWidthTriggerStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        trigger: import("vue-types").VueTypeValidableDef<any>;
        width: import("vue-types").VueTypeDef<string | number>;
        collapsedWidth: import("vue-types").VueTypeDef<string | number>;
        breakpoint: import("vue-types").VueTypeDef<string>;
        theme: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        onBreakpoint: import("vue").PropType<(broken: boolean) => void>;
        onCollapse: import("vue").PropType<(collapsed: boolean, type: import("./Sider").CollapseType) => void>;
    }>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("breakpoint" | "collapse" | "update:collapsed")[], "breakpoint" | "collapse" | "update:collapsed", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        collapsible: {
            type: BooleanConstructor;
            default: any;
        };
        collapsed: {
            type: BooleanConstructor;
            default: any;
        };
        defaultCollapsed: {
            type: BooleanConstructor;
            default: any;
        };
        reverseArrow: {
            type: BooleanConstructor;
            default: any;
        };
        zeroWidthTriggerStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        trigger: import("vue-types").VueTypeValidableDef<any>;
        width: import("vue-types").VueTypeDef<string | number>;
        collapsedWidth: import("vue-types").VueTypeDef<string | number>;
        breakpoint: import("vue-types").VueTypeDef<string>;
        theme: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        onBreakpoint: import("vue").PropType<(broken: boolean) => void>;
        onCollapse: import("vue").PropType<(collapsed: boolean, type: import("./Sider").CollapseType) => void>;
    }>> & Readonly<{
        onBreakpoint?: (...args: any[]) => any;
        onCollapse?: (...args: any[]) => any;
        "onUpdate:collapsed"?: (...args: any[]) => any;
    }>, {
        theme: string;
        collapsible: boolean;
        collapsed: boolean;
        defaultCollapsed: boolean;
        reverseArrow: boolean;
        zeroWidthTriggerStyle: import("vue").CSSProperties;
    }, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    install: (app: App) => App<any>;
};
export default _default;
