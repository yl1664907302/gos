import { createVNode as _createVNode } from "vue";
import Empty from '../empty';
import useConfigInject from './hooks/useConfigInject';
export const DefaultRenderEmpty = props => {
  const {
    prefixCls
  } = useConfigInject('empty', props);
  const renderHtml = componentName => {
    switch (componentName) {
      case 'Table':
      case 'List':
        return _createVNode(Empty, {
          "image": Empty.PRESENTED_IMAGE_SIMPLE
        }, null);
      case 'Select':
      case 'TreeSelect':
      case 'Cascader':
      case 'Transfer':
      case 'Mentions':
        return _createVNode(Empty, {
          "image": Empty.PRESENTED_IMAGE_SIMPLE,
          "class": `${prefixCls.value}-small`
        }, null);
      default:
        return _createVNode(Empty, null, null);
    }
  };
  return renderHtml(props.componentName);
};
function renderEmpty(componentName) {
  return _createVNode(DefaultRenderEmpty, {
    "componentName": componentName
  }, null);
}
export default renderEmpty;