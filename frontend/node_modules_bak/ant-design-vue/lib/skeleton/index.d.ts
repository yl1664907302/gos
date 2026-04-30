import type { Plugin } from 'vue';
import SkeletonButton from './Button';
import SkeletonInput from './Input';
import SkeletonImage from './Image';
import SkeletonAvatar from './Avatar';
import SkeletonTitle from './Title';
export type { SkeletonButtonProps } from './Button';
export type { SkeletonInputProps } from './Input';
export type { SkeletonImageProps } from './Image';
export type { SkeletonAvatarProps } from './Avatar';
export type { SkeletonTitleProps } from './Title';
export type { SkeletonProps } from './Skeleton';
export { skeletonProps } from './Skeleton';
export { SkeletonButton, SkeletonAvatar, SkeletonInput, SkeletonImage, SkeletonTitle };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        active: {
            type: BooleanConstructor;
            default: any;
        };
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        avatar: {
            type: import("vue").PropType<boolean | {
                size?: number | "default" | "small" | "large";
                prefixCls?: string;
                shape?: "circle" | "square";
            }>;
            default: boolean | {
                size?: number | "default" | "small" | "large";
                prefixCls?: string;
                shape?: "circle" | "square";
            };
        };
        title: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<string | number>;
                };
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<string | number>;
                };
            }>>;
        };
        paragraph: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<(string | number) | (string | number)[]>;
                };
                rows: NumberConstructor;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<(string | number) | (string | number)[]>;
                };
                rows: NumberConstructor;
            }>>;
        };
        round: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        title: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<string | number>;
            };
        }>>;
        round: boolean;
        active: boolean;
        loading: boolean;
        avatar: boolean | {
            size?: number | "default" | "small" | "large";
            prefixCls?: string;
            shape?: "circle" | "square";
        };
        paragraph: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<(string | number) | (string | number)[]>;
            };
            rows: NumberConstructor;
        }>>;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        active: {
            type: BooleanConstructor;
            default: any;
        };
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        avatar: {
            type: import("vue").PropType<boolean | {
                size?: number | "default" | "small" | "large";
                prefixCls?: string;
                shape?: "circle" | "square";
            }>;
            default: boolean | {
                size?: number | "default" | "small" | "large";
                prefixCls?: string;
                shape?: "circle" | "square";
            };
        };
        title: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<string | number>;
                };
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<string | number>;
                };
            }>>;
        };
        paragraph: {
            type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<(string | number) | (string | number)[]>;
                };
                rows: NumberConstructor;
            }>>>;
            default: boolean | Partial<import("vue").ExtractPropTypes<{
                prefixCls: StringConstructor;
                width: {
                    type: import("vue").PropType<(string | number) | (string | number)[]>;
                };
                rows: NumberConstructor;
            }>>;
        };
        round: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        title: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<string | number>;
            };
        }>>;
        round: boolean;
        active: boolean;
        loading: boolean;
        avatar: boolean | {
            size?: number | "default" | "small" | "large";
            prefixCls?: string;
            shape?: "circle" | "square";
        };
        paragraph: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<(string | number) | (string | number)[]>;
            };
            rows: NumberConstructor;
        }>>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    active: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    avatar: {
        type: import("vue").PropType<boolean | {
            size?: number | "default" | "small" | "large";
            prefixCls?: string;
            shape?: "circle" | "square";
        }>;
        default: boolean | {
            size?: number | "default" | "small" | "large";
            prefixCls?: string;
            shape?: "circle" | "square";
        };
    };
    title: {
        type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<string | number>;
            };
        }>>>;
        default: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<string | number>;
            };
        }>>;
    };
    paragraph: {
        type: import("vue").PropType<boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<(string | number) | (string | number)[]>;
            };
            rows: NumberConstructor;
        }>>>;
        default: boolean | Partial<import("vue").ExtractPropTypes<{
            prefixCls: StringConstructor;
            width: {
                type: import("vue").PropType<(string | number) | (string | number)[]>;
            };
            rows: NumberConstructor;
        }>>;
    };
    round: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    title: boolean | Partial<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        width: {
            type: import("vue").PropType<string | number>;
        };
    }>>;
    round: boolean;
    active: boolean;
    loading: boolean;
    avatar: boolean | {
        size?: number | "default" | "small" | "large";
        prefixCls?: string;
        shape?: "circle" | "square";
    };
    paragraph: boolean | Partial<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        width: {
            type: import("vue").PropType<(string | number) | (string | number)[]>;
        };
        rows: NumberConstructor;
    }>>;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Button: typeof SkeletonButton;
    readonly Avatar: typeof SkeletonAvatar;
    readonly Input: typeof SkeletonInput;
    readonly Image: typeof SkeletonImage;
};
export default _default;
