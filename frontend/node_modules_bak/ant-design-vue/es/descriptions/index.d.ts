import type { Ref, PropType, VNode, HTMLAttributes, ExtractPropTypes, Plugin, CSSProperties, InjectionKey } from 'vue';
import type { Breakpoint } from '../_util/responsiveObserve';
import type { CustomSlotsType } from '../_util/type';
export declare const DescriptionsItemProps: {
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    span: NumberConstructor;
};
declare const descriptionsItemProp: () => {
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    labelStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    span: {
        type: NumberConstructor;
        default: number;
    };
};
export type DescriptionsItemProp = Partial<ExtractPropTypes<ReturnType<typeof descriptionsItemProp>>>;
export declare const DescriptionsItem: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    labelStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    span: {
        type: NumberConstructor;
        default: number;
    };
}>, () => VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    labelStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    span: {
        type: NumberConstructor;
        default: number;
    };
}>> & Readonly<{}>, {
    span: number;
    labelStyle: CSSProperties;
    contentStyle: CSSProperties;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export declare const descriptionsProps: () => {
    prefixCls: StringConstructor;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    size: {
        type: PropType<"default" | "small" | "middle">;
        default: string;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    column: {
        type: PropType<number | Partial<Record<Breakpoint, number>>>;
        default: () => number | Partial<Record<Breakpoint, number>>;
    };
    layout: PropType<"vertical" | "horizontal">;
    colon: {
        type: BooleanConstructor;
        default: any;
    };
    labelStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
};
export type DescriptionsProps = HTMLAttributes & Partial<ExtractPropTypes<ReturnType<typeof descriptionsProps>>>;
export interface DescriptionsContextProp {
    labelStyle?: Ref<CSSProperties>;
    contentStyle?: Ref<CSSProperties>;
}
export declare const descriptionsContext: InjectionKey<DescriptionsContextProp>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        bordered: {
            type: BooleanConstructor;
            default: any;
        };
        size: {
            type: PropType<"default" | "small" | "middle">;
            default: string;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        column: {
            type: PropType<number | Partial<Record<Breakpoint, number>>>;
            default: () => number | Partial<Record<Breakpoint, number>>;
        };
        layout: PropType<"vertical" | "horizontal">;
        colon: {
            type: BooleanConstructor;
            default: any;
        };
        labelStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        contentStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: "default" | "small" | "middle";
        column: number | Partial<Record<Breakpoint, number>>;
        bordered: boolean;
        colon: boolean;
        labelStyle: CSSProperties;
        contentStyle: CSSProperties;
    }, true, {}, CustomSlotsType<{
        title?: any;
        extra?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        bordered: {
            type: BooleanConstructor;
            default: any;
        };
        size: {
            type: PropType<"default" | "small" | "middle">;
            default: string;
        };
        title: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        column: {
            type: PropType<number | Partial<Record<Breakpoint, number>>>;
            default: () => number | Partial<Record<Breakpoint, number>>;
        };
        layout: PropType<"vertical" | "horizontal">;
        colon: {
            type: BooleanConstructor;
            default: any;
        };
        labelStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        contentStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: "default" | "small" | "middle";
        column: number | Partial<Record<Breakpoint, number>>;
        bordered: boolean;
        colon: boolean;
        labelStyle: CSSProperties;
        contentStyle: CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    size: {
        type: PropType<"default" | "small" | "middle">;
        default: string;
    };
    title: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    column: {
        type: PropType<number | Partial<Record<Breakpoint, number>>>;
        default: () => number | Partial<Record<Breakpoint, number>>;
    };
    layout: PropType<"vertical" | "horizontal">;
    colon: {
        type: BooleanConstructor;
        default: any;
    };
    labelStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    contentStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: "default" | "small" | "middle";
    column: number | Partial<Record<Breakpoint, number>>;
    bordered: boolean;
    colon: boolean;
    labelStyle: CSSProperties;
    contentStyle: CSSProperties;
}, {}, string, CustomSlotsType<{
    title?: any;
    extra?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Item: typeof DescriptionsItem;
};
export default _default;
