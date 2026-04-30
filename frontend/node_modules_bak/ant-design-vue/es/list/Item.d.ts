import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { ListGridType } from '.';
import type { CustomSlotsType } from '../_util/type';
export declare const listItemProps: () => {
    prefixCls: StringConstructor;
    extra: import("vue-types").VueTypeValidableDef<any>;
    actions: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    grid: PropType<ListGridType>;
    colStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
};
export type ListItemProps = Partial<ExtractPropTypes<ReturnType<typeof listItemProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    extra: import("vue-types").VueTypeValidableDef<any>;
    actions: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    grid: PropType<ListGridType>;
    colStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    extra: import("vue-types").VueTypeValidableDef<any>;
    actions: import("vue-types").VueTypeValidableDef<unknown[]> & {
        default: () => unknown[];
    };
    grid: PropType<ListGridType>;
    colStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
}>> & Readonly<{}>, {
    actions: unknown[];
    colStyle: CSSProperties;
}, CustomSlotsType<{
    actions: any;
    extra: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
