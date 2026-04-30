import type { VueNode, CustomSlotsType } from '../_util/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: {
        type: import("vue").PropType<"circle" | "line" | "dashboard">;
        default: "circle" | "line" | "dashboard";
    };
    percent: NumberConstructor;
    format: {
        type: import("vue").PropType<(percent?: number, successPercent?: number) => VueNode>;
        default: (percent?: number, successPercent?: number) => VueNode;
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
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: {
        type: import("vue").PropType<"circle" | "line" | "dashboard">;
        default: "circle" | "line" | "dashboard";
    };
    percent: NumberConstructor;
    format: {
        type: import("vue").PropType<(percent?: number, successPercent?: number) => VueNode>;
        default: (percent?: number, successPercent?: number) => VueNode;
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
}>> & Readonly<{}>, {
    size: import("./props").ProgressSize;
    type: "circle" | "line" | "dashboard";
    strokeLinecap: "round" | "butt" | "square";
    success: import("./props").SuccessProps;
    format: (percent?: number, successPercent?: number) => VueNode;
    status: "normal" | "active" | "success" | "exception";
    showInfo: boolean;
    strokeColor: string | string[] | import("./props").ProgressGradient;
    gapPosition: "left" | "right" | "top" | "bottom";
    progressStatus: "normal" | "active" | "success" | "exception";
}, CustomSlotsType<{
    default?: any;
    format?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
