import type { ExtractPropTypes, HTMLAttributes } from 'vue';
export declare const basicProps: () => {
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
};
export type BasicProps = Partial<ExtractPropTypes<ReturnType<typeof basicProps>>> & HTMLAttributes;
declare const Layout: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const Header: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const Footer: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
declare const Content: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    hasSider: {
        type: BooleanConstructor;
        default: any;
    };
    tagName: StringConstructor;
}>> & Readonly<{}>, {
    hasSider: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export { Header, Footer, Content };
export default Layout;
