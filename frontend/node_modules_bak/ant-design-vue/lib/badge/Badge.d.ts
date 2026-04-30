import type { ExtractPropTypes, CSSProperties, PropType } from 'vue';
import type { LiteralUnion, CustomSlotsType } from '../_util/type';
export declare const badgeProps: () => {
    /** Number to show in badge */
    count: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    showZero: {
        type: BooleanConstructor;
        default: any;
    };
    /** Max count to show */
    overflowCount: {
        type: NumberConstructor;
        default: number;
    };
    /** whether to show red dot without number */
    dot: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    scrollNumberPrefixCls: StringConstructor;
    status: {
        type: PropType<"error" | "default" | "success" | "processing" | "warning">;
    };
    size: {
        type: PropType<"default" | "small">;
        default: string;
    };
    color: PropType<LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
    text: import("vue-types").VueTypeValidableDef<any>;
    offset: PropType<[string | number, string | number]>;
    numberStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    title: StringConstructor;
};
export type BadgeProps = Partial<ExtractPropTypes<ReturnType<typeof badgeProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    /** Number to show in badge */
    count: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    showZero: {
        type: BooleanConstructor;
        default: any;
    };
    /** Max count to show */
    overflowCount: {
        type: NumberConstructor;
        default: number;
    };
    /** whether to show red dot without number */
    dot: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    scrollNumberPrefixCls: StringConstructor;
    status: {
        type: PropType<"error" | "default" | "success" | "processing" | "warning">;
    };
    size: {
        type: PropType<"default" | "small">;
        default: string;
    };
    color: PropType<LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
    text: import("vue-types").VueTypeValidableDef<any>;
    offset: PropType<[string | number, string | number]>;
    numberStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    title: StringConstructor;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    /** Number to show in badge */
    count: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    showZero: {
        type: BooleanConstructor;
        default: any;
    };
    /** Max count to show */
    overflowCount: {
        type: NumberConstructor;
        default: number;
    };
    /** whether to show red dot without number */
    dot: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    scrollNumberPrefixCls: StringConstructor;
    status: {
        type: PropType<"error" | "default" | "success" | "processing" | "warning">;
    };
    size: {
        type: PropType<"default" | "small">;
        default: string;
    };
    color: PropType<LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
    text: import("vue-types").VueTypeValidableDef<any>;
    offset: PropType<[string | number, string | number]>;
    numberStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    title: StringConstructor;
}>> & Readonly<{}>, {
    size: "default" | "small";
    dot: boolean;
    count: any;
    showZero: boolean;
    overflowCount: number;
    numberStyle: CSSProperties;
}, CustomSlotsType<{
    text: any;
    count: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
