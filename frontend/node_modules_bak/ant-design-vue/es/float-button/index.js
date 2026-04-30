import FloatButton from './FloatButton';
import FloatButtonGroup from './FloatButtonGroup';
import BackTop from './BackTop';
FloatButton.Group = FloatButtonGroup;
FloatButton.BackTop = BackTop;
/* istanbul ignore next */
FloatButton.install = function (app) {
  app.component(FloatButton.name, FloatButton);
  app.component(FloatButtonGroup.name, FloatButtonGroup);
  app.component(BackTop.name, BackTop);
  return app;
};
export { FloatButtonGroup, BackTop };
export default FloatButton;