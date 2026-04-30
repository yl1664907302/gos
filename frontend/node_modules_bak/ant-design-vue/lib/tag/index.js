"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CheckableTag", {
  enumerable: true,
  get: function () {
    return _CheckableTag.default;
  }
});
exports.tagProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _CloseOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/CloseOutlined"));
var _wave = _interopRequireDefault(require("../_util/wave"));
var _colors = require("../_util/colors");
var _type = require("../_util/type");
var _CheckableTag = _interopRequireDefault(require("./CheckableTag"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _style = _interopRequireDefault(require("./style"));
const tagProps = () => ({
  prefixCls: String,
  color: {
    type: String
  },
  closable: {
    type: Boolean,
    default: false
  },
  closeIcon: _vueTypes.default.any,
  /** @deprecated `visible` will be removed in next major version. */
  visible: {
    type: Boolean,
    default: undefined
  },
  onClose: {
    type: Function
  },
  onClick: (0, _type.eventType)(),
  'onUpdate:visible': Function,
  icon: _vueTypes.default.any,
  bordered: {
    type: Boolean,
    default: true
  }
});
exports.tagProps = tagProps;
const Tag = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATag',
  inheritAttrs: false,
  props: tagProps(),
  // emits: ['update:visible', 'close'],
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('tag', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const visible = (0, _vue.shallowRef)(true);
    // Warning for deprecated usage
    if (process.env.NODE_ENV !== 'production') {
      (0, _warning.default)(props.visible === undefined, 'Tag', '`visible` is deprecated, please use `<Tag v-show="visible" />` instead.');
    }
    (0, _vue.watchEffect)(() => {
      if (props.visible !== undefined) {
        visible.value = props.visible;
      }
    });
    const handleCloseClick = e => {
      e.stopPropagation();
      emit('update:visible', false);
      emit('close', e);
      if (e.defaultPrevented) {
        return;
      }
      if (props.visible === undefined) {
        visible.value = false;
      }
    };
    // const isPresetColor = computed(() => {
    //   const { color } = props;
    //   if (!color) {
    //     return false;
    //   }
    //   return PresetColorRegex.test(color) || PresetStatusColorRegex.test(color);
    // });
    const isInternalColor = (0, _vue.computed)(() => (0, _colors.isPresetColor)(props.color) || (0, _colors.isPresetStatusColor)(props.color));
    const tagClassName = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, hashId.value, {
      [`${prefixCls.value}-${props.color}`]: isInternalColor.value,
      [`${prefixCls.value}-has-color`]: props.color && !isInternalColor.value,
      [`${prefixCls.value}-hidden`]: !visible.value,
      [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
      [`${prefixCls.value}-borderless`]: !props.bordered
    }));
    const handleClick = e => {
      emit('click', e);
    };
    return () => {
      var _a, _b, _c;
      const {
        icon = (_a = slots.icon) === null || _a === void 0 ? void 0 : _a.call(slots),
        color,
        closeIcon = (_b = slots.closeIcon) === null || _b === void 0 ? void 0 : _b.call(slots),
        closable = false
      } = props;
      const renderCloseIcon = () => {
        if (closable) {
          return closeIcon ? (0, _vue.createVNode)("span", {
            "class": `${prefixCls.value}-close-icon`,
            "onClick": handleCloseClick
          }, [closeIcon]) : (0, _vue.createVNode)(_CloseOutlined.default, {
            "class": `${prefixCls.value}-close-icon`,
            "onClick": handleCloseClick
          }, null);
        }
        return null;
      };
      const tagStyle = {
        backgroundColor: color && !isInternalColor.value ? color : undefined
      };
      const iconNode = icon || null;
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      const kids = iconNode ? (0, _vue.createVNode)(_vue.Fragment, null, [iconNode, (0, _vue.createVNode)("span", null, [children])]) : children;
      const isNeedWave = props.onClick !== undefined;
      const tagNode = (0, _vue.createVNode)("span", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "onClick": handleClick,
        "class": [tagClassName.value, attrs.class],
        "style": [tagStyle, attrs.style]
      }), [kids, renderCloseIcon()]);
      return wrapSSR(isNeedWave ? (0, _vue.createVNode)(_wave.default, null, {
        default: () => [tagNode]
      }) : tagNode);
    };
  }
});
Tag.CheckableTag = _CheckableTag.default;
Tag.install = function (app) {
  app.component(Tag.name, Tag);
  app.component(_CheckableTag.default.name, _CheckableTag.default);
  return app;
};
var _default = exports.default = Tag;