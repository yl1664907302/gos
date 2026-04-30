import type { Plugin } from 'vue';
import { setDefaultIndicator } from './Spin';
export type { SpinProps } from './Spin';
export { spinProps } from './Spin';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        spinning: {
            type: BooleanConstructor;
            default: any;
        };
        size: import("vue").PropType<import("./Spin").SpinSize>;
        wrapperClassName: StringConstructor;
        tip: import("vue-types").VueTypeValidableDef<any>;
        delay: NumberConstructor;
        indicator: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        spinning: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        spinning: {
            type: BooleanConstructor;
            default: any;
        };
        size: import("vue").PropType<import("./Spin").SpinSize>;
        wrapperClassName: StringConstructor;
        tip: import("vue-types").VueTypeValidableDef<any>;
        delay: NumberConstructor;
        indicator: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        spinning: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    spinning: {
        type: BooleanConstructor;
        default: any;
    };
    size: import("vue").PropType<import("./Spin").SpinSize>;
    wrapperClassName: StringConstructor;
    tip: import("vue-types").VueTypeValidableDef<any>;
    delay: NumberConstructor;
    indicator: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    spinning: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly setDefaultIndicator: typeof setDefaultIndicator;
};
export default _default;
