import type { AnchorHTMLAttributes, ExtractPropTypes, FunctionalComponent } from 'vue';
export declare const linkProps: () => Omit<{
    ellipsis: {
        type: BooleanConstructor;
        default: any;
    };
    editable: {
        type: import("vue").PropType<boolean | import("./Base").EditConfig>;
        default: boolean | import("./Base").EditConfig;
    };
    copyable: {
        type: import("vue").PropType<boolean | import("./Base").CopyConfig>;
        default: boolean | import("./Base").CopyConfig;
    };
    prefixCls: StringConstructor;
    component: StringConstructor;
    type: import("vue").PropType<import("./Base").BaseType>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    code: {
        type: BooleanConstructor;
        default: any;
    };
    mark: {
        type: BooleanConstructor;
        default: any;
    };
    underline: {
        type: BooleanConstructor;
        default: any;
    };
    delete: {
        type: BooleanConstructor;
        default: any;
    };
    strong: {
        type: BooleanConstructor;
        default: any;
    };
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    content: StringConstructor;
    'onUpdate:content': import("vue").PropType<(content: string) => void>;
}, "component">;
export type LinkProps = Partial<ExtractPropTypes<ReturnType<typeof linkProps>>> & AnchorHTMLAttributes;
declare const Link: FunctionalComponent<LinkProps>;
export default Link;
