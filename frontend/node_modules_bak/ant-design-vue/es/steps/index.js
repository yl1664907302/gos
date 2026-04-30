import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import CheckOutlined from "@ant-design/icons-vue/es/icons/CheckOutlined";
import { anyType, booleanType, stringType, functionType, someType, arrayType } from '../_util/type';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import VcSteps, { Step as VcStep } from '../vc-steps';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useBreakpoint from '../_util/hooks/useBreakpoint';
import classNames from '../_util/classNames';
import Progress from '../progress';
import omit from '../_util/omit';
import Tooltip from '../tooltip';
import { VcStepProps } from '../vc-steps/Step';
import { useToken } from '../theme/internal';
// CSSINJS
import useStyle from './style';
export const stepsProps = () => ({
  prefixCls: String,
  iconPrefix: String,
  current: Number,
  initial: Number,
  percent: Number,
  responsive: booleanType(),
  items: arrayType(),
  labelPlacement: stringType(),
  status: stringType(),
  size: stringType(),
  direction: stringType(),
  progressDot: someType([Boolean, Function]),
  type: stringType(),
  onChange: functionType(),
  'onUpdate:current': functionType()
});
export const stepProps = () => ({
  description: anyType(),
  icon: anyType(),
  status: stringType(),
  disabled: booleanType(),
  title: anyType(),
  subTitle: anyType(),
  onClick: functionType()
});
const Steps = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASteps',
  inheritAttrs: false,
  props: initDefaultProps(stepsProps(), {
    current: 0,
    responsive: true,
    labelPlacement: 'horizontal'
  }),
  slots: Object,
  // emits: ['update:current', 'change'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const {
      prefixCls,
      direction: rtlDirection,
      configProvider
    } = useConfigInject('steps', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, token] = useToken();
    const screens = useBreakpoint();
    const direction = computed(() => props.responsive && screens.value.xs ? 'vertical' : props.direction);
    const iconPrefix = computed(() => configProvider.getPrefixCls('', props.iconPrefix));
    const handleChange = current => {
      emit('update:current', current);
      emit('change', current);
    };
    const isInline = computed(() => props.type === 'inline');
    const mergedPercent = computed(() => isInline.value ? undefined : props.percent);
    const stepIconRender = _ref2 => {
      let {
        node,
        status
      } = _ref2;
      if (status === 'process' && props.percent !== undefined) {
        // currently it's hard-coded, since we can't easily read the actually width of icon
        const progressWidth = props.size === 'small' ? token.value.controlHeight : token.value.controlHeightLG;
        const iconWithProgress = _createVNode("div", {
          "class": `${prefixCls.value}-progress-icon`
        }, [_createVNode(Progress, {
          "type": "circle",
          "percent": mergedPercent.value,
          "size": progressWidth,
          "strokeWidth": 4,
          "format": () => null
        }, null), node]);
        return iconWithProgress;
      }
      return node;
    };
    const icons = computed(() => ({
      finish: _createVNode(CheckOutlined, {
        "class": `${prefixCls.value}-finish-icon`
      }, null),
      error: _createVNode(CloseOutlined, {
        "class": `${prefixCls.value}-error-icon`
      }, null)
    }));
    return () => {
      const stepsClassName = classNames({
        [`${prefixCls.value}-rtl`]: rtlDirection.value === 'rtl',
        [`${prefixCls.value}-with-progress`]: mergedPercent.value !== undefined
      }, attrs.class, hashId.value);
      const itemRender = (item, stepItem) => item.description ? _createVNode(Tooltip, {
        "title": item.description
      }, {
        default: () => [stepItem]
      }) : stepItem;
      return wrapSSR(_createVNode(VcSteps, _objectSpread(_objectSpread(_objectSpread({
        "icons": icons.value
      }, attrs), omit(props, ['percent', 'responsive'])), {}, {
        "items": props.items,
        "direction": direction.value,
        "prefixCls": prefixCls.value,
        "iconPrefix": iconPrefix.value,
        "class": stepsClassName,
        "onChange": handleChange,
        "isInline": isInline.value,
        "itemRender": isInline.value ? itemRender : undefined
      }), _extends({
        stepIcon: stepIconRender
      }, slots)));
    };
  }
});
/* istanbul ignore next */
export const Step = defineComponent(_extends(_extends({
  compatConfig: {
    MODE: 3
  }
}, VcStep), {
  name: 'AStep',
  props: VcStepProps()
}));
export default _extends(Steps, {
  Step,
  install: app => {
    app.component(Steps.name, Steps);
    app.component(Step.name, Step);
    return app;
  }
});