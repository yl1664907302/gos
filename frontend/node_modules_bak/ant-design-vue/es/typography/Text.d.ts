import type { ExtractPropTypes, FunctionalComponent, PropType } from 'vue';
import type { EllipsisConfig } from './Base';
export declare const textProps: () => {
    ellipsis: {
        type: PropType<boolean | Omit<EllipsisConfig, "rows" | "onExpand" | "expandable">>;
        default: boolean | Omit<EllipsisConfig, "rows" | "onExpand" | "expandable">;
    };
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
    strong: {
        type: BooleanConstructor;
        default: any;
    };
    content: StringConstructor;
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
export type TextProps = Partial<ExtractPropTypes<ReturnType<typeof textProps>>>;
declare const Text: FunctionalComponent<TextProps>;
export default Text;
