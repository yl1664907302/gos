import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import Notice from '../vc-notification/Notice';
import useStyle from './style';
import LoadingOutlined from "@ant-design/icons-vue/es/icons/LoadingOutlined";
import ExclamationCircleFilled from "@ant-design/icons-vue/es/icons/ExclamationCircleFilled";
import CloseCircleFilled from "@ant-design/icons-vue/es/icons/CloseCircleFilled";
import CheckCircleFilled from "@ant-design/icons-vue/es/icons/CheckCircleFilled";
import InfoCircleFilled from "@ant-design/icons-vue/es/icons/InfoCircleFilled";
import classNames from '../_util/classNames';
import { useConfigContextInject } from '../config-provider/context';
import { computed, defineComponent } from 'vue';
export const TypeIcon = {
  info: _createVNode(InfoCircleFilled, null, null),
  success: _createVNode(CheckCircleFilled, null, null),
  error: _createVNode(CloseCircleFilled, null, null),
  warning: _createVNode(ExclamationCircleFilled, null, null),
  loading: _createVNode(LoadingOutlined, null, null)
};
export const PureContent = defineComponent({
  name: 'PureContent',
  inheritAttrs: false,
  props: ['prefixCls', 'type', 'icon'],
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return _createVNode("div", {
        "class": classNames(`${props.prefixCls}-custom-content`, `${props.prefixCls}-${props.type}`)
      }, [props.icon || TypeIcon[props.type], _createVNode("span", null, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
    };
  }
});
/** @private Internal Component. Do not use in your production. */
export default defineComponent({
  name: 'PurePanel',
  inheritAttrs: false,
  props: ['prefixCls', 'class', 'type', 'icon', 'content'],
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    var _a;
    const {
      getPrefixCls
    } = useConfigContextInject();
    const prefixCls = computed(() => props.prefixCls || getPrefixCls('message'));
    const [, hashId] = useStyle(prefixCls);
    return _createVNode(Notice, _objectSpread(_objectSpread({}, attrs), {}, {
      "prefixCls": prefixCls.value,
      "class": classNames(hashId.value, `${prefixCls.value}-notice-pure-panel`),
      "noticeKey": "pure",
      "duration": null
    }), {
      default: () => [_createVNode(PureContent, {
        "prefixCls": prefixCls.value,
        "type": props.type,
        "icon": props.icon
      }, {
        default: () => [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]
      })]
    });
  }
});