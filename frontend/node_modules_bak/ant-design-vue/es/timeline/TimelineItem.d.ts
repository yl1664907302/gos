import type { ExtractPropTypes } from 'vue';
import type { CustomSlotsType } from '../_util/type';
export declare const timelineItemProps: () => {
    prefixCls: StringConstructor;
    color: StringConstructor;
    dot: import("vue-types").VueTypeValidableDef<any>;
    pending: {
        type: BooleanConstructor;
        default: boolean;
    };
    position: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    label: import("vue-types").VueTypeValidableDef<any>;
};
export type TimelineItemProps = Partial<ExtractPropTypes<ReturnType<typeof timelineItemProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    color: StringConstructor;
    dot: import("vue-types").VueTypeValidableDef<any>;
    pending: {
        type: BooleanConstructor;
        default: boolean;
    };
    position: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    label: import("vue-types").VueTypeValidableDef<any>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    color: StringConstructor;
    dot: import("vue-types").VueTypeValidableDef<any>;
    pending: {
        type: BooleanConstructor;
        default: boolean;
    };
    position: import("vue-types").VueTypeDef<string> & {
        default: string;
    };
    label: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, {
    position: string;
    pending: boolean;
}, CustomSlotsType<{
    dot?: any;
    label?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
