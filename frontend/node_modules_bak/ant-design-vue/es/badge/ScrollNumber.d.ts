import type { ExtractPropTypes, DefineComponent } from 'vue';
declare const scrollNumberProps: {
    prefixCls: StringConstructor;
    count: import("vue-types").VueTypeValidableDef<any>;
    component: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    show: BooleanConstructor;
};
export type ScrollNumberProps = Partial<ExtractPropTypes<typeof scrollNumberProps>>;
declare const _default: DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    count: import("vue-types").VueTypeValidableDef<any>;
    component: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    show: BooleanConstructor;
}>, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    count: import("vue-types").VueTypeValidableDef<any>;
    component: StringConstructor;
    title: import("vue-types").VueTypeValidableDef<any>;
    show: BooleanConstructor;
}>> & Readonly<{}>, {
    show: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
