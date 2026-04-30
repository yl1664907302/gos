import type { ExtractPropTypes, PropType } from 'vue';
import type { CustomSlotsType } from '../_util/type';
import type { MouseEventHandler } from '../_util/EventInterface';
export declare const pageHeaderProps: () => {
    backIcon: {
        type: PropType<import("../_util/type").VueNode>;
    };
    prefixCls: StringConstructor;
    title: {
        type: PropType<import("../_util/type").VueNode>;
    };
    subTitle: {
        type: PropType<import("../_util/type").VueNode>;
    };
    breadcrumb: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    tags: {
        type: PropType<import("../_util/type").VueNode>;
    };
    footer: {
        type: PropType<import("../_util/type").VueNode>;
    };
    extra: {
        type: PropType<import("../_util/type").VueNode>;
    };
    avatar: {
        type: PropType<Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>>;
        default: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>;
    };
    ghost: {
        type: BooleanConstructor;
        default: any;
    };
    onBack: PropType<MouseEventHandler>;
};
export type PageHeaderProps = Partial<ExtractPropTypes<ReturnType<typeof pageHeaderProps>>>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        backIcon: {
            type: PropType<import("../_util/type").VueNode>;
        };
        prefixCls: StringConstructor;
        title: {
            type: PropType<import("../_util/type").VueNode>;
        };
        subTitle: {
            type: PropType<import("../_util/type").VueNode>;
        };
        breadcrumb: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        tags: {
            type: PropType<import("../_util/type").VueNode>;
        };
        footer: {
            type: PropType<import("../_util/type").VueNode>;
        };
        extra: {
            type: PropType<import("../_util/type").VueNode>;
        };
        avatar: {
            type: PropType<Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                shape: {
                    type: PropType<"circle" | "square">;
                    default: string;
                };
                size: {
                    type: PropType<import("../avatar").AvatarSize>;
                    default: () => import("../avatar").AvatarSize;
                };
                src: StringConstructor;
                srcset: StringConstructor;
                icon: import("vue-types").VueTypeValidableDef<any>;
                alt: StringConstructor;
                gap: NumberConstructor;
                draggable: {
                    type: BooleanConstructor;
                    default: any;
                };
                crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
                loadError: {
                    type: PropType<() => boolean>;
                };
            }>>>;
            default: Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                shape: {
                    type: PropType<"circle" | "square">;
                    default: string;
                };
                size: {
                    type: PropType<import("../avatar").AvatarSize>;
                    default: () => import("../avatar").AvatarSize;
                };
                src: StringConstructor;
                srcset: StringConstructor;
                icon: import("vue-types").VueTypeValidableDef<any>;
                alt: StringConstructor;
                gap: NumberConstructor;
                draggable: {
                    type: BooleanConstructor;
                    default: any;
                };
                crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
                loadError: {
                    type: PropType<() => boolean>;
                };
            }>>;
        };
        ghost: {
            type: BooleanConstructor;
            default: any;
        };
        onBack: PropType<MouseEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        ghost: boolean;
        avatar: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>;
        breadcrumb: {
            [key: string]: any;
        };
    }, true, {}, CustomSlotsType<{
        backIcon: any;
        avatar: any;
        breadcrumb: any;
        title: any;
        subTitle: any;
        tags: any;
        extra: any;
        footer: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        backIcon: {
            type: PropType<import("../_util/type").VueNode>;
        };
        prefixCls: StringConstructor;
        title: {
            type: PropType<import("../_util/type").VueNode>;
        };
        subTitle: {
            type: PropType<import("../_util/type").VueNode>;
        };
        breadcrumb: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        tags: {
            type: PropType<import("../_util/type").VueNode>;
        };
        footer: {
            type: PropType<import("../_util/type").VueNode>;
        };
        extra: {
            type: PropType<import("../_util/type").VueNode>;
        };
        avatar: {
            type: PropType<Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                shape: {
                    type: PropType<"circle" | "square">;
                    default: string;
                };
                size: {
                    type: PropType<import("../avatar").AvatarSize>;
                    default: () => import("../avatar").AvatarSize;
                };
                src: StringConstructor;
                srcset: StringConstructor;
                icon: import("vue-types").VueTypeValidableDef<any>;
                alt: StringConstructor;
                gap: NumberConstructor;
                draggable: {
                    type: BooleanConstructor;
                    default: any;
                };
                crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
                loadError: {
                    type: PropType<() => boolean>;
                };
            }>>>;
            default: Partial<ExtractPropTypes<{
                prefixCls: StringConstructor;
                shape: {
                    type: PropType<"circle" | "square">;
                    default: string;
                };
                size: {
                    type: PropType<import("../avatar").AvatarSize>;
                    default: () => import("../avatar").AvatarSize;
                };
                src: StringConstructor;
                srcset: StringConstructor;
                icon: import("vue-types").VueTypeValidableDef<any>;
                alt: StringConstructor;
                gap: NumberConstructor;
                draggable: {
                    type: BooleanConstructor;
                    default: any;
                };
                crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
                loadError: {
                    type: PropType<() => boolean>;
                };
            }>>;
        };
        ghost: {
            type: BooleanConstructor;
            default: any;
        };
        onBack: PropType<MouseEventHandler>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        ghost: boolean;
        avatar: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>;
        breadcrumb: {
            [key: string]: any;
        };
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    backIcon: {
        type: PropType<import("../_util/type").VueNode>;
    };
    prefixCls: StringConstructor;
    title: {
        type: PropType<import("../_util/type").VueNode>;
    };
    subTitle: {
        type: PropType<import("../_util/type").VueNode>;
    };
    breadcrumb: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    tags: {
        type: PropType<import("../_util/type").VueNode>;
    };
    footer: {
        type: PropType<import("../_util/type").VueNode>;
    };
    extra: {
        type: PropType<import("../_util/type").VueNode>;
    };
    avatar: {
        type: PropType<Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>>;
        default: Partial<ExtractPropTypes<{
            prefixCls: StringConstructor;
            shape: {
                type: PropType<"circle" | "square">;
                default: string;
            };
            size: {
                type: PropType<import("../avatar").AvatarSize>;
                default: () => import("../avatar").AvatarSize;
            };
            src: StringConstructor;
            srcset: StringConstructor;
            icon: import("vue-types").VueTypeValidableDef<any>;
            alt: StringConstructor;
            gap: NumberConstructor;
            draggable: {
                type: BooleanConstructor;
                default: any;
            };
            crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
            loadError: {
                type: PropType<() => boolean>;
            };
        }>>;
    };
    ghost: {
        type: BooleanConstructor;
        default: any;
    };
    onBack: PropType<MouseEventHandler>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    ghost: boolean;
    avatar: Partial<ExtractPropTypes<{
        prefixCls: StringConstructor;
        shape: {
            type: PropType<"circle" | "square">;
            default: string;
        };
        size: {
            type: PropType<import("../avatar").AvatarSize>;
            default: () => import("../avatar").AvatarSize;
        };
        src: StringConstructor;
        srcset: StringConstructor;
        icon: import("vue-types").VueTypeValidableDef<any>;
        alt: StringConstructor;
        gap: NumberConstructor;
        draggable: {
            type: BooleanConstructor;
            default: any;
        };
        crossOrigin: PropType<"" | "anonymous" | "use-credentials">;
        loadError: {
            type: PropType<() => boolean>;
        };
    }>>;
    breadcrumb: {
        [key: string]: any;
    };
}, {}, string, CustomSlotsType<{
    backIcon: any;
    avatar: any;
    breadcrumb: any;
    title: any;
    subTitle: any;
    tags: any;
    extra: any;
    footer: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & import("vue").Plugin<any[]>;
export default _default;
