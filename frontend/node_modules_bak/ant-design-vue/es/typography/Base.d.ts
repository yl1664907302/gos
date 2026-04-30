import type { TypographyProps } from './Typography';
import type { PropType } from 'vue';
import type { EventHandler } from '../_util/EventInterface';
import type { AutoSizeType } from '../input/inputProps';
export type BaseType = 'secondary' | 'success' | 'warning' | 'danger';
export interface CopyConfig {
    text?: string;
    onCopy?: (event?: MouseEvent) => void;
    tooltip?: boolean;
}
export interface EditConfig {
    editing?: boolean;
    tooltip?: boolean;
    onStart?: () => void;
    onChange?: (value: string) => void;
    onCancel?: () => void;
    onEnd?: () => void;
    maxlength?: number;
    autoSize?: boolean | AutoSizeType;
    triggerType?: ('icon' | 'text')[];
}
export interface EllipsisConfig {
    rows?: number;
    expandable?: boolean;
    suffix?: string;
    symbol?: string;
    onExpand?: EventHandler;
    onEllipsis?: (ellipsis: boolean) => void;
    tooltip?: any;
}
export interface BlockProps extends TypographyProps {
    title?: string;
    editable?: boolean | EditConfig;
    copyable?: boolean | CopyConfig;
    type?: BaseType;
    disabled?: boolean;
    ellipsis?: boolean | EllipsisConfig;
    code?: boolean;
    mark?: boolean;
    underline?: boolean;
    delete?: boolean;
    strong?: boolean;
    keyboard?: boolean;
    content?: string;
}
export declare const baseProps: () => {
    editable: {
        type: PropType<boolean | EditConfig>;
        default: boolean | EditConfig;
    };
    copyable: {
        type: PropType<boolean | CopyConfig>;
        default: boolean | CopyConfig;
    };
    prefixCls: StringConstructor;
    component: StringConstructor;
    type: PropType<BaseType>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ellipsis: {
        type: PropType<boolean | EllipsisConfig>;
        default: boolean | EllipsisConfig;
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
    'onUpdate:content': PropType<(content: string) => void>;
};
declare const Base: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    editable: {
        type: PropType<boolean | EditConfig>;
        default: boolean | EditConfig;
    };
    copyable: {
        type: PropType<boolean | CopyConfig>;
        default: boolean | CopyConfig;
    };
    prefixCls: StringConstructor;
    component: StringConstructor;
    type: PropType<BaseType>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ellipsis: {
        type: PropType<boolean | EllipsisConfig>;
        default: boolean | EllipsisConfig;
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
    'onUpdate:content': PropType<(content: string) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    editable: {
        type: PropType<boolean | EditConfig>;
        default: boolean | EditConfig;
    };
    copyable: {
        type: PropType<boolean | CopyConfig>;
        default: boolean | CopyConfig;
    };
    prefixCls: StringConstructor;
    component: StringConstructor;
    type: PropType<BaseType>;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ellipsis: {
        type: PropType<boolean | EllipsisConfig>;
        default: boolean | EllipsisConfig;
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
    'onUpdate:content': PropType<(content: string) => void>;
}>> & Readonly<{}>, {
    delete: boolean;
    code: boolean;
    mark: boolean;
    strong: boolean;
    ellipsis: boolean | EllipsisConfig;
    underline: boolean;
    disabled: boolean;
    editable: boolean | EditConfig;
    keyboard: boolean;
    copyable: boolean | CopyConfig;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Base;
