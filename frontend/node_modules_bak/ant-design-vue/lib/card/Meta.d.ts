import type { ExtractPropTypes } from 'vue';
import type { CustomSlotsType } from '../_util/type';
export declare const cardMetaProps: () => {
    prefixCls: StringConstructor;
    title: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    description: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    avatar: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
};
export type CardGridProps = Partial<ExtractPropTypes<ReturnType<typeof cardMetaProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    title: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    description: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    avatar: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    title: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    description: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
    avatar: {
        type: import("vue").PropType<import("../_util/type").VueNode>;
    };
}>> & Readonly<{}>, {}, CustomSlotsType<{
    title: any;
    description: any;
    avatar: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
