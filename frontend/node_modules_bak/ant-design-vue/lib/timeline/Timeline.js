"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timelineProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _TimelineItem = _interopRequireDefault(require("./TimelineItem"));
var _LoadingOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/LoadingOutlined"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const timelineProps = () => ({
  prefixCls: String,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: _vueTypes.default.any,
  pendingDot: _vueTypes.default.any,
  reverse: (0, _type.booleanType)(),
  mode: _vueTypes.default.oneOf((0, _type.tuple)('left', 'alternate', 'right', ''))
});
exports.timelineProps = timelineProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATimeline',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(timelineProps(), {
    reverse: false,
    mode: ''
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('timeline', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const getPositionCls = (ele, idx) => {
      const eleProps = ele.props || {};
      if (props.mode === 'alternate') {
        if (eleProps.position === 'right') return `${prefixCls.value}-item-right`;
        if (eleProps.position === 'left') return `${prefixCls.value}-item-left`;
        return idx % 2 === 0 ? `${prefixCls.value}-item-left` : `${prefixCls.value}-item-right`;
      }
      if (props.mode === 'left') return `${prefixCls.value}-item-left`;
      if (props.mode === 'right') return `${prefixCls.value}-item-right`;
      if (eleProps.position === 'right') return `${prefixCls.value}-item-right`;
      return '';
    };
    return () => {
      var _a, _b, _c;
      const {
        pending = (_a = slots.pending) === null || _a === void 0 ? void 0 : _a.call(slots),
        pendingDot = (_b = slots.pendingDot) === null || _b === void 0 ? void 0 : _b.call(slots),
        reverse,
        mode
      } = props;
      const pendingNode = typeof pending === 'boolean' ? null : pending;
      const children = (0, _propsUtil.filterEmpty)((_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots));
      const pendingItem = pending ? (0, _vue.createVNode)(_TimelineItem.default, {
        "pending": !!pending,
        "dot": pendingDot || (0, _vue.createVNode)(_LoadingOutlined.default, null, null)
      }, {
        default: () => [pendingNode]
      }) : null;
      if (pendingItem) {
        children.push(pendingItem);
      }
      const timeLineItems = reverse ? children.reverse() : children;
      const itemsCount = timeLineItems.length;
      const lastCls = `${prefixCls.value}-item-last`;
      const items = timeLineItems.map((ele, idx) => {
        const pendingClass = idx === itemsCount - 2 ? lastCls : '';
        const readyClass = idx === itemsCount - 1 ? lastCls : '';
        return (0, _vue.cloneVNode)(ele, {
          class: (0, _classNames.default)([!reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
        });
      });
      const hasLabelItem = timeLineItems.some(item => {
        var _a, _b;
        return !!(((_a = item.props) === null || _a === void 0 ? void 0 : _a.label) || ((_b = item.children) === null || _b === void 0 ? void 0 : _b.label));
      });
      const classString = (0, _classNames.default)(prefixCls.value, {
        [`${prefixCls.value}-pending`]: !!pending,
        [`${prefixCls.value}-reverse`]: !!reverse,
        [`${prefixCls.value}-${mode}`]: !!mode && !hasLabelItem,
        [`${prefixCls.value}-label`]: hasLabelItem,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      return wrapSSR((0, _vue.createVNode)("ul", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": classString
      }), [items]));
    };
  }
});