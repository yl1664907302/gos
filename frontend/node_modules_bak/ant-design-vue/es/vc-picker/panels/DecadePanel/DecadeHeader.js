import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import Header from '../Header';
import { DECADE_DISTANCE_COUNT } from '.';
import { useInjectPanel } from '../../PanelContext';
import useMergeProps from '../../hooks/useMergeProps';
function DecadeHeader(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    viewDate,
    onPrevDecades,
    onNextDecades
  } = props;
  const {
    hideHeader
  } = useInjectPanel();
  if (hideHeader) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / DECADE_DISTANCE_COUNT) * DECADE_DISTANCE_COUNT;
  const endYear = startYear + DECADE_DISTANCE_COUNT - 1;
  return _createVNode(Header, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevDecades,
    "onSuperNext": onNextDecades
  }), {
    default: () => [startYear, _createTextVNode("-"), endYear]
  });
}
DecadeHeader.displayName = 'DecadeHeader';
DecadeHeader.inheritAttrs = false;
export default DecadeHeader;