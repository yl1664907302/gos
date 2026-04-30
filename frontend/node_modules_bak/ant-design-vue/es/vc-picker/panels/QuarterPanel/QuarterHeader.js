import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import Header from '../Header';
import { useInjectPanel } from '../../PanelContext';
import { formatValue } from '../../utils/dateUtil';
import useMergeProps from '../../hooks/useMergeProps';
function QuarterHeader(_props) {
  const props = useMergeProps(_props);
  const {
    prefixCls,
    generateConfig,
    locale,
    viewDate,
    onNextYear,
    onPrevYear,
    onYearClick
  } = props;
  const {
    hideHeader
  } = useInjectPanel();
  if (hideHeader.value) {
    return null;
  }
  const headerPrefixCls = `${prefixCls}-header`;
  return _createVNode(Header, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": headerPrefixCls,
    "onSuperPrev": onPrevYear,
    "onSuperNext": onNextYear
  }), {
    default: () => [_createVNode("button", {
      "type": "button",
      "onClick": onYearClick,
      "class": `${prefixCls}-year-btn`
    }, [formatValue(viewDate, {
      locale,
      format: locale.yearFormat,
      generateConfig
    })])]
  });
}
QuarterHeader.displayName = 'QuarterHeader';
QuarterHeader.inheritAttrs = false;
export default QuarterHeader;