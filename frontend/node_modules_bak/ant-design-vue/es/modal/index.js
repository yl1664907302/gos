import Modal from './Modal';
import confirm, { withWarn, withInfo, withSuccess, withError, withConfirm } from './confirm';
import useModal from './useModal';
import destroyFns from './destroyFns';
function modalWarn(props) {
  return confirm(withWarn(props));
}
Modal.useModal = useModal;
Modal.info = function infoFn(props) {
  return confirm(withInfo(props));
};
Modal.success = function successFn(props) {
  return confirm(withSuccess(props));
};
Modal.error = function errorFn(props) {
  return confirm(withError(props));
};
Modal.warning = modalWarn;
Modal.warn = modalWarn;
Modal.confirm = function confirmFn(props) {
  return confirm(withConfirm(props));
};
Modal.destroyAll = function destroyAllFn() {
  while (destroyFns.length) {
    const close = destroyFns.pop();
    if (close) {
      close();
    }
  }
};
/* istanbul ignore next */
Modal.install = function (app) {
  app.component(Modal.name, Modal);
  return app;
};
export default Modal;