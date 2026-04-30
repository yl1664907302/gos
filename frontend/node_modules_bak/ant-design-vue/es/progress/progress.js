import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent } from 'vue';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import CheckOutlined from "@ant-design/icons-vue/es/icons/CheckOutlined";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import Line from './Line';
import Circle from './Circle';
import Steps from './Steps';
import { getSize, getSuccessPercent, validProgress } from './utils';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import { progressProps, progressStatuses } from './props';
import useStyle from './style';
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AProgress',
  inheritAttrs: false,
  props: initDefaultProps(progressProps(), {
    type: 'line',
    percent: 0,
    showInfo: true,
    // null for different theme definition
    trailColor: null,
    size: 'default',
    strokeLinecap: 'round'
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
    } = useConfigInject('progress', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    if (process.env.NODE_ENV !== 'production') {
      devWarning('successPercent' in props, 'Progress', '`successPercent` is deprecated. Please use `success.percent` instead.');
      devWarning('width' in props, 'Progress', '`width` is deprecated. Please use `size` instead.');
    }
    const strokeColorNotArray = computed(() => Array.isArray(props.strokeColor) ? props.strokeColor[0] : props.strokeColor);
    const percentNumber = computed(() => {
      const {
        percent = 0
      } = props;
      const successPercent = getSuccessPercent(props);
      return parseInt(successPercent !== undefined ? successPercent.toString() : percent.toString(), 10);
    });
    const progressStatus = computed(() => {
      const {
        status
      } = props;
      if (!progressStatuses.includes(status) && percentNumber.value >= 100) {
        return 'success';
      }
      return status || 'normal';
    });
    const classString = computed(() => {
      const {
        type,
        showInfo,
        size
      } = props;
      const pre = prefixCls.value;
      return {
        [pre]: true,
        [`${pre}-inline-circle`]: type === 'circle' && getSize(size, 'circle').width <= 20,
        [`${pre}-${type === 'dashboard' && 'circle' || type}`]: true,
        [`${pre}-status-${progressStatus.value}`]: true,
        [`${pre}-show-info`]: showInfo,
        [`${pre}-${size}`]: size,
        [`${pre}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      };
    });
    const strokeColorNotGradient = computed(() => typeof props.strokeColor === 'string' || Array.isArray(props.strokeColor) ? props.strokeColor : undefined);
    const renderProcessInfo = () => {
      const {
        showInfo,
        format,
        type,
        percent,
        title
      } = props;
      const successPercent = getSuccessPercent(props);
      if (!showInfo) return null;
      let text;
      const textFormatter = format || (slots === null || slots === void 0 ? void 0 : slots.format) || (val => `${val}%`);
      const isLineType = type === 'line';
      if (format || (slots === null || slots === void 0 ? void 0 : slots.format) || progressStatus.value !== 'exception' && progressStatus.value !== 'success') {
        text = textFormatter(validProgress(percent), validProgress(successPercent));
      } else if (progressStatus.value === 'exception') {
        text = isLineType ? _createVNode(CloseCircleFilled, null, null) : _createVNode(CloseOutlined, null, null);
      } else if (progressStatus.value === 'success') {
        text = isLineType ? _createVNode(CheckCircleFilled, null, null) : _createVNode(CheckOutlined, null, null);
      }
      return _createVNode("span", {
        "class": `${prefixCls.value}-text`,
        "title": title === undefined && typeof text === 'string' ? text : undefined
      }, [text]);
    };
    return () => {
      const {
        type,
        steps,
        title
      } = props;
      const {
          class: cls
        } = attrs,
        restAttrs = __rest(attrs, ["class"]);
      const progressInfo = renderProcessInfo();
      let progress;
      // Render progress shape
      if (type === 'line') {
        progress = steps ? _createVNode(Steps, _objectSpread(_objectSpread({}, props), {}, {
          "strokeColor": strokeColorNotGradient.value,
          "prefixCls": prefixCls.value,
          "steps": steps
        }), {
          default: () => [progressInfo]
        }) : _createVNode(Line, _objectSpread(_objectSpread({}, props), {}, {
          "strokeColor": strokeColorNotArray.value,
          "prefixCls": prefixCls.value,
          "direction": direction.value
        }), {
          default: () => [progressInfo]
        });
      } else if (type === 'circle' || type === 'dashboard') {
        progress = _createVNode(Circle, _objectSpread(_objectSpread({}, props), {}, {
          "prefixCls": prefixCls.value,
          "strokeColor": strokeColorNotArray.value,
          "progressStatus": progressStatus.value
        }), {
          default: () => [progressInfo]
        });
      }
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({
        "role": "progressbar"
      }, restAttrs), {}, {
        "class": [classString.value, cls],
        "title": title
      }), [progress]));
    };
  }
});