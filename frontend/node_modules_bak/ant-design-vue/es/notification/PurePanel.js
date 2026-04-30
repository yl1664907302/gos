import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent } from 'vue';
import useStyle from './style';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Notice from '../vc-notification/Notice';
import classNames from '../_util/classNames';
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import InfoCircleFilled from "@ant-design/icons-vue/es/icons/InfoCircleFilled";
import CloseOutlined from "@ant-design/icons-vue/es/icons/CloseOutlined";
import { renderHelper } from '../_util/util';
export function getCloseIcon(prefixCls, closeIcon) {
  return closeIcon || _createVNode("span", {
    "class": `${prefixCls}-close-x`
  }, [_createVNode(CloseOutlined, {
    "class": `${prefixCls}-close-icon`
  }, null)]);
}
export const TypeIcon = {
  info: _createVNode(InfoCircleFilled, null, null),
  success: _createVNode(CheckCircleFilled, null, null),
  error: _createVNode(CloseCircleFilled, null, null),
  warning: _createVNode(ExclamationCircleFilled, null, null),
  loading: _createVNode(LoadingOutlined, null, null)
};
const typeToIcon = {
  success: CheckCircleFilled,
  info: InfoCircleFilled,
  error: CloseCircleFilled,
  warning: ExclamationCircleFilled
};
export function PureContent(_ref) {
  let {
    prefixCls,
    icon,
    type,
    message,
    description,
    btn
  } = _ref;
  let iconNode = null;
  if (icon) {
    iconNode = _createVNode("span", {
      "class": `${prefixCls}-icon`
    }, [renderHelper(icon)]);
  } else if (type) {
    const Icon = typeToIcon[type];
    iconNode = _createVNode(Icon, {
      "class": `${prefixCls}-icon ${prefixCls}-icon-${type}`
    }, null);
  }
  return _createVNode("div", {
    "class": classNames({
      [`${prefixCls}-with-icon`]: iconNode
    }),
    "role": "alert"
  }, [iconNode, _createVNode("div", {
    "class": `${prefixCls}-message`
  }, [message]), _createVNode("div", {
    "class": `${prefixCls}-description`
  }, [description]), btn && _createVNode("div", {
    "class": `${prefixCls}-btn`
  }, [btn])]);
}
/** @private Internal Component. Do not use in your production. */
export default defineComponent({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'icon', 'type', 'message', 'description', 'btn', 'closeIcon'],
  setup(props) {
    const {
      getPrefixCls
    } = useConfigInject('notification', props);
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('notification'));
    const noticePrefixCls = computed(() => `${prefixCls.value}-notice`);
    const [, hashId] = useStyle(prefixCls);
    return () => {
      return _createVNode(Notice, _objectSpread(_objectSpread({}, props), {}, {
        "prefixCls": prefixCls.value,
        "class": classNames(hashId.value, `${noticePrefixCls.value}-pure-panel`),
        "noticeKey": "pure",
        "duration": null,
        "closable": props.closable,
        "closeIcon": getCloseIcon(prefixCls.value, props.closeIcon)
      }), {
        default: () => [_createVNode(PureContent, {
          "prefixCls": noticePrefixCls.value,
          "icon": props.icon,
          "type": props.type,
          "message": props.message,
          "description": props.description,
          "btn": props.btn
        }, null)]
      });
    };
  }
});