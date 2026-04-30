import type { ExtractPropTypes } from 'vue';
import type { MouseEventHandler } from '../_util/EventInterface';
import type { BadgeProps } from '../badge';
export type FloatButtonType = 'default' | 'primary';
export type FloatButtonShape = 'circle' | 'square';
export type FloatButtonGroupTrigger = 'click' | 'hover';
export type FloatButtonBadgeProps = Omit<BadgeProps, 'status' | 'text' | 'title' | 'children'>;
export declare const floatButtonProps: () => {
    prefixCls: StringConstructor;
    description: import("vue-types").VueTypeValidableDef<any>;
    type: {
        type: import("vue").PropType<FloatButtonType>;
        default: FloatButtonType;
    };
    shape: {
        type: import("vue").PropType<FloatButtonShape>;
        default: FloatButtonShape;
    };
    tooltip: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    target: StringConstructor;
    badge: {
        type: import("vue").PropType<FloatButtonBadgeProps>;
        default: FloatButtonBadgeProps;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
};
export type FloatButtonProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonProps>>>;
export declare const floatButtonContentProps: () => {
    prefixCls: {
        type: import("vue").PropType<string>;
        default: string;
    };
};
export type FloatButtonContentProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonContentProps>>>;
export declare const floatButtonGroupProps: () => {
    trigger: {
        type: import("vue").PropType<FloatButtonGroupTrigger>;
        default: FloatButtonGroupTrigger;
    };
    open: {
        type: BooleanConstructor;
        default: boolean;
    };
    onOpenChange: {
        type: import("vue").PropType<(open: boolean) => void>;
        default: (open: boolean) => void;
    };
    'onUpdate:open': {
        type: import("vue").PropType<(open: boolean) => void>;
        default: (open: boolean) => void;
    };
    prefixCls: StringConstructor;
    description: import("vue-types").VueTypeValidableDef<any>;
    type: {
        type: import("vue").PropType<FloatButtonType>;
        default: FloatButtonType;
    };
    shape: {
        type: import("vue").PropType<FloatButtonShape>;
        default: FloatButtonShape;
    };
    tooltip: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    target: StringConstructor;
    badge: {
        type: import("vue").PropType<FloatButtonBadgeProps>;
        default: FloatButtonBadgeProps;
    };
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
};
export type FloatButtonGroupProps = Partial<ExtractPropTypes<ReturnType<typeof floatButtonGroupProps>>>;
export declare const backTopProps: () => {
    prefixCls: StringConstructor;
    duration: NumberConstructor;
    target: {
        type: import("vue").PropType<() => HTMLElement | Window | Document>;
        default: () => HTMLElement | Window | Document;
    };
    visibilityHeight: NumberConstructor;
    onClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    description: import("vue-types").VueTypeValidableDef<any>;
    type: {
        type: import("vue").PropType<FloatButtonType>;
        default: FloatButtonType;
    };
    shape: {
        type: import("vue").PropType<FloatButtonShape>;
        default: FloatButtonShape;
    };
    tooltip: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    badge: {
        type: import("vue").PropType<FloatButtonBadgeProps>;
        default: FloatButtonBadgeProps;
    };
};
export type BackTopProps = Partial<ExtractPropTypes<ReturnType<typeof backTopProps>>>;
