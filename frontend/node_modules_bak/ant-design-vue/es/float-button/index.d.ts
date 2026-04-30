import type { Plugin } from 'vue';
import FloatButtonGroup from './FloatButtonGroup';
import BackTop from './BackTop';
import type { FloatButtonProps, FloatButtonShape, FloatButtonType, FloatButtonGroupProps, BackTopProps } from './interface';
import type { SizeType as FloatButtonSize } from '../config-provider';
export type { FloatButtonProps, FloatButtonShape, FloatButtonType, FloatButtonGroupProps, BackTopProps, FloatButtonSize, };
export { FloatButtonGroup, BackTop };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("./interface").FloatButtonBadgeProps>;
            default: import("./interface").FloatButtonBadgeProps;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        type: FloatButtonType;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        shape: FloatButtonShape;
        badge: import("./interface").FloatButtonBadgeProps;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<import("./interface").FloatButtonBadgeProps>;
            default: import("./interface").FloatButtonBadgeProps;
        };
        onClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        type: FloatButtonType;
        onClick: import("../_util/EventInterface").MouseEventHandler;
        shape: FloatButtonShape;
        badge: import("./interface").FloatButtonBadgeProps;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<import("./interface").FloatButtonBadgeProps>;
        default: import("./interface").FloatButtonBadgeProps;
    };
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    type: FloatButtonType;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    shape: FloatButtonShape;
    badge: import("./interface").FloatButtonBadgeProps;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Group: typeof FloatButtonGroup;
    readonly BackTop: typeof BackTop;
};
export default _default;
