declare const BackTop: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    duration: NumberConstructor;
    target: {
        type: import("vue").PropType<() => Window | Document | HTMLElement>;
        default: () => Window | Document | HTMLElement;
    };
    visibilityHeight: NumberConstructor;
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    description: import("vue-types").VueTypeValidableDef<any>;
    type: {
        type: import("vue").PropType<import("./interface").FloatButtonType>;
        default: import("./interface").FloatButtonType;
    };
    shape: {
        type: import("vue").PropType<import("./interface").FloatButtonShape>;
        default: import("./interface").FloatButtonShape;
    };
    tooltip: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    badge: {
        type: import("vue").PropType<import("./interface").FloatButtonBadgeProps>;
        default: import("./interface").FloatButtonBadgeProps;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    duration: NumberConstructor;
    target: {
        type: import("vue").PropType<() => Window | Document | HTMLElement>;
        default: () => Window | Document | HTMLElement;
    };
    visibilityHeight: NumberConstructor;
    onClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    description: import("vue-types").VueTypeValidableDef<any>;
    type: {
        type: import("vue").PropType<import("./interface").FloatButtonType>;
        default: import("./interface").FloatButtonType;
    };
    shape: {
        type: import("vue").PropType<import("./interface").FloatButtonShape>;
        default: import("./interface").FloatButtonShape;
    };
    tooltip: import("vue-types").VueTypeValidableDef<any>;
    href: StringConstructor;
    badge: {
        type: import("vue").PropType<import("./interface").FloatButtonBadgeProps>;
        default: import("./interface").FloatButtonBadgeProps;
    };
}>> & Readonly<{}>, {
    type: import("./interface").FloatButtonType;
    onClick: import("../_util/EventInterface").MouseEventHandler;
    target: () => Window | Document | HTMLElement;
    shape: import("./interface").FloatButtonShape;
    badge: import("./interface").FloatButtonBadgeProps;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default BackTop;
