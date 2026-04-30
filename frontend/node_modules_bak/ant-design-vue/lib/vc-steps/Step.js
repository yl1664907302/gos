"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.VcStepProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireWildcard(require("../_util/vue-types"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _type = require("../_util/type");
var _omit = _interopRequireDefault(require("../_util/omit"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function isString(str) {
  return typeof str === 'string';
}
function noop() {}
const VcStepProps = () => ({
  prefixCls: String,
  itemWidth: String,
  active: {
    type: Boolean,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: undefined
  },
  status: (0, _type.stringType)(),
  iconPrefix: String,
  icon: _vueTypes.default.any,
  adjustMarginRight: String,
  stepNumber: Number,
  stepIndex: Number,
  description: _vueTypes.default.any,
  title: _vueTypes.default.any,
  subTitle: _vueTypes.default.any,
  progressDot: (0, _vueTypes.withUndefined)(_vueTypes.default.oneOfType([_vueTypes.default.looseBool, _vueTypes.default.func])),
  tailContent: _vueTypes.default.any,
  icons: _vueTypes.default.shape({
    finish: _vueTypes.default.any,
    error: _vueTypes.default.any
  }).loose,
  onClick: (0, _type.functionType)(),
  onStepClick: (0, _type.functionType)(),
  stepIcon: (0, _type.functionType)(),
  itemRender: (0, _type.functionType)(),
  __legacy: (0, _type.booleanType)()
});
exports.VcStepProps = VcStepProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Step',
  inheritAttrs: false,
  props: VcStepProps(),
  setup(props, _ref) {
    let {
      slots,
      emit,
      attrs
    } = _ref;
    const onItemClick = e => {
      emit('click', e);
      emit('stepClick', props.stepIndex);
    };
    // if (props.__legacy !== false) {
    //   warning(
    //     false,
    //     'Steps',
    //     'Step is deprecated, and not support inline type. Please use `items` directly. ',
    //   );
    // }
    const renderIconNode = _ref2 => {
      let {
        icon,
        title,
        description
      } = _ref2;
      const {
        prefixCls,
        stepNumber,
        status,
        iconPrefix,
        icons,
        progressDot = slots.progressDot,
        stepIcon = slots.stepIcon
      } = props;
      let iconNode;
      const iconClassName = (0, _classNames.default)(`${prefixCls}-icon`, `${iconPrefix}icon`, {
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish' && (icons && !icons.finish || !icons),
        [`${iconPrefix}icon-cross`]: !icon && status === 'error' && (icons && !icons.error || !icons)
      });
      const iconDot = (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-icon-dot`
      }, null);
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-icon`
          }, [progressDot({
            iconDot,
            index: stepNumber - 1,
            status,
            title,
            description,
            prefixCls
          })]);
        } else {
          iconNode = (0, _vue.createVNode)("span", {
            "class": `${prefixCls}-icon`
          }, [iconDot]);
        }
      } else if (icon && !isString(icon)) {
        iconNode = (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-icon`
        }, [icon]);
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-icon`
        }, [icons.finish]);
      } else if (icons && icons.error && status === 'error') {
        iconNode = (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-icon`
        }, [icons.error]);
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = (0, _vue.createVNode)("span", {
          "class": iconClassName
        }, null);
      } else {
        iconNode = (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-icon`
        }, [stepNumber]);
      }
      if (stepIcon) {
        iconNode = stepIcon({
          index: stepNumber - 1,
          status,
          title,
          description,
          node: iconNode
        });
      }
      return iconNode;
    };
    return () => {
      var _a, _b, _c, _d;
      const {
        prefixCls,
        itemWidth,
        active,
        status = 'wait',
        tailContent,
        adjustMarginRight,
        disabled,
        title = (_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots),
        description = (_b = slots.description) === null || _b === void 0 ? void 0 : _b.call(slots),
        subTitle = (_c = slots.subTitle) === null || _c === void 0 ? void 0 : _c.call(slots),
        icon = (_d = slots.icon) === null || _d === void 0 ? void 0 : _d.call(slots),
        onClick,
        onStepClick
      } = props;
      const mergedStatus = status || 'wait';
      const classString = (0, _classNames.default)(`${prefixCls}-item`, `${prefixCls}-item-${mergedStatus}`, {
        [`${prefixCls}-item-custom`]: icon,
        [`${prefixCls}-item-active`]: active,
        [`${prefixCls}-item-disabled`]: disabled === true
      });
      const stepItemStyle = {};
      if (itemWidth) {
        stepItemStyle.width = itemWidth;
      }
      if (adjustMarginRight) {
        stepItemStyle.marginRight = adjustMarginRight;
      }
      const accessibilityProps = {
        onClick: onClick || noop
      };
      if (onStepClick && !disabled) {
        accessibilityProps.role = 'button';
        accessibilityProps.tabindex = 0;
        accessibilityProps.onClick = onItemClick;
      }
      const stepNode = (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(attrs, ['__legacy'])), {}, {
        "class": [classString, attrs.class],
        "style": [attrs.style, stepItemStyle]
      }), [(0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, accessibilityProps), {}, {
        "class": `${prefixCls}-item-container`
      }), [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-item-tail`
      }, [tailContent]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-item-icon`
      }, [renderIconNode({
        icon,
        title,
        description
      })]), (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-item-content`
      }, [(0, _vue.createVNode)("div", {
        "class": `${prefixCls}-item-title`
      }, [title, subTitle && (0, _vue.createVNode)("div", {
        "title": typeof subTitle === 'string' ? subTitle : undefined,
        "class": `${prefixCls}-item-subtitle`
      }, [subTitle])]), description && (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-item-description`
      }, [description])])])]);
      if (props.itemRender) {
        return props.itemRender(stepNode);
      }
      return stepNode;
    };
  }
});