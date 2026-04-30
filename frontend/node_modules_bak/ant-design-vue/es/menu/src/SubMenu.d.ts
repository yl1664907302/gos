import type { PropType, ExtractPropTypes } from 'vue';
import type { MouseEventHandler } from '../../_util/EventInterface';
import type { Key, CustomSlotsType } from '../../_util/type';
import type { ItemType, MenuTheme } from './interface';
export declare const subMenuProps: () => {
    icon: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    disabled: BooleanConstructor;
    level: NumberConstructor;
    popupClassName: StringConstructor;
    popupOffset: PropType<[number, number]>;
    internalPopupClose: BooleanConstructor;
    eventKey: StringConstructor;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    theme: PropType<MenuTheme>;
    onMouseenter: PropType<MouseEventHandler>;
    onMouseleave: PropType<MouseEventHandler>;
    onTitleClick: PropType<(e: MouseEvent, key: Key) => void>;
    originItemValue: {
        type: PropType<ItemType>;
        default: ItemType;
    };
};
export type SubMenuProps = Partial<ExtractPropTypes<ReturnType<typeof subMenuProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    icon: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    disabled: BooleanConstructor;
    level: NumberConstructor;
    popupClassName: StringConstructor;
    popupOffset: PropType<[number, number]>;
    internalPopupClose: BooleanConstructor;
    eventKey: StringConstructor;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    theme: PropType<MenuTheme>;
    onMouseenter: PropType<MouseEventHandler>;
    onMouseleave: PropType<MouseEventHandler>;
    onTitleClick: PropType<(e: MouseEvent, key: Key) => void>;
    originItemValue: {
        type: PropType<ItemType>;
        default: ItemType;
    };
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    icon: import("vue-types").VueTypeValidableDef<any>;
    title: import("vue-types").VueTypeValidableDef<any>;
    disabled: BooleanConstructor;
    level: NumberConstructor;
    popupClassName: StringConstructor;
    popupOffset: PropType<[number, number]>;
    internalPopupClose: BooleanConstructor;
    eventKey: StringConstructor;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    theme: PropType<MenuTheme>;
    onMouseenter: PropType<MouseEventHandler>;
    onMouseleave: PropType<MouseEventHandler>;
    onTitleClick: PropType<(e: MouseEvent, key: Key) => void>;
    originItemValue: {
        type: PropType<ItemType>;
        default: ItemType;
    };
}>> & Readonly<{}>, {
    disabled: boolean;
    originItemValue: ItemType;
    internalPopupClose: boolean;
}, CustomSlotsType<{
    icon?: any;
    title?: any;
    expandIcon?: {
        [key: string]: any;
        isOpen: boolean;
    };
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
