import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { valueType, Formatter } from './utils';
import type { CustomSlotsType, VueNode } from '../_util/type';
export declare const statisticProps: () => {
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    format: StringConstructor;
    value: {
        type: PropType<valueType>;
        default: valueType;
    };
    valueStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    valueRender: {
        type: PropType<(node: VueNode) => VueNode>;
        default: (node: VueNode) => VueNode;
    };
    formatter: {
        default: Formatter;
        type: PropType<Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<VueNode>;
    };
    suffix: {
        type: PropType<VueNode>;
    };
    title: {
        type: PropType<VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type StatisticProps = Partial<ExtractPropTypes<ReturnType<typeof statisticProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    format: StringConstructor;
    value: {
        type: PropType<valueType>;
        default: valueType;
    };
    valueStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    valueRender: {
        type: PropType<(node: VueNode) => VueNode>;
        default: (node: VueNode) => VueNode;
    };
    formatter: {
        default: Formatter;
        type: PropType<Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<VueNode>;
    };
    suffix: {
        type: PropType<VueNode>;
    };
    title: {
        type: PropType<VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    decimalSeparator: StringConstructor;
    groupSeparator: StringConstructor;
    format: StringConstructor;
    value: {
        type: PropType<valueType>;
        default: valueType;
    };
    valueStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    valueRender: {
        type: PropType<(node: VueNode) => VueNode>;
        default: (node: VueNode) => VueNode;
    };
    formatter: {
        default: Formatter;
        type: PropType<Formatter>;
    };
    precision: NumberConstructor;
    prefix: {
        type: PropType<VueNode>;
    };
    suffix: {
        type: PropType<VueNode>;
    };
    title: {
        type: PropType<VueNode>;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, {
    value: valueType;
    loading: boolean;
    formatter: Formatter;
    valueStyle: CSSProperties;
    valueRender: (node: VueNode) => VueNode;
}, CustomSlotsType<{
    title?: any;
    prefix?: any;
    suffix?: any;
    formatter?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
