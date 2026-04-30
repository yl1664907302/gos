import _extends from "@babel/runtime/helpers/esm/extends";
import { objectType, anyType } from '../../_util/type';
import { defineComponent } from 'vue';
export const baseOptionsProps = {
  value: String,
  disabled: Boolean,
  payload: objectType()
};
export const optionProps = _extends(_extends({}, baseOptionsProps), {
  label: anyType([])
});
export const optionOptions = {
  name: 'Option',
  props: optionProps,
  render(_props, _ref) {
    let {
      slots
    } = _ref;
    var _a;
    return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
  }
};
export default defineComponent(_extends({
  compatConfig: {
    MODE: 3
  }
}, optionOptions));