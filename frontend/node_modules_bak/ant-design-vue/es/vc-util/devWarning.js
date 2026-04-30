import devWarning, { resetWarned } from './warning';
export { resetWarned };
export default ((valid, component, message) => {
  devWarning(valid, `[ant-design-vue: ${component}] ${message}`);
});