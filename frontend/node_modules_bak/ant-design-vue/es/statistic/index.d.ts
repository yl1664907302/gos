import type { Plugin } from 'vue';
import Countdown from './Countdown';
export type { StatisticProps } from './Statistic';
export declare const StatisticCountdown: any;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        decimalSeparator: StringConstructor;
        groupSeparator: StringConstructor;
        format: StringConstructor;
        value: {
            type: import("vue").PropType<import("./utils").valueType>;
            default: import("./utils").valueType;
        };
        valueStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        valueRender: {
            type: import("vue").PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        formatter: {
            default: import("./utils").Formatter;
            type: import("vue").PropType<import("./utils").Formatter>;
        };
        precision: NumberConstructor;
        prefix: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        suffix: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        title: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        loading: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        value: import("./utils").valueType;
        loading: boolean;
        formatter: import("./utils").Formatter;
        valueStyle: import("vue").CSSProperties;
        valueRender: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        title?: any;
        prefix?: any;
        suffix?: any;
        formatter?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        decimalSeparator: StringConstructor;
        groupSeparator: StringConstructor;
        format: StringConstructor;
        value: {
            type: import("vue").PropType<import("./utils").valueType>;
            default: import("./utils").valueType;
        };
        valueStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        valueRender: {
            type: import("vue").PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
            default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
        };
        formatter: {
            default: import("./utils").Formatter;
            type: import("vue").PropType<import("./utils").Formatter>;
        };
        precision: NumberConstructor;
        prefix: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        suffix: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        title: {
            type: import("vue").PropType<import("../_util/type").VueNode>;
        };
        loading: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        value: import("./utils").valueType;
        loading: boolean;
        formatter: import("./utils").Formatter;
        valueStyle: import("vue").CSSProperties;
        valueRender: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    format: StringConstructor;
    value: {
        type: import("vue").PropType<import("./utils").valueType>;
        default: import("./utils").valueType;
    };
    valueStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    valueRender: {
        type: import("vue").PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    formatter: {
        default: import("./utils").Formatter;
        type: import("vue").PropType<import("./utils").Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    suffix: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    title: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    value: import("./utils").valueType;
    loading: boolean;
    formatter: import("./utils").Formatter;
    valueStyle: import("vue").CSSProperties;
    valueRender: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
}, {}, string, import("../_util/type").CustomSlotsType<{
    title?: any;
    prefix?: any;
    suffix?: any;
    formatter?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Countdown: typeof Countdown;
};
export default _default;
