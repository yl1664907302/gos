import type { VueNode } from '../_util/type';
import type { ExtractPropTypes } from 'vue';
export declare const progressStatuses: readonly ["normal", "exception", "active", "success"];
export type ProgressStatusesType = (typeof progressStatuses)[number];
declare const ProgressType: readonly ["line", "circle", "dashboard"];
export type ProgressType = (typeof ProgressType)[number];
declare const ProgressSize: readonly ["default", "small"];
export type ProgressSize = (typeof ProgressSize)[number] | number | [number, number];
export type StringGradients = {
    [percentage: string]: string;
};
type FromToGradients = {
    from: string;
    to: string;
};
export type ProgressGradient = {
    direction?: string;
} & (StringGradients | FromToGradients);
export interface SuccessProps {
    percent?: number;
    /** @deprecated Use `percent` instead */
    progress?: number;
    strokeColor?: string;
}
export declare const progressProps: () => {
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
        default: string | string[] | ProgressGradient;
        type: import("vue").PropType<string | string[] | ProgressGradient>;
    };
    trailColor: StringConstructor;
    /** @deprecated Use `size` instead */
    width: NumberConstructor;
    success: {
        type: import("vue").PropType<SuccessProps>;
        default: SuccessProps;
    };
    gapDegree: NumberConstructor;
    gapPosition: {
        type: import("vue").PropType<"left" | "right" | "top" | "bottom">;
        default: "left" | "right" | "top" | "bottom";
    };
    size: {
        type: import("vue").PropType<ProgressSize>;
        default: ProgressSize;
    };
    steps: NumberConstructor;
    /** @deprecated Use `success` instead */
    successPercent: NumberConstructor;
    title: StringConstructor;
    progressStatus: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
};
export type ProgressProps = Partial<ExtractPropTypes<ReturnType<typeof progressProps>>>;
export {};
