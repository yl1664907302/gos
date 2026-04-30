export type { RowProps } from '../grid';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        align: {
            type: import("vue").PropType<"top" | "bottom" | "stretch" | "middle" | {
                sm?: "top" | "bottom" | "stretch" | "middle";
                lg?: "top" | "bottom" | "stretch" | "middle";
                xxl?: "top" | "bottom" | "stretch" | "middle";
                xl?: "top" | "bottom" | "stretch" | "middle";
                md?: "top" | "bottom" | "stretch" | "middle";
                xs?: "top" | "bottom" | "stretch" | "middle";
            }>;
            default: "top" | "bottom" | "stretch" | "middle" | {
                sm?: "top" | "bottom" | "stretch" | "middle";
                lg?: "top" | "bottom" | "stretch" | "middle";
                xxl?: "top" | "bottom" | "stretch" | "middle";
                xl?: "top" | "bottom" | "stretch" | "middle";
                md?: "top" | "bottom" | "stretch" | "middle";
                xs?: "top" | "bottom" | "stretch" | "middle";
            };
        };
        justify: {
            type: import("vue").PropType<"center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
                sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            }>;
            default: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
                sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            };
        };
        prefixCls: StringConstructor;
        gutter: {
            type: import("vue").PropType<import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter]>;
            default: import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
        };
        wrap: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        justify: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
            sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        };
        wrap: boolean;
        align: "top" | "bottom" | "stretch" | "middle" | {
            sm?: "top" | "bottom" | "stretch" | "middle";
            lg?: "top" | "bottom" | "stretch" | "middle";
            xxl?: "top" | "bottom" | "stretch" | "middle";
            xl?: "top" | "bottom" | "stretch" | "middle";
            md?: "top" | "bottom" | "stretch" | "middle";
            xs?: "top" | "bottom" | "stretch" | "middle";
        };
        gutter: number | Partial<Record<import("../_util/responsiveObserve").Breakpoint, number>> | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        align: {
            type: import("vue").PropType<"top" | "bottom" | "stretch" | "middle" | {
                sm?: "top" | "bottom" | "stretch" | "middle";
                lg?: "top" | "bottom" | "stretch" | "middle";
                xxl?: "top" | "bottom" | "stretch" | "middle";
                xl?: "top" | "bottom" | "stretch" | "middle";
                md?: "top" | "bottom" | "stretch" | "middle";
                xs?: "top" | "bottom" | "stretch" | "middle";
            }>;
            default: "top" | "bottom" | "stretch" | "middle" | {
                sm?: "top" | "bottom" | "stretch" | "middle";
                lg?: "top" | "bottom" | "stretch" | "middle";
                xxl?: "top" | "bottom" | "stretch" | "middle";
                xl?: "top" | "bottom" | "stretch" | "middle";
                md?: "top" | "bottom" | "stretch" | "middle";
                xs?: "top" | "bottom" | "stretch" | "middle";
            };
        };
        justify: {
            type: import("vue").PropType<"center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
                sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            }>;
            default: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
                sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
                xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            };
        };
        prefixCls: StringConstructor;
        gutter: {
            type: import("vue").PropType<import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter]>;
            default: import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
        };
        wrap: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        justify: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
            sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        };
        wrap: boolean;
        align: "top" | "bottom" | "stretch" | "middle" | {
            sm?: "top" | "bottom" | "stretch" | "middle";
            lg?: "top" | "bottom" | "stretch" | "middle";
            xxl?: "top" | "bottom" | "stretch" | "middle";
            xl?: "top" | "bottom" | "stretch" | "middle";
            md?: "top" | "bottom" | "stretch" | "middle";
            xs?: "top" | "bottom" | "stretch" | "middle";
        };
        gutter: number | Partial<Record<import("../_util/responsiveObserve").Breakpoint, number>> | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    align: {
        type: import("vue").PropType<"top" | "bottom" | "stretch" | "middle" | {
            sm?: "top" | "bottom" | "stretch" | "middle";
            lg?: "top" | "bottom" | "stretch" | "middle";
            xxl?: "top" | "bottom" | "stretch" | "middle";
            xl?: "top" | "bottom" | "stretch" | "middle";
            md?: "top" | "bottom" | "stretch" | "middle";
            xs?: "top" | "bottom" | "stretch" | "middle";
        }>;
        default: "top" | "bottom" | "stretch" | "middle" | {
            sm?: "top" | "bottom" | "stretch" | "middle";
            lg?: "top" | "bottom" | "stretch" | "middle";
            xxl?: "top" | "bottom" | "stretch" | "middle";
            xl?: "top" | "bottom" | "stretch" | "middle";
            md?: "top" | "bottom" | "stretch" | "middle";
            xs?: "top" | "bottom" | "stretch" | "middle";
        };
    };
    justify: {
        type: import("vue").PropType<"center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
            sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        }>;
        default: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
            sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
            xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        };
    };
    prefixCls: StringConstructor;
    gutter: {
        type: import("vue").PropType<import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter]>;
        default: import("../grid/Row").Gutter | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
    };
    wrap: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    justify: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly" | {
        sm?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        lg?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        xxl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        xl?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        md?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
        xs?: "center" | "end" | "start" | "space-around" | "space-between" | "space-evenly";
    };
    wrap: boolean;
    align: "top" | "bottom" | "stretch" | "middle" | {
        sm?: "top" | "bottom" | "stretch" | "middle";
        lg?: "top" | "bottom" | "stretch" | "middle";
        xxl?: "top" | "bottom" | "stretch" | "middle";
        xl?: "top" | "bottom" | "stretch" | "middle";
        md?: "top" | "bottom" | "stretch" | "middle";
        xs?: "top" | "bottom" | "stretch" | "middle";
    };
    gutter: number | Partial<Record<import("../_util/responsiveObserve").Breakpoint, number>> | [import("../grid/Row").Gutter, import("../grid/Row").Gutter];
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
