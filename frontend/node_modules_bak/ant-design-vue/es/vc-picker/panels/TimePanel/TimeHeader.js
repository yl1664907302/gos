import { createVNode as _createVNode } from "vue";
import Header from '../Header';
import { useInjectPanel } from '../../PanelContext';
import { formatValue } from '../../utils/dateUtil';
import useMergeProps from '../../hooks/useMergeProps';
function TimeHeader(_props) {
  const props = useMergeProps(_props);
  const {
    hideHeader
  } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }
  const {
    prefixCls,
    generateConfig,
    locale,
    value,
    format
  } = props;
  const headerPrefixCls = `${prefixCls}-header`;
  return _createVNode(Header, {
    "prefixCls": headerPrefixCls
  }, {
    default: () => [value ? formatValue(value, {
      locale,
      format,
      generateConfig
    }) : '\u00A0']
  });
}
TimeHeader.displayName = 'TimeHeader';
TimeHeader.inheritAttrs = false;
export default TimeHeader;