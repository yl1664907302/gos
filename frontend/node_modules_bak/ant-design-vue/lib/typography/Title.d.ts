import type { ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
export declare const titleProps: () => {
    level: PropType<1 | 5 | 2 | 3 | 4>;
    delete: {
        type: BooleanConstructor;
        default: any;
    };
    type: PropType<import("./Base").BaseType>;
    code: {
        type: BooleanConstructor;
        default: any;
    };
    mark: {
        type: BooleanConstructor;
        default: any;
    };
    content: StringConstructor;
    ellipsis: {
        type: PropType<boolean | import("./Base").EllipsisConfig>;
        default: boolean | import("./Base").EllipsisConfig;
    };
    underline: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    editable: {
        type: PropType<boolean | import("./Base").EditConfig>;
        default: boolean | import("./Base").EditConfig;
    };
    keyboard: {
        type: BooleanConstructor;
        default: any;
    };
    copyable: {
        type: PropType<boolean | import("./Base").CopyConfig>;
        default: boolean | import("./Base").CopyConfig;
    };
    'onUpdate:content': PropType<(content: string) => void>;
};
export type TitleProps = Partial<ExtractPropTypes<ReturnType<typeof titleProps>>>;
declare const Title: FunctionalComponent<TitleProps>;
export default Title;
