import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode, createTextVNode as _createTextVNode } from "vue";
import Header from '../Header';
import { YEAR_DECADE_COUNT } from '.';
import { useInjectPanel } from '../../PanelContext';
import useMergeProps from '../../hooks/useMergeProps';
function YearHeader(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    viewDate,
    onPrevDecade,
    onNextDecade,
    onDecadeClick
  } = props;
  const {
    hideHeader
  } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  const yearNumber = generateConfig.getYear(viewDate);
  const startYear = Math.floor(yearNumber / YEAR_DECADE_COUNT) * YEAR_DECADE_COUNT;
  const endYear = startYear + YEAR_DECADE_COUNT - 1;
  return _createVNode(Header, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevDecade,
    "onSuperNext": onNextDecade
  }), {
    default: () => [_createVNode("button", {
      "type": "button",
      "onClick": onDecadeClick,
      "class": `${prefixCls}-decade-btn`
    }, [startYear, _createTextVNode("-"), endYear])]
  });
}
YearHeader.displayName = 'YearHeader';
YearHeader.inheritAttrs = false;
export default YearHeader;