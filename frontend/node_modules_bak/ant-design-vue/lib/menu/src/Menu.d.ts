import type { CustomSlotsType, Key } from '../../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
import type { MenuTheme, MenuMode, BuiltinPlacements, TriggerSubMenuAction, MenuClickEventHandler, SelectEventHandler } from './interface';
import type { CSSMotionProps } from '../../_util/transition';
import type { FocusEventHandler, MouseEventHandler } from '../../_util/EventInterface';
import type { ItemType } from './hooks/useItems';
export declare const menuProps: () => {
    id: StringConstructor;
    prefixCls: StringConstructor;
    items: PropType<ItemType[]>;
    disabled: BooleanConstructor;
    inlineCollapsed: BooleanConstructor;
    disabledOverflow: BooleanConstructor;
    forceSubMenuRender: BooleanConstructor;
    openKeys: PropType<Key[]>;
    selectedKeys: PropType<Key[]>;
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
    motion: PropType<CSSMotionProps>;
    role: StringConstructor;
    theme: {
        type: PropType<MenuTheme>;
        default: string;
    };
    mode: {
        type: PropType<MenuMode>;
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
        type: PropType<BuiltinPlacements>;
    };
    triggerSubMenuAction: {
        type: PropType<TriggerSubMenuAction>;
        default: string;
    };
    getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    onOpenChange: PropType<(keys: Key[]) => void>;
    onSelect: PropType<SelectEventHandler>;
    onDeselect: PropType<SelectEventHandler>;
    onClick: PropType<MenuClickEventHandler>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onMousedown: PropType<MouseEventHandler>;
    'onUpdate:openKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:selectedKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:activeKey': PropType<(key: Key) => void>;
};
export type MenuProps = Partial<ExtractPropTypes<ReturnType<typeof menuProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    items: PropType<ItemType[]>;
    disabled: BooleanConstructor;
    inlineCollapsed: BooleanConstructor;
    disabledOverflow: BooleanConstructor;
    forceSubMenuRender: BooleanConstructor;
    openKeys: PropType<Key[]>;
    selectedKeys: PropType<Key[]>;
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
    motion: PropType<CSSMotionProps>;
    role: StringConstructor;
    theme: {
        type: PropType<MenuTheme>;
        default: string;
    };
    mode: {
        type: PropType<MenuMode>;
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
        type: PropType<BuiltinPlacements>;
    };
    triggerSubMenuAction: {
        type: PropType<TriggerSubMenuAction>;
        default: string;
    };
    getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    onOpenChange: PropType<(keys: Key[]) => void>;
    onSelect: PropType<SelectEventHandler>;
    onDeselect: PropType<SelectEventHandler>;
    onClick: PropType<MenuClickEventHandler>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onMousedown: PropType<MouseEventHandler>;
    'onUpdate:openKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:selectedKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:activeKey': PropType<(key: Key) => void>;
}>, () => import("../../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    id: StringConstructor;
    prefixCls: StringConstructor;
    items: PropType<ItemType[]>;
    disabled: BooleanConstructor;
    inlineCollapsed: BooleanConstructor;
    disabledOverflow: BooleanConstructor;
    forceSubMenuRender: BooleanConstructor;
    openKeys: PropType<Key[]>;
    selectedKeys: PropType<Key[]>;
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
    motion: PropType<CSSMotionProps>;
    role: StringConstructor;
    theme: {
        type: PropType<MenuTheme>;
        default: string;
    };
    mode: {
        type: PropType<MenuMode>;
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
        type: PropType<BuiltinPlacements>;
    };
    triggerSubMenuAction: {
        type: PropType<TriggerSubMenuAction>;
        default: string;
    };
    getPopupContainer: PropType<(node: HTMLElement) => HTMLElement>;
    expandIcon: PropType<(p?: {
        [key: string]: any;
        isOpen: boolean;
    }) => any>;
    onOpenChange: PropType<(keys: Key[]) => void>;
    onSelect: PropType<SelectEventHandler>;
    onDeselect: PropType<SelectEventHandler>;
    onClick: PropType<MenuClickEventHandler>;
    onFocus: PropType<FocusEventHandler>;
    onBlur: PropType<FocusEventHandler>;
    onMousedown: PropType<MouseEventHandler>;
    'onUpdate:openKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:selectedKeys': PropType<(keys: Key[]) => void>;
    'onUpdate:activeKey': PropType<(key: Key) => void>;
}>> & Readonly<{}>, {
    mode: MenuMode;
    multiple: boolean;
    disabled: boolean;
    theme: MenuTheme;
    inlineIndent: number;
    inlineCollapsed: boolean;
    subMenuOpenDelay: number;
    subMenuCloseDelay: number;
    triggerSubMenuAction: TriggerSubMenuAction;
    forceSubMenuRender: boolean;
    disabledOverflow: boolean;
    selectable: boolean;
}, CustomSlotsType<{
    expandIcon?: {
        [key: string]: any;
        isOpen: boolean;
    };
    overflowedIndicator?: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
