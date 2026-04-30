import type { Plugin } from 'vue';
import Group from './Group';
export { avatarProps } from './Avatar';
export type { AvatarProps, AvatarSize } from './Avatar';
export type { AvatarGroupProps } from './Group';
export { Group as AvatarGroup };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        shape: {
            type: import("vue").PropType<"circle" | "square">;
            default: string;
        };
        size: {
            type: import("vue").PropType<import("./Avatar").AvatarSize>;
            default: () => import("./Avatar").AvatarSize;
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
        crossOrigin: import("vue").PropType<"" | "anonymous" | "use-credentials">;
        loadError: {
            type: import("vue").PropType<() => boolean>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("./Avatar").AvatarSize;
        draggable: boolean;
        shape: "circle" | "square";
    }, true, {}, import("../_util/type").CustomSlotsType<{
        icon: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        shape: {
            type: import("vue").PropType<"circle" | "square">;
            default: string;
        };
        size: {
            type: import("vue").PropType<import("./Avatar").AvatarSize>;
            default: () => import("./Avatar").AvatarSize;
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
        crossOrigin: import("vue").PropType<"" | "anonymous" | "use-credentials">;
        loadError: {
            type: import("vue").PropType<() => boolean>;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: import("./Avatar").AvatarSize;
        draggable: boolean;
        shape: "circle" | "square";
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    shape: {
        type: import("vue").PropType<"circle" | "square">;
        default: string;
    };
    size: {
        type: import("vue").PropType<import("./Avatar").AvatarSize>;
        default: () => import("./Avatar").AvatarSize;
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
    crossOrigin: import("vue").PropType<"" | "anonymous" | "use-credentials">;
    loadError: {
        type: import("vue").PropType<() => boolean>;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("./Avatar").AvatarSize;
    draggable: boolean;
    shape: "circle" | "square";
}, {}, string, import("../_util/type").CustomSlotsType<{
    icon: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Group: typeof Group;
};
export default _default;
