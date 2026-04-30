import type { ExtractPropTypes, FunctionalComponent } from 'vue';
export declare const paragraphProps: () => Omit<{
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
    ellipsis: {
        type: import("vue").PropType<boolean | import("./Base").EllipsisConfig>;
        default: boolean | import("./Base").EllipsisConfig;
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
export type ParagraphProps = Partial<ExtractPropTypes<ReturnType<typeof paragraphProps>>>;
declare const Paragraph: FunctionalComponent<ParagraphProps>;
export default Paragraph;
