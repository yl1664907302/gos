import _extends from "@babel/runtime/helpers/esm/extends";
import Upload, { LIST_IGNORE } from './Upload';
import Dragger from './Dragger';
/* istanbul ignore next */
export const UploadDragger = Dragger;
export default _extends(Upload, {
  Dragger,
  LIST_IGNORE,
  install(app) {
    app.component(Upload.name, Upload);
    app.component(Dragger.name, Dragger);
    return app;
  }
});