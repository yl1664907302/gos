import buttonProps from './buttonTypes';
import type { ButtonType } from './buttonTypes';
import type { CustomSlotsType } from '../_util/type';
export { buttonProps };
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: import("vue").PropType<ButtonType>;
    htmlType: {
        type: import("vue").PropType<import("./buttonTypes").ButtonHTMLType>;
        default: string;
    };
    shape: {
        type: import("vue").PropType<import("./buttonTypes").ButtonShape>;
    };
    size: {
        type: import("vue").PropType<import(".").ButtonSize>;
    };
    loading: {
        type: import("vue").PropType<boolean | {
            delay?: number;
        }>;
        default: () => boolean | {
            delay?: number;
        };
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ghost: {
        type: BooleanConstructor;
        default: any;
    };
    block: {
        type: BooleanConstructor;
        default: any;
    };
    danger: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    target: StringConstructor;
    title: StringConstructor;
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    type: import("vue").PropType<ButtonType>;
    htmlType: {
        type: import("vue").PropType<import("./buttonTypes").ButtonHTMLType>;
        default: string;
    };
    shape: {
        type: import("vue").PropType<import("./buttonTypes").ButtonShape>;
    };
    size: {
        type: import("vue").PropType<import(".").ButtonSize>;
    };
    loading: {
        type: import("vue").PropType<boolean | {
            delay?: number;
        }>;
        default: () => boolean | {
            delay?: number;
        };
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    ghost: {
        type: BooleanConstructor;
        default: any;
    };
    block: {
        type: BooleanConstructor;
        default: any;
    };
    danger: {
        type: BooleanConstructor;
        default: any;
    };
    icon: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    target: StringConstructor;
    title: StringConstructor;
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
    onMousedown: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler | import("../_util/EventInterface").MouseEventHandler[]>;
    };
}>> & Readonly<{}>, {
    block: boolean;
    disabled: boolean;
    danger: boolean;
    ghost: boolean;
    htmlType: import("./buttonTypes").ButtonHTMLType;
    loading: boolean | {
        delay?: number;
    };
}, CustomSlotsType<{
    icon: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
