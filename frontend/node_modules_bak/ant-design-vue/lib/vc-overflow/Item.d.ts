import type { PropType } from 'vue';
import type { Key, VueNode } from '../_util/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    item: import("vue-types").VueTypeValidableDef<any>;
    renderItem: PropType<(item: any) => VueNode>;
    responsive: BooleanConstructor;
    itemKey: {
        type: PropType<string | number>;
    };
    registerSize: PropType<(key: Key, width: number | null) => void>;
    display: BooleanConstructor;
    order: NumberConstructor;
    component: import("vue-types").VueTypeValidableDef<any>;
    invalidate: BooleanConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    item: import("vue-types").VueTypeValidableDef<any>;
    renderItem: PropType<(item: any) => VueNode>;
    responsive: BooleanConstructor;
    itemKey: {
        type: PropType<string | number>;
    };
    registerSize: PropType<(key: Key, width: number | null) => void>;
    display: BooleanConstructor;
    order: NumberConstructor;
    component: import("vue-types").VueTypeValidableDef<any>;
    invalidate: BooleanConstructor;
}>> & Readonly<{}>, {
    display: boolean;
    responsive: boolean;
    invalidate: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
