export type { ProgressProps } from './props';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: {
            type: import("vue").PropType<"circle" | "line" | "dashboard">;
            default: "circle" | "line" | "dashboard";
        };
        percent: NumberConstructor;
        format: {
            type: import("vue").PropType<(percent?: number, successPercent?: number) => import("../_util/type").VueNode>;
            default: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
        };
        status: {
            type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
            default: "normal" | "active" | "success" | "exception";
        };
        showInfo: {
            type: BooleanConstructor;
            default: boolean;
        };
        strokeWidth: NumberConstructor;
        strokeLinecap: {
            type: import("vue").PropType<"round" | "butt" | "square">;
            default: "round" | "butt" | "square";
        };
        strokeColor: {
            default: string | string[] | import("./props").ProgressGradient;
            type: import("vue").PropType<string | string[] | import("./props").ProgressGradient>;
        };
        trailColor: StringConstructor;
        width: NumberConstructor;
        success: {
            type: import("vue").PropType<import("./props").SuccessProps>;
            default: import("./props").SuccessProps;
        };
        gapDegree: NumberConstructor;
        gapPosition: {
            type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
            default: "left" | "right" | "top" | "bottom";
        };
        size: {
            type: import("vue").PropType<import("./props").ProgressSize>;
            default: import("./props").ProgressSize;
        };
        steps: NumberConstructor;
        successPercent: NumberConstructor;
        title: StringConstructor;
        progressStatus: {
            type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
            default: "normal" | "active" | "success" | "exception";
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("./props").ProgressSize;
        type: "circle" | "line" | "dashboard";
        strokeLinecap: "round" | "butt" | "square";
        success: import("./props").SuccessProps;
        format: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
        status: "normal" | "active" | "success" | "exception";
        showInfo: boolean;
        strokeColor: string | string[] | import("./props").ProgressGradient;
        gapPosition: "left" | "right" | "top" | "bottom";
        progressStatus: "normal" | "active" | "success" | "exception";
    }, true, {}, import("../_util/type").CustomSlotsType<{
        default?: any;
        format?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        type: {
            type: import("vue").PropType<"circle" | "line" | "dashboard">;
            default: "circle" | "line" | "dashboard";
        };
        percent: NumberConstructor;
        format: {
            type: import("vue").PropType<(percent?: number, successPercent?: number) => import("../_util/type").VueNode>;
            default: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
        };
        status: {
            type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
            default: "normal" | "active" | "success" | "exception";
        };
        showInfo: {
            type: BooleanConstructor;
            default: boolean;
        };
        strokeWidth: NumberConstructor;
        strokeLinecap: {
            type: import("vue").PropType<"round" | "butt" | "square">;
            default: "round" | "butt" | "square";
        };
        strokeColor: {
            default: string | string[] | import("./props").ProgressGradient;
            type: import("vue").PropType<string | string[] | import("./props").ProgressGradient>;
        };
        trailColor: StringConstructor;
        width: NumberConstructor;
        success: {
            type: import("vue").PropType<import("./props").SuccessProps>;
            default: import("./props").SuccessProps;
        };
        gapDegree: NumberConstructor;
        gapPosition: {
            type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
            default: "left" | "right" | "top" | "bottom";
        };
        size: {
            type: import("vue").PropType<import("./props").ProgressSize>;
            default: import("./props").ProgressSize;
        };
        steps: NumberConstructor;
        successPercent: NumberConstructor;
        title: StringConstructor;
        progressStatus: {
            type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
            default: "normal" | "active" | "success" | "exception";
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: import("./props").ProgressSize;
        type: "circle" | "line" | "dashboard";
        strokeLinecap: "round" | "butt" | "square";
        success: import("./props").SuccessProps;
        format: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
        status: "normal" | "active" | "success" | "exception";
        showInfo: boolean;
        strokeColor: string | string[] | import("./props").ProgressGradient;
        gapPosition: "left" | "right" | "top" | "bottom";
        progressStatus: "normal" | "active" | "success" | "exception";
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: {
        type: import("vue").PropType<"circle" | "line" | "dashboard">;
        default: "circle" | "line" | "dashboard";
    };
    percent: NumberConstructor;
    format: {
        type: import("vue").PropType<(percent?: number, successPercent?: number) => import("../_util/type").VueNode>;
        default: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
    };
    status: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
    showInfo: {
        type: BooleanConstructor;
        default: boolean;
    };
    strokeWidth: NumberConstructor;
    strokeLinecap: {
        type: import("vue").PropType<"round" | "butt" | "square">;
        default: "round" | "butt" | "square";
    };
    strokeColor: {
        default: string | string[] | import("./props").ProgressGradient;
        type: import("vue").PropType<string | string[] | import("./props").ProgressGradient>;
    };
    trailColor: StringConstructor;
    width: NumberConstructor;
    success: {
        type: import("vue").PropType<import("./props").SuccessProps>;
        default: import("./props").SuccessProps;
    };
    gapDegree: NumberConstructor;
    gapPosition: {
        type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        default: "left" | "right" | "top" | "bottom";
    };
    size: {
        type: import("vue").PropType<import("./props").ProgressSize>;
        default: import("./props").ProgressSize;
    };
    steps: NumberConstructor;
    successPercent: NumberConstructor;
    title: StringConstructor;
    progressStatus: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("./props").ProgressSize;
    type: "circle" | "line" | "dashboard";
    strokeLinecap: "round" | "butt" | "square";
    success: import("./props").SuccessProps;
    format: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
    status: "normal" | "active" | "success" | "exception";
    showInfo: boolean;
    strokeColor: string | string[] | import("./props").ProgressGradient;
    gapPosition: "left" | "right" | "top" | "bottom";
    progressStatus: "normal" | "active" | "success" | "exception";
}, {}, string, import("../_util/type").CustomSlotsType<{
    default?: any;
    format?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
