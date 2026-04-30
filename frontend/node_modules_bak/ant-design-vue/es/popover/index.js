import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode, Fragment as _Fragment } from "vue";
import { computed, defineComponent, ref } from 'vue';
import Tooltip from '../tooltip';
import abstractTooltipProps from '../tooltip/abstractTooltipProps';
import { filterEmpty, initDefaultProps } from '../_util/props-util';
import { anyType, withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import omit from '../_util/omit';
import { getTransitionName } from '../_util/transition';
import { tooltipDefaultProps } from '../tooltip/Tooltip';
import useStyle from './style';
import classNames from '../_util/classNames';
import warning from '../_util/warning';
export const popoverProps = () => _extends(_extends({}, abstractTooltipProps()), {
  content: anyType(),
  title: anyType()
});
const Popover = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'APopover',
  inheritAttrs: false,
  props: initDefaultProps(popoverProps(), _extends(_extends({}, tooltipDefaultProps()), {
    trigger: 'hover',
    placement: 'top',
    mouseEnterDelay: 0.1,
    mouseLeaveDelay: 0.1
  })),
  setup(props, _ref) {
    let {
      expose,
      slots,
      attrs
    } = _ref;
    const tooltipRef = ref();
    warning(props.visible === undefined, 'popover', `\`visible\` will be removed in next major version, please use \`open\` instead.`);
    expose({
      getPopupDomNode: () => {
        var _a, _b;
        return (_b = (_a = tooltipRef.value) === null || _a === void 0 ? void 0 : _a.getPopupDomNode) === null || _b === void 0 ? void 0 : _b.call(_a);
      }
    });
    const {
      prefixCls,
      configProvider
    } = useConfigInject('popover', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const rootPrefixCls = computed(() => configProvider.getPrefixCls());
    const getOverlay = () => {
      var _a, _b;
      const {
        title = filterEmpty((_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots)),
        content = filterEmpty((_b = slots.content) === null || _b === void 0 ? void 0 : _b.call(slots))
      } = props;
      const hasTitle = !!(Array.isArray(title) ? title.length : title);
      const hasContent = !!(Array.isArray(content) ? content.length : title);
      if (!hasTitle && !hasContent) return null;
      return _createVNode(_Fragment, null, [hasTitle && _createVNode("div", {
        "class": `${prefixCls.value}-title`
      }, [title]), _createVNode("div", {
        "class": `${prefixCls.value}-inner-content`
      }, [content])]);
    };
    return () => {
      const overlayCls = classNames(props.overlayClassName, hashId.value);
      return wrapSSR(_createVNode(Tooltip, _objectSpread(_objectSpread(_objectSpread({}, omit(props, ['title', 'content'])), attrs), {}, {
        "prefixCls": prefixCls.value,
        "ref": tooltipRef,
        "overlayClassName": overlayCls,
        "transitionName": getTransitionName(rootPrefixCls.value, 'zoom-big', props.transitionName),
        "data-popover-inject": true
      }), {
        title: getOverlay,
        default: slots.default
      }));
    };
  }
});
export default withInstall(Popover);