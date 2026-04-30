import type { TabPosition, RenderTabBar, TabsLocale, AnimatedConfig, OnTabScroll } from './interface';
import type { CSSProperties, ExtractPropTypes } from 'vue';
import type { SizeType } from '../../config-provider';
import type { CustomSlotsType, Key } from '../../_util/type';
import type { MouseEventHandler } from '../../_util/EventInterface';
export type TabsType = 'line' | 'card' | 'editable-card';
export type TabsPosition = 'top' | 'right' | 'bottom' | 'left';
export declare const tabsProps: () => {
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode?: HTMLElement | undefined) => HTMLElement>;
        default: (triggerNode?: HTMLElement | undefined) => HTMLElement;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    defaultActiveKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: "rtl" | "ltr";
    };
    animated: {
        type: import("vue").PropType<boolean | AnimatedConfig>;
        default: boolean | AnimatedConfig;
    };
    renderTabBar: {
        type: import("vue").PropType<RenderTabBar>;
        default: RenderTabBar;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    tabBarStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    tabPosition: {
        type: import("vue").PropType<TabPosition>;
        default: TabPosition;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideAdd: BooleanConstructor;
    type: {
        type: import("vue").PropType<TabsType>;
        default: TabsType;
    };
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    centered: BooleanConstructor;
    onEdit: {
        type: import("vue").PropType<(e: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => void>;
        default: (e: MouseEvent | KeyboardEvent | Key, action: 'add' | 'remove') => void;
    };
    onChange: {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    onTabClick: {
        type: import("vue").PropType<(activeKey: Key, e: KeyboardEvent | MouseEvent) => void>;
        default: (activeKey: Key, e: KeyboardEvent | MouseEvent) => void;
    };
    onTabScroll: {
        type: import("vue").PropType<OnTabScroll>;
        default: OnTabScroll;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    locale: {
        type: import("vue").PropType<TabsLocale>;
        default: TabsLocale;
    };
    onPrevClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onNextClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
};
export type TabsProps = Partial<ExtractPropTypes<ReturnType<typeof tabsProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    defaultActiveKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: "rtl" | "ltr";
    };
    animated: {
        type: import("vue").PropType<boolean | AnimatedConfig>;
        default: boolean | AnimatedConfig;
    };
    renderTabBar: {
        type: import("vue").PropType<RenderTabBar>;
        default: RenderTabBar;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    tabBarStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    tabPosition: {
        type: import("vue").PropType<TabPosition>;
        default: TabPosition;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideAdd: BooleanConstructor;
    type: {
        type: import("vue").PropType<TabsType>;
        default: TabsType;
    };
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    centered: BooleanConstructor;
    onEdit: {
        type: import("vue").PropType<(e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void>;
        default: (e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
    };
    onChange: {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    onTabClick: {
        type: import("vue").PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>;
        default: (activeKey: Key, e: MouseEvent | KeyboardEvent) => void;
    };
    onTabScroll: {
        type: import("vue").PropType<OnTabScroll>;
        default: OnTabScroll;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    locale: {
        type: import("vue").PropType<TabsLocale>;
        default: TabsLocale;
    };
    onPrevClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onNextClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: {
        type: StringConstructor;
    };
    id: {
        type: StringConstructor;
    };
    popupClassName: StringConstructor;
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        default: (triggerNode?: HTMLElement) => HTMLElement;
    };
    activeKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    defaultActiveKey: {
        type: (StringConstructor | NumberConstructor)[];
    };
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: "rtl" | "ltr";
    };
    animated: {
        type: import("vue").PropType<boolean | AnimatedConfig>;
        default: boolean | AnimatedConfig;
    };
    renderTabBar: {
        type: import("vue").PropType<RenderTabBar>;
        default: RenderTabBar;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    tabBarStyle: {
        type: import("vue").PropType<CSSProperties>;
        default: CSSProperties;
    };
    tabPosition: {
        type: import("vue").PropType<TabPosition>;
        default: TabPosition;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideAdd: BooleanConstructor;
    type: {
        type: import("vue").PropType<TabsType>;
        default: TabsType;
    };
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    centered: BooleanConstructor;
    onEdit: {
        type: import("vue").PropType<(e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void>;
        default: (e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
    };
    onChange: {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    onTabClick: {
        type: import("vue").PropType<(activeKey: Key, e: MouseEvent | KeyboardEvent) => void>;
        default: (activeKey: Key, e: MouseEvent | KeyboardEvent) => void;
    };
    onTabScroll: {
        type: import("vue").PropType<OnTabScroll>;
        default: OnTabScroll;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(activeKey: Key) => void>;
        default: (activeKey: Key) => void;
    };
    locale: {
        type: import("vue").PropType<TabsLocale>;
        default: TabsLocale;
    };
    onPrevClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    onNextClick: {
        type: import("vue").PropType<MouseEventHandler>;
        default: MouseEventHandler;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, {
    size: SizeType;
    type: TabsType;
    onChange: (activeKey: Key) => void;
    direction: "rtl" | "ltr";
    getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
    locale: TabsLocale;
    'onUpdate:activeKey': (activeKey: Key) => void;
    animated: boolean | AnimatedConfig;
    destroyInactiveTabPane: boolean;
    onTabClick: (activeKey: Key, e: MouseEvent | KeyboardEvent) => void;
    tabPosition: TabPosition;
    renderTabBar: RenderTabBar;
    onTabScroll: OnTabScroll;
    tabBarStyle: CSSProperties;
    hideAdd: boolean;
    centered: boolean;
    onEdit: (e: Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
    onPrevClick: MouseEventHandler;
    onNextClick: MouseEventHandler;
}, CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
