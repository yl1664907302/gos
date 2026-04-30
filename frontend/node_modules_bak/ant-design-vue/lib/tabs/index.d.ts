import type { Plugin } from 'vue';
import { TabPane } from './src';
export type { TabsProps, TabPaneProps } from './src';
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<boolean | import("./src/interface").AnimatedConfig>;
            default: boolean | import("./src/interface").AnimatedConfig;
        };
        renderTabBar: {
            type: import("vue").PropType<import("./src/interface").RenderTabBar>;
            default: import("./src/interface").RenderTabBar;
        };
        tabBarGutter: {
            type: NumberConstructor;
        };
        tabBarStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        tabPosition: {
            type: import("vue").PropType<import("./src/interface").TabPosition>;
            default: import("./src/interface").TabPosition;
        };
        destroyInactiveTabPane: {
            type: BooleanConstructor;
            default: boolean;
        };
        hideAdd: BooleanConstructor;
        type: {
            type: import("vue").PropType<import("./src/Tabs").TabsType>;
            default: import("./src/Tabs").TabsType;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        centered: BooleanConstructor;
        onEdit: {
            type: import("vue").PropType<(e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void>;
            default: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
        };
        onChange: {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
            default: (activeKey: import("../_util/type").Key) => void;
        };
        onTabClick: {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void>;
            default: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
        };
        onTabScroll: {
            type: import("vue").PropType<import("./src/interface").OnTabScroll>;
            default: import("./src/interface").OnTabScroll;
        };
        'onUpdate:activeKey': {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
            default: (activeKey: import("../_util/type").Key) => void;
        };
        locale: {
            type: import("vue").PropType<import("./src/interface").TabsLocale>;
            default: import("./src/interface").TabsLocale;
        };
        onPrevClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onNextClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("../config-provider").SizeType;
        type: import("./src/Tabs").TabsType;
        onChange: (activeKey: import("../_util/type").Key) => void;
        direction: "rtl" | "ltr";
        getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
        locale: import("./src/interface").TabsLocale;
        'onUpdate:activeKey': (activeKey: import("../_util/type").Key) => void;
        animated: boolean | import("./src/interface").AnimatedConfig;
        destroyInactiveTabPane: boolean;
        onTabClick: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
        tabPosition: import("./src/interface").TabPosition;
        renderTabBar: import("./src/interface").RenderTabBar;
        onTabScroll: import("./src/interface").OnTabScroll;
        tabBarStyle: import("vue").CSSProperties;
        hideAdd: boolean;
        centered: boolean;
        onEdit: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
        onPrevClick: import("../_util/EventInterface").MouseEventHandler;
        onNextClick: import("../_util/EventInterface").MouseEventHandler;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        tabBarExtraContent?: any;
        leftExtra?: any;
        rightExtra?: any;
        moreIcon?: any;
        addIcon?: any;
        removeIcon?: any;
        renderTabBar?: any;
        default?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
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
            type: import("vue").PropType<boolean | import("./src/interface").AnimatedConfig>;
            default: boolean | import("./src/interface").AnimatedConfig;
        };
        renderTabBar: {
            type: import("vue").PropType<import("./src/interface").RenderTabBar>;
            default: import("./src/interface").RenderTabBar;
        };
        tabBarGutter: {
            type: NumberConstructor;
        };
        tabBarStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        tabPosition: {
            type: import("vue").PropType<import("./src/interface").TabPosition>;
            default: import("./src/interface").TabPosition;
        };
        destroyInactiveTabPane: {
            type: BooleanConstructor;
            default: boolean;
        };
        hideAdd: BooleanConstructor;
        type: {
            type: import("vue").PropType<import("./src/Tabs").TabsType>;
            default: import("./src/Tabs").TabsType;
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        centered: BooleanConstructor;
        onEdit: {
            type: import("vue").PropType<(e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void>;
            default: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
        };
        onChange: {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
            default: (activeKey: import("../_util/type").Key) => void;
        };
        onTabClick: {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void>;
            default: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
        };
        onTabScroll: {
            type: import("vue").PropType<import("./src/interface").OnTabScroll>;
            default: import("./src/interface").OnTabScroll;
        };
        'onUpdate:activeKey': {
            type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
            default: (activeKey: import("../_util/type").Key) => void;
        };
        locale: {
            type: import("vue").PropType<import("./src/interface").TabsLocale>;
            default: import("./src/interface").TabsLocale;
        };
        onPrevClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        onNextClick: {
            type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
            default: import("../_util/EventInterface").MouseEventHandler;
        };
        tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        size: import("../config-provider").SizeType;
        type: import("./src/Tabs").TabsType;
        onChange: (activeKey: import("../_util/type").Key) => void;
        direction: "rtl" | "ltr";
        getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
        locale: import("./src/interface").TabsLocale;
        'onUpdate:activeKey': (activeKey: import("../_util/type").Key) => void;
        animated: boolean | import("./src/interface").AnimatedConfig;
        destroyInactiveTabPane: boolean;
        onTabClick: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
        tabPosition: import("./src/interface").TabPosition;
        renderTabBar: import("./src/interface").RenderTabBar;
        onTabScroll: import("./src/interface").OnTabScroll;
        tabBarStyle: import("vue").CSSProperties;
        hideAdd: boolean;
        centered: boolean;
        onEdit: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
        onPrevClick: import("../_util/EventInterface").MouseEventHandler;
        onNextClick: import("../_util/EventInterface").MouseEventHandler;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
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
        type: import("vue").PropType<boolean | import("./src/interface").AnimatedConfig>;
        default: boolean | import("./src/interface").AnimatedConfig;
    };
    renderTabBar: {
        type: import("vue").PropType<import("./src/interface").RenderTabBar>;
        default: import("./src/interface").RenderTabBar;
    };
    tabBarGutter: {
        type: NumberConstructor;
    };
    tabBarStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    tabPosition: {
        type: import("vue").PropType<import("./src/interface").TabPosition>;
        default: import("./src/interface").TabPosition;
    };
    destroyInactiveTabPane: {
        type: BooleanConstructor;
        default: boolean;
    };
    hideAdd: BooleanConstructor;
    type: {
        type: import("vue").PropType<import("./src/Tabs").TabsType>;
        default: import("./src/Tabs").TabsType;
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    centered: BooleanConstructor;
    onEdit: {
        type: import("vue").PropType<(e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void>;
        default: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
    };
    onChange: {
        type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
        default: (activeKey: import("../_util/type").Key) => void;
    };
    onTabClick: {
        type: import("vue").PropType<(activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void>;
        default: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
    };
    onTabScroll: {
        type: import("vue").PropType<import("./src/interface").OnTabScroll>;
        default: import("./src/interface").OnTabScroll;
    };
    'onUpdate:activeKey': {
        type: import("vue").PropType<(activeKey: import("../_util/type").Key) => void>;
        default: (activeKey: import("../_util/type").Key) => void;
    };
    locale: {
        type: import("vue").PropType<import("./src/interface").TabsLocale>;
        default: import("./src/interface").TabsLocale;
    };
    onPrevClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    onNextClick: {
        type: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        default: import("../_util/EventInterface").MouseEventHandler;
    };
    tabBarExtraContent: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("../config-provider").SizeType;
    type: import("./src/Tabs").TabsType;
    onChange: (activeKey: import("../_util/type").Key) => void;
    direction: "rtl" | "ltr";
    getPopupContainer: (triggerNode?: HTMLElement) => HTMLElement;
    locale: import("./src/interface").TabsLocale;
    'onUpdate:activeKey': (activeKey: import("../_util/type").Key) => void;
    animated: boolean | import("./src/interface").AnimatedConfig;
    destroyInactiveTabPane: boolean;
    onTabClick: (activeKey: import("../_util/type").Key, e: MouseEvent | KeyboardEvent) => void;
    tabPosition: import("./src/interface").TabPosition;
    renderTabBar: import("./src/interface").RenderTabBar;
    onTabScroll: import("./src/interface").OnTabScroll;
    tabBarStyle: import("vue").CSSProperties;
    hideAdd: boolean;
    centered: boolean;
    onEdit: (e: import("../_util/type").Key | MouseEvent | KeyboardEvent, action: "add" | "remove") => void;
    onPrevClick: import("../_util/EventInterface").MouseEventHandler;
    onNextClick: import("../_util/EventInterface").MouseEventHandler;
}, {}, string, import("../_util/type").CustomSlotsType<{
    tabBarExtraContent?: any;
    leftExtra?: any;
    rightExtra?: any;
    moreIcon?: any;
    addIcon?: any;
    removeIcon?: any;
    renderTabBar?: any;
    default?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly TabPane: typeof TabPane;
};
export default _default;
export { TabPane };
