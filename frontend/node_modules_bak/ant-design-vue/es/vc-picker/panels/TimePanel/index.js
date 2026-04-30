import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import TimeHeader from './TimeHeader';
import TimeBody from './TimeBody';
import { createKeydownHandler } from '../../utils/uiUtil';
import classNames from '../../../_util/classNames';
import { ref } from 'vue';
import useMergeProps from '../../hooks/useMergeProps';
const countBoolean = boolList => boolList.filter(bool => bool !== false).length;
function TimePanel(_props) {
  const props = useMergeProps(_props);
  const {
    generateConfig,
    format = 'HH:mm:ss',
    prefixCls,
    active,
    operationRef,
    showHour,
    showMinute,
    showSecond,
    use12Hours = false,
    onSelect,
    value
  } = props;
  const panelPrefixCls = `${prefixCls}-time-panel`;
  const bodyOperationRef = ref();
  // ======================= Keyboard =======================
  const activeColumnIndex = ref(-1);
  const columnsCount = countBoolean([showHour, showMinute, showSecond, use12Hours]);
  operationRef.value = {
    onKeydown: event => createKeydownHandler(event, {
      onLeftRight: diff => {
        activeColumnIndex.value = (activeColumnIndex.value + diff + columnsCount) % columnsCount;
      },
      onUpDown: diff => {
        if (activeColumnIndex.value === -1) {
          activeColumnIndex.value = 0;
        } else if (bodyOperationRef.value) {
          bodyOperationRef.value.onUpDown(diff);
        }
      },
      onEnter: () => {
        onSelect(value || generateConfig.getNow(), 'key');
        activeColumnIndex.value = -1;
      }
    }),
    onBlur: () => {
      activeColumnIndex.value = -1;
    }
  };
  return _createVNode("div", {
    "class": classNames(panelPrefixCls, {
      [`${panelPrefixCls}-active`]: active
    })
  }, [_createVNode(TimeHeader, _objectSpread(_objectSpread({}, props), {}, {
    "format": format,
    "prefixCls": prefixCls
  }), null), _createVNode(TimeBody, _objectSpread(_objectSpread({}, props), {}, {
    "prefixCls": prefixCls,
    "activeColumnIndex": activeColumnIndex.value,
    "operationRef": bodyOperationRef
  }), null)]);
}
TimePanel.displayName = 'TimePanel';
TimePanel.inheritAttrs = false;
export default TimePanel;