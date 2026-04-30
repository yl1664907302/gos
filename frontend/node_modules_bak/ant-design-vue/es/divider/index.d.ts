import type { ExtractPropTypes, PropType } from 'vue';
export declare const dividerProps: () => {
    prefixCls: StringConstructor;
    type: {
        type: PropType<"" | "vertical" | "horizontal">;
        default: string;
    };
    dashed: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientation: {
        type: PropType<"left" | "right" | "center">;
        default: string;
    };
    plain: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientationMargin: (StringConstructor | NumberConstructor)[];
};
export type DividerProps = Partial<ExtractPropTypes<ReturnType<typeof dividerProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: {
            type: PropType<"" | "vertical" | "horizontal">;
            default: string;
        };
        dashed: {
            type: BooleanConstructor;
            default: boolean;
        };
        orientation: {
            type: PropType<"left" | "right" | "center">;
            default: string;
        };
        plain: {
            type: BooleanConstructor;
            default: boolean;
        };
        orientationMargin: (StringConstructor | NumberConstructor)[];
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        type: "" | "vertical" | "horizontal";
        dashed: boolean;
        orientation: "left" | "right" | "center";
        plain: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: {
            type: PropType<"" | "vertical" | "horizontal">;
            default: string;
        };
        dashed: {
            type: BooleanConstructor;
            default: boolean;
        };
        orientation: {
            type: PropType<"left" | "right" | "center">;
            default: string;
        };
        plain: {
            type: BooleanConstructor;
            default: boolean;
        };
        orientationMargin: (StringConstructor | NumberConstructor)[];
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        type: "" | "vertical" | "horizontal";
        dashed: boolean;
        orientation: "left" | "right" | "center";
        plain: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: {
        type: PropType<"" | "vertical" | "horizontal">;
        default: string;
    };
    dashed: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientation: {
        type: PropType<"left" | "right" | "center">;
        default: string;
    };
    plain: {
        type: BooleanConstructor;
        default: boolean;
    };
    orientationMargin: (StringConstructor | NumberConstructor)[];
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    type: "" | "vertical" | "horizontal";
    dashed: boolean;
    orientation: "left" | "right" | "center";
    plain: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
