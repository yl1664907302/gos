import _extends from "@babel/runtime/helpers/esm/extends";
import PropTypes from '../../_util/vue-types';
import { initDefaultProps } from '../../_util/props-util';
import { filterOption as defaultFilterOption, validateSearch as defaultValidateSearch } from './util';
import { arrayType, tuple } from '../../_util/type';
export const PlaceMent = tuple('top', 'bottom');
export const mentionsProps = {
  autofocus: {
    type: Boolean,
    default: undefined
  },
  prefix: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  prefixCls: String,
  value: String,
  disabled: {
    type: Boolean,
    default: undefined
  },
  split: String,
  transitionName: String,
  placement: PropTypes.oneOf(PlaceMent),
  character: PropTypes.any,
  characterRender: Function,
  filterOption: {
    type: [Boolean, Function]
  },
  validateSearch: Function,
  getPopupContainer: {
    type: Function
  },
  options: arrayType(),
  loading: {
    type: Boolean,
    default: undefined
  },
  rows: [Number, String],
  direction: {
    type: String
  }
};
export const vcMentionsProps = _extends(_extends({}, mentionsProps), {
  dropdownClassName: String
});
export const defaultProps = {
  prefix: '@',
  split: ' ',
  rows: 1,
  validateSearch: defaultValidateSearch,
  filterOption: () => defaultFilterOption
};
export default initDefaultProps(vcMentionsProps, defaultProps);