import type { HTMLAttributes, PropType, ExtractPropTypes, Plugin } from 'vue';
import type { PresetColorType } from '../_util/colors';
import type { CustomSlotsType, LiteralUnion } from '../_util/type';
import CheckableTag from './CheckableTag';
export declare const tagProps: () => {
    prefixCls: StringConstructor;
    color: {
        type: PropType<LiteralUnion<"error" | "default" | "success" | "processing" | "warning" | PresetColorType>>;
    };
    closable: {
        type: BooleanConstructor;
        default: boolean;
    };
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated `visible` will be removed in next major version. */
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: {
        type: PropType<(e: MouseEvent) => void>;
    };
    onClick: {
        type: PropType<((e: MouseEvent) => void) | ((e: MouseEvent) => void)[]>;
    };
    'onUpdate:visible': PropType<(vis: boolean) => void>;
    icon: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type TagProps = HTMLAttributes & Partial<ExtractPropTypes<ReturnType<typeof tagProps>>>;
export { CheckableTag };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        color: {
            type: PropType<LiteralUnion<"error" | "default" | "success" | "processing" | "warning" | PresetColorType>>;
        };
        closable: {
            type: BooleanConstructor;
            default: boolean;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated `visible` will be removed in next major version. */
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        onClose: {
            type: PropType<(e: MouseEvent) => void>;
        };
        onClick: {
            type: PropType<((e: MouseEvent) => void) | ((e: MouseEvent) => void)[]>;
        };
        'onUpdate:visible': PropType<(vis: boolean) => void>;
        icon: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        visible: boolean;
        bordered: boolean;
        closable: boolean;
    }, true, {}, CustomSlotsType<{
        closeIcon: any;
        icon: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        color: {
            type: PropType<LiteralUnion<"error" | "default" | "success" | "processing" | "warning" | PresetColorType>>;
        };
        closable: {
            type: BooleanConstructor;
            default: boolean;
        };
        closeIcon: import("vue-types").VueTypeValidableDef<any>;
        /** @deprecated `visible` will be removed in next major version. */
        visible: {
            type: BooleanConstructor;
            default: any;
        };
        onClose: {
            type: PropType<(e: MouseEvent) => void>;
        };
        onClick: {
            type: PropType<((e: MouseEvent) => void) | ((e: MouseEvent) => void)[]>;
        };
        'onUpdate:visible': PropType<(vis: boolean) => void>;
        icon: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        visible: boolean;
        bordered: boolean;
        closable: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    color: {
        type: PropType<LiteralUnion<"error" | "default" | "success" | "processing" | "warning" | PresetColorType>>;
    };
    closable: {
        type: BooleanConstructor;
        default: boolean;
    };
    closeIcon: import("vue-types").VueTypeValidableDef<any>;
    /** @deprecated `visible` will be removed in next major version. */
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    onClose: {
        type: PropType<(e: MouseEvent) => void>;
    };
    onClick: {
        type: PropType<((e: MouseEvent) => void) | ((e: MouseEvent) => void)[]>;
    };
    'onUpdate:visible': PropType<(vis: boolean) => void>;
    icon: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    visible: boolean;
    bordered: boolean;
    closable: boolean;
}, {}, string, CustomSlotsType<{
    closeIcon: any;
    icon: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly CheckableTag: typeof CheckableTag;
};
export default _default;
