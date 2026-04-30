import Collapse, { collapseProps } from './Collapse';
import CollapsePanel, { collapsePanelProps } from './CollapsePanel';
Collapse.Panel = CollapsePanel;
/* istanbul ignore next */
Collapse.install = function (app) {
  app.component(Collapse.name, Collapse);
  app.component(CollapsePanel.name, CollapsePanel);
  return app;
};
export { CollapsePanel, collapseProps, collapsePanelProps };
export default Collapse;