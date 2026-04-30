import type { Plugin } from 'vue';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';
export type { BreadcrumbProps } from './Breadcrumb';
export type { BreadcrumbItemProps } from './BreadcrumbItem';
export type { BreadcrumbSeparatorProps } from './BreadcrumbSeparator';
export { BreadcrumbItem, BreadcrumbSeparator };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        routes: {
            type: import("vue").PropType<import("./Breadcrumb").Route[]>;
        };
        params: import("vue-types").VueTypeValidableDef<any>;
        separator: import("vue-types").VueTypeValidableDef<any>;
        itemRender: {
            type: import("vue").PropType<(opt: {
                route: import("./Breadcrumb").Route;
                params: unknown;
                routes: import("./Breadcrumb").Route[];
                paths: string[];
            }) => import("../_util/type").VueNode>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {}, true, {}, import("../_util/type").CustomSlotsType<{
        separator: any;
        itemRender: {
            route: import("./Breadcrumb").Route;
            params: any;
            routes: import("./Breadcrumb").Route[];
            paths: string[];
        };
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
        routes: {
            type: import("vue").PropType<import("./Breadcrumb").Route[]>;
        };
        params: import("vue-types").VueTypeValidableDef<any>;
        separator: import("vue-types").VueTypeValidableDef<any>;
        itemRender: {
            type: import("vue").PropType<(opt: {
                route: import("./Breadcrumb").Route;
                params: unknown;
                routes: import("./Breadcrumb").Route[];
                paths: string[];
            }) => import("../_util/type").VueNode>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {}>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    routes: {
        type: import("vue").PropType<import("./Breadcrumb").Route[]>;
    };
    params: import("vue-types").VueTypeValidableDef<any>;
    separator: import("vue-types").VueTypeValidableDef<any>;
    itemRender: {
        type: import("vue").PropType<(opt: {
            route: import("./Breadcrumb").Route;
            params: unknown;
            routes: import("./Breadcrumb").Route[];
            paths: string[];
        }) => import("../_util/type").VueNode>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {}, {}, string, import("../_util/type").CustomSlotsType<{
    separator: any;
    itemRender: {
        route: import("./Breadcrumb").Route;
        params: any;
        routes: import("./Breadcrumb").Route[];
        paths: string[];
    };
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Item: typeof BreadcrumbItem;
    readonly Separator: typeof BreadcrumbSeparator;
};
export default _default;
