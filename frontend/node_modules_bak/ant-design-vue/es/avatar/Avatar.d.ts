import type { CustomSlotsType, VueNode } from '../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
import type { ScreenSizeMap } from '../_util/responsiveObserve';
export type AvatarSize = 'large' | 'small' | 'default' | number | ScreenSizeMap;
export declare const avatarProps: () => {
    prefixCls: StringConstructor;
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
    size: {
        type: PropType<AvatarSize>;
        default: () => AvatarSize;
    };
    src: StringConstructor;
    /** Srcset of image avatar */
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
};
export type AvatarProps = Partial<ExtractPropTypes<ReturnType<typeof avatarProps>>>;
declare const Avatar: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
    size: {
        type: PropType<AvatarSize>;
        default: () => AvatarSize;
    };
    src: StringConstructor;
    /** Srcset of image avatar */
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
}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
    size: {
        type: PropType<AvatarSize>;
        default: () => AvatarSize;
    };
    src: StringConstructor;
    /** Srcset of image avatar */
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
}>> & Readonly<{}>, {
    size: AvatarSize;
    draggable: boolean;
    shape: "circle" | "square";
}, CustomSlotsType<{
    icon: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Avatar;
