import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import StatisticNumber from './Number';
import Skeleton from '../skeleton/Skeleton';
import useConfigInject from '../config-provider/hooks/useConfigInject';
// CSSINJS
import useStyle from './style';
import { anyType, booleanType, functionType, someType, vNodeType } from '../_util/type';
export const statisticProps = () => ({
  prefixCls: String,
  decimalSeparator: String,
  groupSeparator: String,
  format: String,
  value: someType([Number, String, Object]),
  valueStyle: {
    type: Object,
    default: undefined
  },
  valueRender: functionType(),
  formatter: anyType(),
  precision: Number,
  prefix: vNodeType(),
  suffix: vNodeType(),
  title: vNodeType(),
  loading: booleanType()
});
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AStatistic',
  inheritAttrs: false,
  props: initDefaultProps(statisticProps(), {
    decimalSeparator: '.',
    groupSeparator: ',',
    loading: false
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
    } = useConfigInject('statistic', props);
    // Style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      var _a, _b, _c, _d, _e, _f, _g;
      const {
        value = 0,
        valueStyle,
        valueRender
      } = props;
      const pre = prefixCls.value;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const prefix = (_c = props.prefix) !== null && _c !== void 0 ? _c : (_d = slots.prefix) === null || _d === void 0 ? void 0 : _d.call(slots);
      const suffix = (_e = props.suffix) !== null && _e !== void 0 ? _e : (_f = slots.suffix) === null || _f === void 0 ? void 0 : _f.call(slots);
      const formatter = (_g = props.formatter) !== null && _g !== void 0 ? _g : slots.formatter;
      // data-for-update just for update component
      // https://github.com/vueComponent/ant-design-vue/pull/3170
      let valueNode = _createVNode(StatisticNumber, _objectSpread({
        "data-for-update": Date.now()
      }, _extends(_extends({}, props), {
        prefixCls: pre,
        value,
        formatter
      })), null);
      if (valueRender) {
        valueNode = valueRender(valueNode);
      }
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [pre, {
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [title && _createVNode("div", {
        "class": `${pre}-title`
      }, [title]), _createVNode(Skeleton, {
        "paragraph": false,
        "loading": props.loading
      }, {
        default: () => [_createVNode("div", {
          "style": valueStyle,
          "class": `${pre}-content`
        }, [prefix && _createVNode("span", {
          "class": `${pre}-content-prefix`
        }, [prefix]), valueNode, suffix && _createVNode("span", {
          "class": `${pre}-content-suffix`
        }, [suffix])])]
      })]));
    };
  }
});