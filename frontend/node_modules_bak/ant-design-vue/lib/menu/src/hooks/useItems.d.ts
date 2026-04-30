import type { MenuItemType as VcMenuItemType, MenuDividerType as VcMenuDividerType, SubMenuType as VcSubMenuType, MenuItemGroupType as VcMenuItemGroupType } from '../interface';
import type { Key } from '../../../_util/type';
import type { VNode } from 'vue';
import type { MenuProps } from '../Menu';
import type { StoreMenuInfo } from './useMenuContext';
export interface MenuItemType extends VcMenuItemType {
    danger?: boolean;
    icon?: VNode | ((item: MenuItemType) => VNode);
    title?: string;
}
export interface SubMenuType extends Omit<VcSubMenuType, 'children'> {
    icon?: VNode | ((item: SubMenuType) => VNode);
    children: ItemType[];
}
export interface MenuItemGroupType extends Omit<VcMenuItemGroupType, 'children'> {
    children?: MenuItemType[];
    key?: Key;
}
export interface MenuDividerType extends VcMenuDividerType {
    dashed?: boolean;
    key?: Key;
}
export type ItemType = MenuItemType | SubMenuType | MenuItemGroupType | MenuDividerType | null;
/**
 * We simply convert `items` to VueNode for reuse origin component logic. But we need move all the
 * logic from component into this hooks when in v4
 */
export default function useItems(props: MenuProps): {
    itemsNodes: import("vue").ShallowRef<any[], any[]>;
    store: import("vue").ShallowRef<Map<string, StoreMenuInfo>, Map<string, StoreMenuInfo>>;
    hasItmes: import("vue").ShallowRef<boolean, boolean>;
};
