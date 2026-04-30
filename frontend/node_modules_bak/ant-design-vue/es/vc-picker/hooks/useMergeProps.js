import _extends from "@babel/runtime/helpers/esm/extends";
import { useAttrs } from 'vue';
// 仅用在函数式组件中，不用考虑响应式问题
export default function useMergeProps(props) {
  const attrs = useAttrs();
  return _extends(_extends({}, props), attrs);
}