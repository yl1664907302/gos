import Menu from './src/Menu';
import MenuItem from './src/MenuItem';
import SubMenu from './src/SubMenu';
import ItemGroup from './src/ItemGroup';
import Divider from './src/Divider';
/* istanbul ignore next */
Menu.install = function (app) {
  app.component(Menu.name, Menu);
  app.component(MenuItem.name, MenuItem);
  app.component(SubMenu.name, SubMenu);
  app.component(Divider.name, Divider);
  app.component(ItemGroup.name, ItemGroup);
  return app;
};
Menu.Item = MenuItem;
Menu.Divider = Divider;
Menu.SubMenu = SubMenu;
Menu.ItemGroup = ItemGroup;
export { SubMenu, MenuItem as Item, MenuItem, ItemGroup, ItemGroup as MenuItemGroup, Divider, Divider as MenuDivider };
export default Menu;