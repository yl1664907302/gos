import Badge from './Badge';
import Ribbon from './Ribbon';
Badge.install = function (app) {
  app.component(Badge.name, Badge);
  app.component(Ribbon.name, Ribbon);
  return app;
};
export { Ribbon as BadgeRibbon };
export default Badge;