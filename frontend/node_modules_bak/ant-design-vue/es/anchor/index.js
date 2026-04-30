import Anchor from './Anchor';
import AnchorLink from './AnchorLink';
Anchor.Link = AnchorLink;
/* istanbul ignore next */
Anchor.install = function (app) {
  app.component(Anchor.name, Anchor);
  app.component(Anchor.Link.name, Anchor.Link);
  return app;
};
export { AnchorLink, AnchorLink as Link };
export default Anchor;