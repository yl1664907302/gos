"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferListItemProps = exports.default = void 0;
var _vue = require("vue");
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _DeleteOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/DeleteOutlined"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _checkbox = _interopRequireDefault(require("../checkbox"));
var _transButton = _interopRequireDefault(require("../_util/transButton"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _type = require("../_util/type");
function noop() {}
const transferListItemProps = exports.transferListItemProps = {
  renderedText: _vueTypes.default.any,
  renderedEl: _vueTypes.default.any,
  item: _vueTypes.default.any,
  checked: (0, _type.booleanType)(),
  prefixCls: String,
  disabled: (0, _type.booleanType)(),
  showRemove: (0, _type.booleanType)(),
  onClick: Function,
  onRemove: Function
};
var _default = exports.default = (0, _vue.defineComponent)({
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
      const className = (0, _classNames.default)({
        [`${prefixCls}-content-item`]: true,
        [`${prefixCls}-content-item-disabled`]: disabled || item.disabled
      });
      let title;
      if (typeof renderedText === 'string' || typeof renderedText === 'number') {
        title = String(renderedText);
      }
      return (0, _vue.createVNode)(_LocaleReceiver.default, {
        "componentName": "Transfer",
        "defaultLocale": _en_US.default.Transfer
      }, {
        default: transferLocale => {
          const labelNode = (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-content-item-text`
          }, [renderedEl]);
          if (showRemove) {
            return (0, _vue.createVNode)("li", {
              "class": className,
              "title": title
            }, [labelNode, (0, _vue.createVNode)(_transButton.default, {
              "disabled": disabled || item.disabled,
              "class": `${prefixCls}-content-item-remove`,
              "aria-label": transferLocale.remove,
              "onClick": () => {
                emit('remove', item);
              }
            }, {
              default: () => [(0, _vue.createVNode)(_DeleteOutlined.default, null, null)]
            })]);
          }
          return (0, _vue.createVNode)("li", {
            "class": className,
            "title": title,
            "onClick": disabled || item.disabled ? noop : () => {
              emit('click', item);
            }
          }, [(0, _vue.createVNode)(_checkbox.default, {
            "class": `${prefixCls}-checkbox`,
            "checked": checked,
            "disabled": disabled || item.disabled
          }, null), labelNode]);
        }
      });
    };
  }
});