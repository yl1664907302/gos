import Tabs, { TabPane } from './src';
Tabs.TabPane = TabPane;
/* istanbul ignore next */
Tabs.install = function (app) {
  app.component(Tabs.name, Tabs);
  app.component(TabPane.name, TabPane);
  return app;
};
export default Tabs;
export { TabPane };