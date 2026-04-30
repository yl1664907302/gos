"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
const checkableTagProps = () => ({
  prefixCls: String,
  checked: {
    type: Boolean,
    default: undefined
  },
  onChange: {
    type: Function
  },
  onClick: {
    type: Function
  },
  'onUpdate:checked': Function
});
const CheckableTag = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACheckableTag',
  inheritAttrs: false,
  props: checkableTagProps(),
  // emits: ['update:checked', 'change', 'click'],
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('tag', props);
    // Style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const handleClick = e => {
      const {
        checked
      } = props;
      emit('update:checked', !checked);
      emit('change', !checked);
      emit('click', e);
    };
    const cls = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, hashId.value, {
      [`${prefixCls.value}-checkable`]: true,
      [`${prefixCls.value}-checkable-checked`]: props.checked
    }));
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [cls.value, attrs.class],
        "onClick": handleClick
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
var _default = exports.default = CheckableTag;