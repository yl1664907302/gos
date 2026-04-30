import type { ExtractPropTypes } from 'vue';
import type { ItemType } from './interface';
import type { CustomSlotsType } from '../../_util/type';
export declare const menuItemGroupProps: () => {
    title: import("vue-types").VueTypeValidableDef<any>;
    originItemValue: {
        type: import("vue").PropType<ItemType>;
        default: ItemType;
    };
};
export type MenuItemGroupProps = Partial<ExtractPropTypes<ReturnType<typeof menuItemGroupProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    title: import("vue-types").VueTypeValidableDef<any>;
    originItemValue: {
        type: import("vue").PropType<ItemType>;
        default: ItemType;
    };
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    title: import("vue-types").VueTypeValidableDef<any>;
    originItemValue: {
        type: import("vue").PropType<ItemType>;
        default: ItemType;
    };
}>> & Readonly<{}>, {
    originItemValue: ItemType;
}, CustomSlotsType<{
    title?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
