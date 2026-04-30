import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
import { defineComponent } from 'vue';
import DefaultPanel from './DefaultPanel';
import { tourStepProps } from '../interface';
const TourStep = defineComponent({
  name: 'TourStep',
  inheritAttrs: false,
  props: tourStepProps(),
  setup(props, _ref) {
    let {
      attrs
    } = _ref;
    return () => {
      const {
        current,
        renderPanel
      } = props;
      return _createVNode(_Fragment, null, [typeof renderPanel === 'function' ? renderPanel(_extends(_extends({}, attrs), props), current) : _createVNode(DefaultPanel, _objectSpread(_objectSpread({}, attrs), props), null)]);
    };
  }
});
export default TourStep;