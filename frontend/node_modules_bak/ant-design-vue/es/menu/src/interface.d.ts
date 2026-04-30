import type { CSSProperties } from 'vue';
import type { Key } from '../../_util/type';
import type { MenuItemProps } from './MenuItem';
interface ItemSharedProps {
    style?: CSSProperties;
    class?: string;
}
export interface SubMenuType extends ItemSharedProps {
    label?: any;
    children: ItemType[];
    disabled?: boolean;
    key: Key;
    theme?: MenuTheme;
    rootClassName?: string;
    itemIcon?: RenderIconType;
    expandIcon?: RenderIconType;
    onMouseenter?: MenuHoverEventHandler;
    onMouseleave?: MenuHoverEventHandler;
    popupClassName?: string;
    popupOffset?: number[];
    onClick?: MenuClickEventHandler;
    onTitleClick?: (info: MenuTitleInfo) => void;
    onTitleMouseenter?: MenuHoverEventHandler;
    onTitleMouseleave?: MenuHoverEventHandler;
}
export interface MenuItemType extends ItemSharedProps {
    label?: any;
    disabled?: boolean;
    itemIcon?: RenderIconType;
    key: Key;
    onMouseenter?: MenuHoverEventHandler;
    onMouseleave?: MenuHoverEventHandler;
    onClick?: MenuClickEventHandler;
}
export interface MenuItemGroupType extends ItemSharedProps {
    type: 'group';
    label?: any;
    children?: ItemType[];
}
export interface MenuDividerType extends ItemSharedProps {
    type: 'divider';
}
export type ItemType = SubMenuType | MenuItemType | MenuItemGroupType | MenuDividerType | null;
export type MenuTheme = 'light' | 'dark';
export type MenuMode = 'horizontal' | 'vertical' | 'inline';
export type BuiltinPlacements = Record<string, any>;
export type TriggerSubMenuAction = 'click' | 'hover';
export interface RenderIconInfo {
    isSelected?: boolean;
    isOpen?: boolean;
    isSubMenu?: boolean;
    disabled?: boolean;
}
export type RenderIconType = (props: RenderIconInfo) => any;
export interface MenuInfo {
    key: Key;
    eventKey: string;
    keyPath?: Key[];
    eventKeyPath: string[];
    domEvent: MouseEvent | KeyboardEvent;
    item: MenuItemProps & {
        [key: string]: any;
    };
}
export interface MenuTitleInfo {
    key: Key;
    domEvent: MouseEvent | KeyboardEvent;
}
export type MenuHoverEventHandler = (info: {
    key: Key;
    domEvent: MouseEvent;
}) => void;
export interface SelectInfo extends MenuInfo {
    selectedKeys: Key[];
}
export type SelectEventHandler = (info: SelectInfo) => void;
export type MenuClickEventHandler = (info: MenuInfo) => void;
export {};
