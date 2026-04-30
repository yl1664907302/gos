import { createVNode as _createVNode } from "vue";
import PropTypes from '../_util/vue-types';
import classNames from '../_util/classNames';
import DeleteOutlined from "@ant-design/icons-vue/es/icons/DeleteOutlined";
import defaultLocale from '../locale/en_US';
import Checkbox from '../checkbox';
import TransButton from '../_util/transButton';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import { defineComponent } from 'vue';
import { booleanType } from '../_util/type';
function noop() {}
export const transferListItemProps = {
  renderedText: PropTypes.any,
  renderedEl: PropTypes.any,
  item: PropTypes.any,
  checked: booleanType(),
  prefixCls: String,
  disabled: booleanType(),
  showRemove: booleanType(),
  onClick: Function,
  onRemove: Function
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ListItem',
  inheritAttrs: false,
  props: transferListItemProps,
  emits: ['click', 'remove'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    return () => {
      const {
        renderedText,
        renderedEl,
        item,
        checked,
        disabled,
        prefixCls,
        showRemove
      } = props;
      const className = classNames({
        [`${prefixCls}-content-item`]: true,
        [`${prefixCls}-content-item-disabled`]: disabled || item.disabled
      });
      let title;
      if (typeof renderedText === 'string' || typeof renderedText === 'number') {
        title = String(renderedText);
      }
      return _createVNode(LocaleReceiver, {
        "componentName": "Transfer",
        "defaultLocale": defaultLocale.Transfer
      }, {
        default: transferLocale => {
          const labelNode = _createVNode("span", {
            "class": `${prefixCls}-content-item-text`
          }, [renderedEl]);
          if (showRemove) {
            return _createVNode("li", {
              "class": className,
              "title": title
            }, [labelNode, _createVNode(TransButton, {
              "disabled": disabled || item.disabled,
              "class": `${prefixCls}-content-item-remove`,
              "aria-label": transferLocale.remove,
              "onClick": () => {
                emit('remove', item);
              }
            }, {
              default: () => [_createVNode(DeleteOutlined, null, null)]
            })]);
          }
          return _createVNode("li", {
            "class": className,
            "title": title,
            "onClick": disabled || item.disabled ? noop : () => {
              emit('click', item);
            }
          }, [_createVNode(Checkbox, {
            "class": `${prefixCls}-checkbox`,
            "checked": checked,
            "disabled": disabled || item.disabled
          }, null), labelNode]);
        }
      });
    };
  }
});