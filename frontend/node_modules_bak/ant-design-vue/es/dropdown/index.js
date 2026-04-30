import Dropdown from './dropdown';
import DropdownButton from './dropdown-button';
import { dropdownProps, dropdownButtonProps } from './props';
Dropdown.Button = DropdownButton;
/* istanbul ignore next */
Dropdown.install = function (app) {
  app.component(Dropdown.name, Dropdown);
  app.component(DropdownButton.name, DropdownButton);
  return app;
};
export { DropdownButton, dropdownProps, dropdownButtonProps };
export default Dropdown;