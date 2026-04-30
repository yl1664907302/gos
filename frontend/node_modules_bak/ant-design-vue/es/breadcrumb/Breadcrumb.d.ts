import type { PropType, ExtractPropTypes } from 'vue';
import type { CustomSlotsType, VueNode } from '../_util/type';
export interface Route {
    path: string;
    breadcrumbName: string;
    children?: Omit<Route, 'children'>[];
}
export declare const breadcrumbProps: () => {
    prefixCls: StringConstructor;
    routes: {
        type: PropType<Route[]>;
    };
    params: import("vue-types").VueTypeValidableDef<any>;
    separator: import("vue-types").VueTypeValidableDef<any>;
    itemRender: {
        type: PropType<(opt: {
            route: Route;
            params: unknown;
            routes: Route[];
            paths: string[];
        }) => VueNode>;
    };
};
export type BreadcrumbProps = Partial<ExtractPropTypes<ReturnType<typeof breadcrumbProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    routes: {
        type: PropType<Route[]>;
    };
    params: import("vue-types").VueTypeValidableDef<any>;
    separator: import("vue-types").VueTypeValidableDef<any>;
    itemRender: {
        type: PropType<(opt: {
            route: Route;
            params: unknown;
            routes: Route[];
            paths: string[];
        }) => VueNode>;
    };
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    routes: {
        type: PropType<Route[]>;
    };
    params: import("vue-types").VueTypeValidableDef<any>;
    separator: import("vue-types").VueTypeValidableDef<any>;
    itemRender: {
        type: PropType<(opt: {
            route: Route;
            params: unknown;
            routes: Route[];
            paths: string[];
        }) => VueNode>;
    };
}>> & Readonly<{}>, {}, CustomSlotsType<{
    separator: any;
    itemRender: {
        route: Route;
        params: any;
        routes: Route[];
        paths: string[];
    };
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
