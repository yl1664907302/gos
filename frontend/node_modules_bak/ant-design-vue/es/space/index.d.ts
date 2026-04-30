import type { PropType, ExtractPropTypes, Plugin } from 'vue';
import type { SizeType } from '../config-provider';
import type { CustomSlotsType } from '../_util/type';
import Compact from './Compact';
export type SpaceSize = SizeType | number;
export declare const spaceProps: () => {
    prefixCls: StringConstructor;
    size: {
        type: PropType<SpaceSize | [SpaceSize, SpaceSize]>;
    };
    direction: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    align: import("vue-types").VueTypeDef<string>;
    wrap: {
        type: BooleanConstructor;
        default: boolean;
    };
};
export type SpaceProps = Partial<ExtractPropTypes<ReturnType<typeof spaceProps>>>;
export { Compact };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        prefixCls: StringConstructor;
        size: {
            type: PropType<SpaceSize | [SpaceSize, SpaceSize]>;
        };
        direction: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        align: import("vue-types").VueTypeDef<string>;
        wrap: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        direction: string;
        wrap: boolean;
    }, true, {}, CustomSlotsType<{
        split?: any;
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
        size: {
            type: PropType<SpaceSize | [SpaceSize, SpaceSize]>;
        };
        direction: import("vue-types").VueTypeDef<string> & {
            default: string;
        };
        align: import("vue-types").VueTypeDef<string>;
        wrap: {
            type: BooleanConstructor;
            default: boolean;
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        direction: string;
        wrap: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    size: {
        type: PropType<SpaceSize | [SpaceSize, SpaceSize]>;
    };
    direction: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    align: import("vue-types").VueTypeDef<string>;
    wrap: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    direction: string;
    wrap: boolean;
}, {}, string, CustomSlotsType<{
    split?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Compact: typeof Compact;
};
export default _default;
