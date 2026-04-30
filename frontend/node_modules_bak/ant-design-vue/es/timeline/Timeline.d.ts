import type { ExtractPropTypes } from 'vue';
import type { CustomSlotsType } from '../_util/type';
export declare const timelineProps: () => {
    prefixCls: StringConstructor;
    /** 指定最后一个幽灵节点是否存在或内容 */
    pending: import("vue-types").VueTypeValidableDef<any>;
    pendingDot: import("vue-types").VueTypeValidableDef<any>;
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: import("vue-types").VueTypeDef<string>;
};
export type TimelineProps = Partial<ExtractPropTypes<ReturnType<typeof timelineProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    /** 指定最后一个幽灵节点是否存在或内容 */
    pending: import("vue-types").VueTypeValidableDef<any>;
    pendingDot: import("vue-types").VueTypeValidableDef<any>;
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: import("vue-types").VueTypeDef<string>;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    /** 指定最后一个幽灵节点是否存在或内容 */
    pending: import("vue-types").VueTypeValidableDef<any>;
    pendingDot: import("vue-types").VueTypeValidableDef<any>;
    reverse: {
        type: BooleanConstructor;
        default: boolean;
    };
    mode: import("vue-types").VueTypeDef<string>;
}>> & Readonly<{}>, {
    reverse: boolean;
}, CustomSlotsType<{
    pending?: any;
    pendingDot?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
