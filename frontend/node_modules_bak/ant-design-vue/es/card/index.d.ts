import type { Plugin } from 'vue';
import Meta from './Meta';
import Grid from './Grid';
export type { CardProps } from './Card';
export { Meta as CardMeta, Grid as CardGrid };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        title: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        bodyStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        headStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
            type: import("vue").PropType<"inner">;
        };
        size: {
            type: import("vue").PropType<import("./Card").CardSize>;
        };
        actions: import("vue-types").VueTypeValidableDef<any>;
        tabList: {
            type: import("vue").PropType<import("./Card").CardTabListType[]>;
        };
        tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
        activeTabKey: StringConstructor;
        defaultActiveTabKey: StringConstructor;
        cover: import("vue-types").VueTypeValidableDef<any>;
        onTabChange: {
            type: import("vue").PropType<(key: string) => void>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        loading: boolean;
        bordered: boolean;
        bodyStyle: import("vue").CSSProperties;
        headStyle: import("vue").CSSProperties;
        hoverable: boolean;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        title: any;
        extra: any;
        tabBarExtraContent: any;
        actions: any;
        cover: any;
        customTab: import("./Card").CardTabListType;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        title: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        bodyStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        headStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
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
            type: import("vue").PropType<"inner">;
        };
        size: {
            type: import("vue").PropType<import("./Card").CardSize>;
        };
        actions: import("vue-types").VueTypeValidableDef<any>;
        tabList: {
            type: import("vue").PropType<import("./Card").CardTabListType[]>;
        };
        tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
        activeTabKey: StringConstructor;
        defaultActiveTabKey: StringConstructor;
        cover: import("vue-types").VueTypeValidableDef<any>;
        onTabChange: {
            type: import("vue").PropType<(key: string) => void>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        loading: boolean;
        bordered: boolean;
        bodyStyle: import("vue").CSSProperties;
        headStyle: import("vue").CSSProperties;
        hoverable: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    bodyStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    headStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
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
        type: import("vue").PropType<"inner">;
    };
    size: {
        type: import("vue").PropType<import("./Card").CardSize>;
    };
    actions: import("vue-types").VueTypeValidableDef<any>;
    tabList: {
        type: import("vue").PropType<import("./Card").CardTabListType[]>;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    activeTabKey: StringConstructor;
    defaultActiveTabKey: StringConstructor;
    cover: import("vue-types").VueTypeValidableDef<any>;
    onTabChange: {
        type: import("vue").PropType<(key: string) => void>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    loading: boolean;
    bordered: boolean;
    bodyStyle: import("vue").CSSProperties;
    headStyle: import("vue").CSSProperties;
    hoverable: boolean;
}, {}, string, import("../_util/type").CustomSlotsType<{
    title: any;
    extra: any;
    tabBarExtraContent: any;
    actions: any;
    cover: any;
    customTab: import("./Card").CardTabListType;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Meta: typeof Meta;
    readonly Grid: typeof Grid;
};
export default _default;
