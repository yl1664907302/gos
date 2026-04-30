"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineItemProps = exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
const timelineItemProps = () => ({
  prefixCls: String,
  color: String,
  dot: _vueTypes.default.any,
  pending: (0, _type.booleanType)(),
  position: _vueTypes.default.oneOf((0, _type.tuple)('left', 'right', '')).def(''),
  label: _vueTypes.default.any
});
exports.timelineItemProps = timelineItemProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATimelineItem',
  props: (0, _initDefaultProps.default)(timelineItemProps(), {
    color: 'blue',
    pending: false
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('timeline', props);
    const itemClassName = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-item`]: true,
      [`${prefixCls.value}-item-pending`]: props.pending
    }));
    const customColor = (0, _vue.computed)(() => /blue|red|green|gray/.test(props.color || '') ? undefined : props.color || 'blue');
    const dotClassName = (0, _vue.computed)(() => ({
      [`${prefixCls.value}-item-head`]: true,
      [`${prefixCls.value}-item-head-${props.color || 'blue'}`]: !customColor.value
    }));
    return () => {
      var _a, _b, _c;
      const {
        label = (_a = slots.label) === null || _a === void 0 ? void 0 : _a.call(slots),
        dot = (_b = slots.dot) === null || _b === void 0 ? void 0 : _b.call(slots)
      } = props;
      return (0, _vue.createVNode)("li", {
        "class": itemClassName.value
      }, [label && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-label`
      }, [label]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-tail`
      }, null), (0, _vue.createVNode)("div", {
        "class": [dotClassName.value, !!dot && `${prefixCls.value}-item-head-custom`],
        "style": {
          borderColor: customColor.value,
          color: customColor.value
        }
      }, [dot]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-content`
      }, [(_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots)])]);
    };
  }
});