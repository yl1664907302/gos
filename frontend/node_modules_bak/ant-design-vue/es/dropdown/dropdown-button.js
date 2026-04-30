import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { computed, defineComponent } from 'vue';
import Button from '../button';
import Dropdown from './dropdown';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import { dropdownButtonProps } from './props';
import EllipsisOutlined from "@ant-design/icons-vue/es/icons/EllipsisOutlined";
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
const ButtonGroup = Button.Group;
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADropdownButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: initDefaultProps(dropdownButtonProps(), {
    trigger: 'hover',
    placement: 'bottomRight',
    type: 'default'
  }),
  // emits: ['click', 'visibleChange', 'update:visible'],s
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit
    } = _ref;
    const handleVisibleChange = val => {
      emit('update:visible', val);
      emit('visibleChange', val);
      emit('update:open', val);
      emit('openChange', val);
    };
    const {
      prefixCls,
      direction,
      getPopupContainer
    } = useConfigInject('dropdown', props);
    const buttonPrefixCls = computed(() => `${prefixCls.value}-button`);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      var _a, _b;
      const _c = _extends(_extends({}, props), attrs),
        {
          type = 'default',
          disabled,
          danger,
          loading,
          htmlType,
          class: className = '',
          overlay = (_a = slots.overlay) === null || _a === void 0 ? void 0 : _a.call(slots),
          trigger,
          align,
          open,
          visible,
          onVisibleChange: _onVisibleChange,
          placement = direction.value === 'rtl' ? 'bottomLeft' : 'bottomRight',
          href,
          title,
          icon = ((_b = slots.icon) === null || _b === void 0 ? void 0 : _b.call(slots)) || _createVNode(EllipsisOutlined, null, null),
          mouseEnterDelay,
          mouseLeaveDelay,
          overlayClassName,
          overlayStyle,
          destroyPopupOnHide,
          onClick,
          'onUpdate:open': _updateVisible
        } = _c,
        restProps = __rest(_c, ["type", "disabled", "danger", "loading", "htmlType", "class", "overlay", "trigger", "align", "open", "visible", "onVisibleChange", "placement", "href", "title", "icon", "mouseEnterDelay", "mouseLeaveDelay", "overlayClassName", "overlayStyle", "destroyPopupOnHide", "onClick", 'onUpdate:open']);
      const dropdownProps = {
        align,
        disabled,
        trigger: disabled ? [] : trigger,
        placement,
        getPopupContainer: getPopupContainer === null || getPopupContainer === void 0 ? void 0 : getPopupContainer.value,
        onOpenChange: handleVisibleChange,
        mouseEnterDelay,
        mouseLeaveDelay,
        open: open !== null && open !== void 0 ? open : visible,
        overlayClassName,
        overlayStyle,
        destroyPopupOnHide
      };
      const leftButton = _createVNode(Button, {
        "danger": danger,
        "type": type,
        "disabled": disabled,
        "loading": loading,
        "onClick": onClick,
        "htmlType": htmlType,
        "href": href,
        "title": title
      }, {
        default: slots.default
      });
      const rightButton = _createVNode(Button, {
        "danger": danger,
        "type": type,
        "icon": icon
      }, null);
      return wrapSSR(_createVNode(ButtonGroup, _objectSpread(_objectSpread({}, restProps), {}, {
        "class": classNames(buttonPrefixCls.value, className, hashId.value)
      }), {
        default: () => [slots.leftButton ? slots.leftButton({
          button: leftButton
        }) : leftButton, _createVNode(Dropdown, dropdownProps, {
          default: () => [slots.rightButton ? slots.rightButton({
            button: rightButton
          }) : rightButton],
          overlay: () => overlay
        })]
      }));
    };
  }
});