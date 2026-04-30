import type { AvatarSize } from './Avatar';
import type { PropType, ExtractPropTypes, CSSProperties } from 'vue';
export declare const groupProps: () => {
    prefixCls: StringConstructor;
    maxCount: NumberConstructor;
    maxStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maxPopoverPlacement: {
        type: PropType<"top" | "bottom">;
        default: string;
    };
    maxPopoverTrigger: PropType<"click" | "focus" | "hover">;
    size: {
        type: PropType<AvatarSize>;
        default: AvatarSize;
    };
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
};
export type AvatarGroupProps = Partial<ExtractPropTypes<ReturnType<typeof groupProps>>>;
declare const Group: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    maxCount: NumberConstructor;
    maxStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maxPopoverPlacement: {
        type: PropType<"top" | "bottom">;
        default: string;
    };
    maxPopoverTrigger: PropType<"click" | "focus" | "hover">;
    size: {
        type: PropType<AvatarSize>;
        default: AvatarSize;
    };
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    maxCount: NumberConstructor;
    maxStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    maxPopoverPlacement: {
        type: PropType<"top" | "bottom">;
        default: string;
    };
    maxPopoverTrigger: PropType<"click" | "focus" | "hover">;
    size: {
        type: PropType<AvatarSize>;
        default: AvatarSize;
    };
    shape: {
        type: PropType<"circle" | "square">;
        default: string;
    };
}>> & Readonly<{}>, {
    size: number | "default" | "small" | "large" | Partial<Record<import("../_util/responsiveObserve").Breakpoint, number>>;
    shape: "circle" | "square";
    maxStyle: CSSProperties;
    maxPopoverPlacement: "top" | "bottom";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Group;
