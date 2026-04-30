import vcWarning, { resetWarned } from '../vc-util/warning';
export { resetWarned };
export function noop() {}
// eslint-disable-next-line import/no-mutable-exports
let warning = noop;
if (process.env.NODE_ENV !== 'production') {
  warning = (valid, component, message) => {
    vcWarning(valid, `[ant-design-vue: ${component}] ${message}`);
    // StrictMode will inject console which will not throw warning in React 17.
    if (process.env.NODE_ENV === 'test') {
      resetWarned();
    }
  };
}
export default warning;