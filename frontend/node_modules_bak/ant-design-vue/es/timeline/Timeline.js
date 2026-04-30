import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { cloneVNode, defineComponent } from 'vue';
import classNames from '../_util/classNames';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import TimelineItem from './TimelineItem';
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import { tuple, booleanType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
// CSSINJS
import useStyle from './style';
export const timelineProps = () => ({
  prefixCls: String,
  /** 指定最后一个幽灵节点是否存在或内容 */
  pending: PropTypes.any,
  pendingDot: PropTypes.any,
  reverse: booleanType(),
  mode: PropTypes.oneOf(tuple('left', 'alternate', 'right', ''))
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATimeline',
  inheritAttrs: false,
  props: initDefaultProps(timelineProps(), {
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
    } = useConfigInject('timeline', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
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
      const children = filterEmpty((_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots));
      const pendingItem = pending ? _createVNode(TimelineItem, {
        "pending": !!pending,
        "dot": pendingDot || _createVNode(LoadingOutlined, null, null)
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
        return cloneVNode(ele, {
          class: classNames([!reverse && !!pending ? pendingClass : readyClass, getPositionCls(ele, idx)])
        });
      });
      const hasLabelItem = timeLineItems.some(item => {
        var _a, _b;
        return !!(((_a = item.props) === null || _a === void 0 ? void 0 : _a.label) || ((_b = item.children) === null || _b === void 0 ? void 0 : _b.label));
      });
      const classString = classNames(prefixCls.value, {
        [`${prefixCls.value}-pending`]: !!pending,
        [`${prefixCls.value}-reverse`]: !!reverse,
        [`${prefixCls.value}-${mode}`]: !!mode && !hasLabelItem,
        [`${prefixCls.value}-label`]: hasLabelItem,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, attrs.class, hashId.value);
      return wrapSSR(_createVNode("ul", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": classString
      }), [items]));
    };
  }
});