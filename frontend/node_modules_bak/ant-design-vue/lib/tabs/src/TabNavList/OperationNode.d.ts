import type { Tab, TabsLocale, EditableConfig } from '../interface';
import type { CustomSlotsType, Key } from '../../../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
export declare const operationNodeProps: {
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    tabs: {
        type: PropType<(Tab & {
            closeIcon?: () => any;
        })[]>;
    };
    rtl: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    mobile: {
        type: BooleanConstructor;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    editable: {
        type: PropType<EditableConfig>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    removeAriaLabel: StringConstructor;
    onTabClick: {
        type: PropType<(key: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement | undefined) => HTMLElement>;
        default: (triggerNode?: HTMLElement | undefined) => HTMLElement;
    };
};
export type OperationNodeProps = Partial<ExtractPropTypes<typeof operationNodeProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    tabs: {
        type: PropType<(Tab & {
            closeIcon?: () => any;
        })[]>;
    };
    rtl: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    mobile: {
        type: BooleanConstructor;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    editable: {
        type: PropType<EditableConfig>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    removeAriaLabel: StringConstructor;
    onTabClick: {
        type: PropType<(key: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "tabClick"[], "tabClick", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    tabs: {
        type: PropType<(Tab & {
            closeIcon?: () => any;
        })[]>;
    };
    rtl: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    mobile: {
        type: BooleanConstructor;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    editable: {
        type: PropType<EditableConfig>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    removeAriaLabel: StringConstructor;
    onTabClick: {
        type: PropType<(key: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
}>> & Readonly<{
    onTabClick?: (...args: any[]) => any;
}>, {
    rtl: boolean;
    getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
    locale: TabsLocale;
    mobile: boolean;
}, CustomSlotsType<{
    moreIcon?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
