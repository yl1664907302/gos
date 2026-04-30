import type { ExtractPropTypes, PropType } from 'vue';
import type { countdownValueType } from './utils';
export declare const countdownProps: () => {
    value: {
        type: PropType<countdownValueType>;
        default: countdownValueType;
    };
    format: StringConstructor;
    onFinish: PropType<() => void>;
    onChange: PropType<(value?: countdownValueType) => void>;
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    valueStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    valueRender: {
        type: PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    formatter: {
        default: import("./utils").Formatter;
        type: PropType<import("./utils").Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    suffix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    title: {
        type: PropType<import("../_util/type").VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type CountdownProps = Partial<ExtractPropTypes<ReturnType<typeof countdownProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    value: {
        type: PropType<countdownValueType>;
        default: countdownValueType;
    };
    format: StringConstructor;
    onFinish: PropType<() => void>;
    onChange: PropType<(value?: countdownValueType) => void>;
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    valueStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    valueRender: {
        type: PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    formatter: {
        default: import("./utils").Formatter;
        type: PropType<import("./utils").Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    suffix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    title: {
        type: PropType<import("../_util/type").VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    value: {
        type: PropType<countdownValueType>;
        default: countdownValueType;
    };
    format: StringConstructor;
    onFinish: PropType<() => void>;
    onChange: PropType<(value?: countdownValueType) => void>;
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    valueStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    valueRender: {
        type: PropType<(node: import("../_util/type").VueNode) => import("../_util/type").VueNode>;
        default: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
    };
    formatter: {
        default: import("./utils").Formatter;
        type: PropType<import("./utils").Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    suffix: {
        type: PropType<import("../_util/type").VueNode>;
    };
    title: {
        type: PropType<import("../_util/type").VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    value: countdownValueType;
    loading: boolean;
    formatter: import("./utils").Formatter;
    valueStyle: import("vue").CSSProperties;
    valueRender: (node: import("../_util/type").VueNode) => import("../_util/type").VueNode;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
