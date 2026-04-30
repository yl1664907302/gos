import type { Tab } from './interface';
import type { PropType, Ref } from 'vue';
export interface TabContextProps {
    tabs: Ref<Tab[]>;
    prefixCls: Ref<string>;
}
export declare const useProvideTabs: (props: TabContextProps) => void;
export declare const useInjectTabs: () => {
    tabs: Ref<any[], any[]>;
    prefixCls: Ref<any, any>;
};
declare const TabsContextProvider: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    tabs: {
        type: PropType<Ref<Tab[], Tab[]>>;
        default: any;
    };
    prefixCls: {
        type: StringConstructor;
        default: any;
    };
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    tabs: {
        type: PropType<Ref<Tab[], Tab[]>>;
        default: any;
    };
    prefixCls: {
        type: StringConstructor;
        default: any;
    };
}>> & Readonly<{}>, {
    prefixCls: string;
    tabs: Ref<Tab[], Tab[]>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default TabsContextProvider;
