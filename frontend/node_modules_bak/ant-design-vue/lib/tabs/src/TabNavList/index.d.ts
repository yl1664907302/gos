import type { TabPosition, RenderTabBar, TabsLocale, EditableConfig, AnimatedConfig, OnTabScroll } from '../interface';
import type { CustomSlotsType, Key } from '../../../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
export declare const tabNavListProps: () => {
    id: {
        type: StringConstructor;
    };
    tabPosition: {
        type: PropType<TabPosition>;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    rtl: {
        type: BooleanConstructor;
    };
    animated: {
        type: PropType<AnimatedConfig>;
        default: AnimatedConfig;
    };
    editable: {
        type: PropType<EditableConfig>;
        default: EditableConfig;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    mobile: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    renderTabBar: {
        type: PropType<RenderTabBar>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement | undefined) => HTMLElement>;
        default: (triggerNode?: HTMLElement | undefined) => HTMLElement;
    };
    onTabClick: {
        type: PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    onTabScroll: {
        type: PropType<OnTabScroll>;
    };
};
export type TabNavListProps = Partial<ExtractPropTypes<ReturnType<typeof tabNavListProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    id: {
        type: StringConstructor;
    };
    tabPosition: {
        type: PropType<TabPosition>;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    rtl: {
        type: BooleanConstructor;
    };
    animated: {
        type: PropType<AnimatedConfig>;
        default: AnimatedConfig;
    };
    editable: {
        type: PropType<EditableConfig>;
        default: EditableConfig;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    mobile: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    renderTabBar: {
        type: PropType<RenderTabBar>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
    onTabClick: {
        type: PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    onTabScroll: {
        type: PropType<OnTabScroll>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("tabClick" | "tabScroll")[], "tabClick" | "tabScroll", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    id: {
        type: StringConstructor;
    };
    tabPosition: {
        type: PropType<TabPosition>;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    rtl: {
        type: BooleanConstructor;
    };
    animated: {
        type: PropType<AnimatedConfig>;
        default: AnimatedConfig;
    };
    editable: {
        type: PropType<EditableConfig>;
        default: EditableConfig;
    };
    moreIcon: import("vue-types").VueTypeValidableDef<any>;
    moreTransitionName: {
        type: StringConstructor;
    };
    mobile: {
        type: BooleanConstructor;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    renderTabBar: {
        type: PropType<RenderTabBar>;
    };
    locale: {
        type: PropType<TabsLocale>;
        default: TabsLocale;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
    onTabClick: {
        type: PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>;
    };
    onTabScroll: {
        type: PropType<OnTabScroll>;
    };
}>> & Readonly<{
    onTabClick?: (...args: any[]) => any;
    onTabScroll?: (...args: any[]) => any;
}>, {
    rtl: boolean;
    getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
    locale: TabsLocale;
    mobile: boolean;
    editable: EditableConfig;
    animated: AnimatedConfig;
}, CustomSlotsType<{
    moreIcon?: any;
    leftExtra?: any;
    rightExtra?: any;
    tabBarExtraContent?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
