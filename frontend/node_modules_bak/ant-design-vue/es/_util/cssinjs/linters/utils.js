import devWarning from '../../../vc-util/warning';
export function lintWarning(message, info) {
  const {
    path,
    parentSelectors
  } = info;
  devWarning(false, `[Ant Design Vue CSS-in-JS] ${path ? `Error in '${path}': ` : ''}${message}${parentSelectors.length ? ` Selector info: ${parentSelectors.join(' -> ')}` : ''}`);
}