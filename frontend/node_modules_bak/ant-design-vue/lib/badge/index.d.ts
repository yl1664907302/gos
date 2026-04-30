import type { Plugin } from 'vue';
import Ribbon from './Ribbon';
export type { BadgeProps } from './Badge';
export { Ribbon as BadgeRibbon };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        count: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        showZero: {
            type: BooleanConstructor;
            default: any;
        };
        overflowCount: {
            type: NumberConstructor;
            default: number;
        };
        dot: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        scrollNumberPrefixCls: StringConstructor;
        status: {
            type: import("vue").PropType<"error" | "default" | "success" | "processing" | "warning">;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
            default: string;
        };
        color: import("vue").PropType<import("../_util/type").LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
        text: import("vue-types").VueTypeValidableDef<any>;
        offset: import("vue").PropType<[string | number, string | number]>;
        numberStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        title: StringConstructor;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: "default" | "small";
        dot: boolean;
        count: any;
        showZero: boolean;
        overflowCount: number;
        numberStyle: import("vue").CSSProperties;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        text: any;
        count: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        count: import("vue-types").VueTypeValidableDef<any> & {
            default: any;
        };
        showZero: {
            type: BooleanConstructor;
            default: any;
        };
        overflowCount: {
            type: NumberConstructor;
            default: number;
        };
        dot: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        scrollNumberPrefixCls: StringConstructor;
        status: {
            type: import("vue").PropType<"error" | "default" | "success" | "processing" | "warning">;
        };
        size: {
            type: import("vue").PropType<"default" | "small">;
            default: string;
        };
        color: import("vue").PropType<import("../_util/type").LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
        text: import("vue-types").VueTypeValidableDef<any>;
        offset: import("vue").PropType<[string | number, string | number]>;
        numberStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        title: StringConstructor;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: "default" | "small";
        dot: boolean;
        count: any;
        showZero: boolean;
        overflowCount: number;
        numberStyle: import("vue").CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    count: import("vue-types").VueTypeValidableDef<any> & {
        default: any;
    };
    showZero: {
        type: BooleanConstructor;
        default: any;
    };
    overflowCount: {
        type: NumberConstructor;
        default: number;
    };
    dot: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    scrollNumberPrefixCls: StringConstructor;
    status: {
        type: import("vue").PropType<"error" | "default" | "success" | "processing" | "warning">;
    };
    size: {
        type: import("vue").PropType<"default" | "small">;
        default: string;
    };
    color: import("vue").PropType<import("../_util/type").LiteralUnion<"blue" | "cyan" | "gold" | "green" | "lime" | "magenta" | "orange" | "pink" | "purple" | "red" | "yellow" | "volcano" | "geekblue">>;
    text: import("vue-types").VueTypeValidableDef<any>;
    offset: import("vue").PropType<[string | number, string | number]>;
    numberStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    title: StringConstructor;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: "default" | "small";
    dot: boolean;
    count: any;
    showZero: boolean;
    overflowCount: number;
    numberStyle: import("vue").CSSProperties;
}, {}, string, import("../_util/type").CustomSlotsType<{
    text: any;
    count: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Ribbon: typeof Ribbon;
};
export default _default;
