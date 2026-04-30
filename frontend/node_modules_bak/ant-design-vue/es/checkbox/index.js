import Checkbox from './Checkbox';
import CheckboxGroup from './Group';
export { checkboxProps, checkboxGroupProps } from './interface';
Checkbox.Group = CheckboxGroup;
/* istanbul ignore next */
Checkbox.install = function (app) {
  app.component(Checkbox.name, Checkbox);
  app.component(CheckboxGroup.name, CheckboxGroup);
  return app;
};
export { CheckboxGroup };
export default Checkbox;