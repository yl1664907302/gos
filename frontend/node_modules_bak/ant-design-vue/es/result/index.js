import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import PropTypes from '../_util/vue-types';
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import WarningFilled from "@ant-design/icons-vue/es/icons/WarningFilled";
import noFound from './noFound';
import serverError from './serverError';
import unauthorized from './unauthorized';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import classNames from '../_util/classNames';
import useStyle from './style';
export const IconMap = {
  success: CheckCircleFilled,
  error: CloseCircleFilled,
  info: ExclamationCircleFilled,
  warning: WarningFilled
};
export const ExceptionMap = {
  '404': noFound,
  '500': serverError,
  '403': unauthorized
};
// ExceptionImageMap keys
const ExceptionStatus = Object.keys(ExceptionMap);
export const resultProps = () => ({
  prefixCls: String,
  icon: PropTypes.any,
  status: {
    type: [Number, String],
    default: 'info'
  },
  title: PropTypes.any,
  subTitle: PropTypes.any,
  extra: PropTypes.any
});
const renderIcon = (prefixCls, _ref) => {
  let {
    status,
    icon
  } = _ref;
  if (ExceptionStatus.includes(`${status}`)) {
    const SVGComponent = ExceptionMap[status];
    return _createVNode("div", {
      "class": `${prefixCls}-icon ${prefixCls}-image`
    }, [_createVNode(SVGComponent, null, null)]);
  }
  const IconComponent = IconMap[status];
  const iconNode = icon || _createVNode(IconComponent, null, null);
  return _createVNode("div", {
    "class": `${prefixCls}-icon`
  }, [iconNode]);
};
const renderExtra = (prefixCls, extra) => extra && _createVNode("div", {
  "class": `${prefixCls}-extra`
}, [extra]);
const Result = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AResult',
  inheritAttrs: false,
  props: resultProps(),
  slots: Object,
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    const {
      prefixCls,
      direction
    } = useConfigInject('result', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const className = computed(() => classNames(prefixCls.value, hashId.value, `${prefixCls.value}-${props.status}`, {
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
    }));
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const subTitle = (_c = props.subTitle) !== null && _c !== void 0 ? _c : (_d = slots.subTitle) === null || _d === void 0 ? void 0 : _d.call(slots);
      const icon = (_e = props.icon) !== null && _e !== void 0 ? _e : (_f = slots.icon) === null || _f === void 0 ? void 0 : _f.call(slots);
      const extra = (_g = props.extra) !== null && _g !== void 0 ? _g : (_h = slots.extra) === null || _h === void 0 ? void 0 : _h.call(slots);
      const pre = prefixCls.value;
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [className.value, attrs.class]
      }), [renderIcon(pre, {
        status: props.status,
        icon
      }), _createVNode("div", {
        "class": `${pre}-title`
      }, [title]), subTitle && _createVNode("div", {
        "class": `${pre}-subtitle`
      }, [subTitle]), renderExtra(pre, extra), slots.default && _createVNode("div", {
        "class": `${pre}-content`
      }, [slots.default()])]));
    };
  }
});
/* add resource */
Result.PRESENTED_IMAGE_403 = ExceptionMap[403];
Result.PRESENTED_IMAGE_404 = ExceptionMap[404];
Result.PRESENTED_IMAGE_500 = ExceptionMap[500];
/* istanbul ignore next */
Result.install = function (app) {
  app.component(Result.name, Result);
  return app;
};
export default Result;