import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
import type { CustomSlotsType } from '../_util/type';
export interface CardTabListType {
    key: string;
    tab: any;
    /** @deprecated Please use `customTab` instead. */
    slots?: {
        tab: string;
    };
    disabled?: boolean;
}
export type CardType = 'inner';
export type CardSize = 'default' | 'small';
export declare const cardProps: () => {
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    headStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: PropType<"inner">;
    };
    size: {
        type: PropType<CardSize>;
    };
    actions: import("vue-types").VueTypeValidableDef<any>;
    tabList: {
        type: PropType<CardTabListType[]>;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    activeTabKey: StringConstructor;
    defaultActiveTabKey: StringConstructor;
    cover: import("vue-types").VueTypeValidableDef<any>;
    onTabChange: {
        type: PropType<(key: string) => void>;
    };
};
export type CardProps = Partial<ExtractPropTypes<ReturnType<typeof cardProps>>>;
declare const Card: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    headStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: PropType<"inner">;
    };
    size: {
        type: PropType<CardSize>;
    };
    actions: import("vue-types").VueTypeValidableDef<any>;
    tabList: {
        type: PropType<CardTabListType[]>;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    activeTabKey: StringConstructor;
    defaultActiveTabKey: StringConstructor;
    cover: import("vue-types").VueTypeValidableDef<any>;
    onTabChange: {
        type: PropType<(key: string) => void>;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    bodyStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    headStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    loading: {
        type: BooleanConstructor;
        default: boolean;
    };
    hoverable: {
        type: BooleanConstructor;
        default: boolean;
    };
    type: {
        type: PropType<"inner">;
    };
    size: {
        type: PropType<CardSize>;
    };
    actions: import("vue-types").VueTypeValidableDef<any>;
    tabList: {
        type: PropType<CardTabListType[]>;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    activeTabKey: StringConstructor;
    defaultActiveTabKey: StringConstructor;
    cover: import("vue-types").VueTypeValidableDef<any>;
    onTabChange: {
        type: PropType<(key: string) => void>;
    };
}>> & Readonly<{}>, {
    loading: boolean;
    bordered: boolean;
    bodyStyle: CSSProperties;
    headStyle: CSSProperties;
    hoverable: boolean;
}, CustomSlotsType<{
    title: any;
    extra: any;
    tabBarExtraContent: any;
    actions: any;
    cover: any;
    customTab: CardTabListType;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Card;
