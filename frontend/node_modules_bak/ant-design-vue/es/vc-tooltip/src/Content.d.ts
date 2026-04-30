import type { ExtractPropTypes } from 'vue';
declare const tooltipContentProps: {
    prefixCls: StringConstructor;
    id: StringConstructor;
    overlayInnerStyle: import("vue-types").VueTypeValidableDef<any>;
};
export type TooltipContentProps = Partial<ExtractPropTypes<typeof tooltipContentProps>>;
declare const _default: import("vue").DefineComponent<{
    prefixCls?: string;
    id?: string;
    overlayInnerStyle?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    prefixCls?: string;
    id?: string;
    overlayInnerStyle?: any;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
