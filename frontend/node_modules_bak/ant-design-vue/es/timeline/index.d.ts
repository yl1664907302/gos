import type { Plugin } from 'vue';
import { timelineProps } from './Timeline';
import TimelineItem, { timelineItemProps } from './TimelineItem';
export type { TimelineProps } from './Timeline';
export type { TimelineItemProps } from './TimelineItem';
export { TimelineItem, timelineProps, timelineItemProps };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        pending: import("vue-types").VueTypeValidableDef<any>;
        pendingDot: import("vue-types").VueTypeValidableDef<any>;
        reverse: {
            type: BooleanConstructor;
            default: boolean;
        };
        mode: import("vue-types").VueTypeDef<string>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        reverse: boolean;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        pending?: any;
        pendingDot?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        prefixCls: StringConstructor;
        pending: import("vue-types").VueTypeValidableDef<any>;
        pendingDot: import("vue-types").VueTypeValidableDef<any>;
        reverse: {
            type: BooleanConstructor;
            default: boolean;
        };
        mode: import("vue-types").VueTypeDef<string>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        reverse: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    pending: import("vue-types").VueTypeValidableDef<any>;
    pendingDot: import("vue-types").VueTypeValidableDef<any>;
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: import("vue-types").VueTypeDef<string>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    reverse: boolean;
}, {}, string, import("../_util/type").CustomSlotsType<{
    pending?: any;
    pendingDot?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Item: typeof TimelineItem;
};
export default _default;
