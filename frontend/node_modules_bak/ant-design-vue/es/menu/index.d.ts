import type { MenuProps } from './src/Menu';
import type { MenuItemProps } from './src/MenuItem';
import MenuItem from './src/MenuItem';
import type { SubMenuProps } from './src/SubMenu';
import SubMenu from './src/SubMenu';
import type { MenuItemGroupProps } from './src/ItemGroup';
import ItemGroup from './src/ItemGroup';
import Divider from './src/Divider';
import type { MenuDividerProps } from './src/Divider';
import type { Plugin } from 'vue';
import type { MenuTheme, MenuMode } from './src/interface';
import type { ItemType } from './src/hooks/useItems';
export type { MenuProps, SubMenuProps, MenuItemProps, MenuItemGroupProps, MenuTheme, MenuMode, MenuDividerProps, ItemType, };
export { SubMenu, MenuItem as Item, MenuItem, ItemGroup, ItemGroup as MenuItemGroup, Divider, Divider as MenuDivider, };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        items: import("vue").PropType<ItemType[]>;
        disabled: BooleanConstructor;
        inlineCollapsed: BooleanConstructor;
        disabledOverflow: BooleanConstructor;
        forceSubMenuRender: BooleanConstructor;
        openKeys: import("vue").PropType<import("../_util/type").Key[]>;
        selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
        activeKey: StringConstructor;
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        multiple: {
            type: BooleanConstructor;
            default: boolean;
        };
        tabindex: {
            type: (StringConstructor | NumberConstructor)[];
        };
        motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
        role: StringConstructor;
        theme: {
            type: import("vue").PropType<MenuTheme>;
            default: string;
        };
        mode: {
            type: import("vue").PropType<MenuMode>;
            default: string;
        };
        inlineIndent: {
            type: NumberConstructor;
            default: number;
        };
        subMenuOpenDelay: {
            type: NumberConstructor;
            default: number;
        };
        subMenuCloseDelay: {
            type: NumberConstructor;
            default: number;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("./src/interface").BuiltinPlacements>;
        };
        triggerSubMenuAction: {
            type: import("vue").PropType<import("./src/interface").TriggerSubMenuAction>;
            default: string;
        };
        getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        expandIcon: import("vue").PropType<(p?: {
            [key: string]: any;
            isOpen: boolean;
        }) => any>;
        onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        onSelect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
        onDeselect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
        onClick: import("vue").PropType<import("./src/interface").MenuClickEventHandler>;
        onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        mode: MenuMode;
        multiple: boolean;
        disabled: boolean;
        theme: MenuTheme;
        inlineIndent: number;
        inlineCollapsed: boolean;
        subMenuOpenDelay: number;
        subMenuCloseDelay: number;
        triggerSubMenuAction: import("./src/interface").TriggerSubMenuAction;
        forceSubMenuRender: boolean;
        disabledOverflow: boolean;
        selectable: boolean;
    }, true, {}, import("../_util/type").CustomSlotsType<{
        expandIcon?: {
            [key: string]: any;
            isOpen: boolean;
        };
        overflowedIndicator?: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        id: StringConstructor;
        prefixCls: StringConstructor;
        items: import("vue").PropType<ItemType[]>;
        disabled: BooleanConstructor;
        inlineCollapsed: BooleanConstructor;
        disabledOverflow: BooleanConstructor;
        forceSubMenuRender: BooleanConstructor;
        openKeys: import("vue").PropType<import("../_util/type").Key[]>;
        selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
        activeKey: StringConstructor;
        selectable: {
            type: BooleanConstructor;
            default: boolean;
        };
        multiple: {
            type: BooleanConstructor;
            default: boolean;
        };
        tabindex: {
            type: (StringConstructor | NumberConstructor)[];
        };
        motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
        role: StringConstructor;
        theme: {
            type: import("vue").PropType<MenuTheme>;
            default: string;
        };
        mode: {
            type: import("vue").PropType<MenuMode>;
            default: string;
        };
        inlineIndent: {
            type: NumberConstructor;
            default: number;
        };
        subMenuOpenDelay: {
            type: NumberConstructor;
            default: number;
        };
        subMenuCloseDelay: {
            type: NumberConstructor;
            default: number;
        };
        builtinPlacements: {
            type: import("vue").PropType<import("./src/interface").BuiltinPlacements>;
        };
        triggerSubMenuAction: {
            type: import("vue").PropType<import("./src/interface").TriggerSubMenuAction>;
            default: string;
        };
        getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
        expandIcon: import("vue").PropType<(p?: {
            [key: string]: any;
            isOpen: boolean;
        }) => any>;
        onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        onSelect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
        onDeselect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
        onClick: import("vue").PropType<import("./src/interface").MenuClickEventHandler>;
        onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
        onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
        'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
        'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        mode: MenuMode;
        multiple: boolean;
        disabled: boolean;
        theme: MenuTheme;
        inlineIndent: number;
        inlineCollapsed: boolean;
        subMenuOpenDelay: number;
        subMenuCloseDelay: number;
        triggerSubMenuAction: import("./src/interface").TriggerSubMenuAction;
        forceSubMenuRender: boolean;
        disabledOverflow: boolean;
        selectable: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    items: import("vue").PropType<ItemType[]>;
    disabled: BooleanConstructor;
    inlineCollapsed: BooleanConstructor;
    disabledOverflow: BooleanConstructor;
    forceSubMenuRender: BooleanConstructor;
    openKeys: import("vue").PropType<import("../_util/type").Key[]>;
    selectedKeys: import("vue").PropType<import("../_util/type").Key[]>;
    activeKey: StringConstructor;
    selectable: {
        type: BooleanConstructor;
        default: boolean;
    };
    multiple: {
        type: BooleanConstructor;
        default: boolean;
    };
    tabindex: {
        type: (StringConstructor | NumberConstructor)[];
    };
    motion: import("vue").PropType<import("../_util/transition").CSSMotionProps>;
    role: StringConstructor;
    theme: {
        type: import("vue").PropType<MenuTheme>;
        default: string;
    };
    mode: {
        type: import("vue").PropType<MenuMode>;
        default: string;
    };
    inlineIndent: {
        type: NumberConstructor;
        default: number;
    };
    subMenuOpenDelay: {
        type: NumberConstructor;
        default: number;
    };
    subMenuCloseDelay: {
        type: NumberConstructor;
        default: number;
    };
    builtinPlacements: {
        type: import("vue").PropType<import("./src/interface").BuiltinPlacements>;
    };
    triggerSubMenuAction: {
        type: import("vue").PropType<import("./src/interface").TriggerSubMenuAction>;
        default: string;
    };
    getPopupContainer: import("vue").PropType<(node: HTMLElement) => HTMLElement>;
    expandIcon: import("vue").PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    onOpenChange: import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
    onSelect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
    onDeselect: import("vue").PropType<import("./src/interface").SelectEventHandler>;
    onClick: import("vue").PropType<import("./src/interface").MenuClickEventHandler>;
    onFocus: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onBlur: import("vue").PropType<import("../_util/EventInterface").FocusEventHandler>;
    onMousedown: import("vue").PropType<import("../_util/EventInterface").MouseEventHandler>;
    'onUpdate:openKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
    'onUpdate:selectedKeys': import("vue").PropType<(keys: import("../_util/type").Key[]) => void>;
    'onUpdate:activeKey': import("vue").PropType<(key: import("../_util/type").Key) => void>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    mode: MenuMode;
    multiple: boolean;
    disabled: boolean;
    theme: MenuTheme;
    inlineIndent: number;
    inlineCollapsed: boolean;
    subMenuOpenDelay: number;
    subMenuCloseDelay: number;
    triggerSubMenuAction: import("./src/interface").TriggerSubMenuAction;
    forceSubMenuRender: boolean;
    disabledOverflow: boolean;
    selectable: boolean;
}, {}, string, import("../_util/type").CustomSlotsType<{
    expandIcon?: {
        [key: string]: any;
        isOpen: boolean;
    };
    overflowedIndicator?: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Item: typeof MenuItem;
    readonly SubMenu: typeof SubMenu;
    readonly Divider: typeof Divider;
    readonly ItemGroup: typeof ItemGroup;
};
export default _default;
