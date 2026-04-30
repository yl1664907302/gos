import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { Direction } from '../config-provider';
import type { StringGradients, ProgressGradient, ProgressSize } from './props';
export declare const lineProps: () => {
    strokeColor: {
        default: string | ProgressGradient;
        type: import("vue").PropType<string | ProgressGradient>;
    };
    direction: {
        type: import("vue").PropType<Direction>;
        default: Direction;
    };
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
        type: import("vue").PropType<ProgressSize>;
        default: ProgressSize;
    };
    steps: NumberConstructor;
    successPercent: NumberConstructor;
    title: StringConstructor;
    progressStatus: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
};
export type LineProps = Partial<ExtractPropTypes<ReturnType<typeof lineProps>>>;
/**
 * {
 *   '0%': '#afc163',
 *   '75%': '#009900',
 *   '50%': 'green',     ====>     '#afc163 0%, #66FF00 25%, #00CC00 50%, #009900 75%, #ffffff 100%'
 *   '25%': '#66FF00',
 *   '100%': '#ffffff'
 * }
 */
export declare const sortGradient: (gradients: StringGradients) => string;
/**
 * Then this man came to realize the truth: Besides six pence, there is the moon. Besides bread and
 * butter, there is the bug. And... Besides women, there is the code.
 *
 * @example
 *   {
 *     "0%": "#afc163",
 *     "25%": "#66FF00",
 *     "50%": "#00CC00", // ====>  linear-gradient(to right, #afc163 0%, #66FF00 25%,
 *     "75%": "#009900", //        #00CC00 50%, #009900 75%, #ffffff 100%)
 *     "100%": "#ffffff"
 *   }
 */
export declare const handleGradient: (strokeColor: ProgressGradient, directionConfig?: Direction) => CSSProperties;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    strokeColor: {
        default: string | ProgressGradient;
        type: import("vue").PropType<string | ProgressGradient>;
    };
    direction: {
        type: import("vue").PropType<Direction>;
        default: Direction;
    };
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
        type: import("vue").PropType<ProgressSize>;
        default: ProgressSize;
    };
    steps: NumberConstructor;
    successPercent: NumberConstructor;
    title: StringConstructor;
    progressStatus: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    strokeColor: {
        default: string | ProgressGradient;
        type: import("vue").PropType<string | ProgressGradient>;
    };
    direction: {
        type: import("vue").PropType<Direction>;
        default: Direction;
    };
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
        type: import("vue").PropType<ProgressSize>;
        default: ProgressSize;
    };
    steps: NumberConstructor;
    successPercent: NumberConstructor;
    title: StringConstructor;
    progressStatus: {
        type: import("vue").PropType<"normal" | "active" | "success" | "exception">;
        default: "normal" | "active" | "success" | "exception";
    };
}>> & Readonly<{}>, {
    size: ProgressSize;
    type: "circle" | "line" | "dashboard";
    direction: Direction;
    strokeLinecap: "round" | "butt" | "square";
    success: import("./props").SuccessProps;
    format: (percent?: number, successPercent?: number) => import("../_util/type").VueNode;
    status: "normal" | "active" | "success" | "exception";
    showInfo: boolean;
    strokeColor: string | ProgressGradient;
    gapPosition: "left" | "right" | "top" | "bottom";
    progressStatus: "normal" | "active" | "success" | "exception";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
