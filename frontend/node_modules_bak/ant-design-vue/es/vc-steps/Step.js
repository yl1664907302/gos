import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import PropTypes, { withUndefined } from '../_util/vue-types';
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { booleanType, stringType, functionType } from '../_util/type';
import omit from '../_util/omit';
function isString(str) {
  return typeof str === 'string';
}
function noop() {}
export const VcStepProps = () => ({
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
  status: stringType(),
  iconPrefix: String,
  icon: PropTypes.any,
  adjustMarginRight: String,
  stepNumber: Number,
  stepIndex: Number,
  description: PropTypes.any,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  progressDot: withUndefined(PropTypes.oneOfType([PropTypes.looseBool, PropTypes.func])),
  tailContent: PropTypes.any,
  icons: PropTypes.shape({
    finish: PropTypes.any,
    error: PropTypes.any
  }).loose,
  onClick: functionType(),
  onStepClick: functionType(),
  stepIcon: functionType(),
  itemRender: functionType(),
  __legacy: booleanType()
});
export default defineComponent({
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
      const iconClassName = classNames(`${prefixCls}-icon`, `${iconPrefix}icon`, {
        [`${iconPrefix}icon-${icon}`]: icon && isString(icon),
        [`${iconPrefix}icon-check`]: !icon && status === 'finish' && (icons && !icons.finish || !icons),
        [`${iconPrefix}icon-cross`]: !icon && status === 'error' && (icons && !icons.error || !icons)
      });
      const iconDot = _createVNode("span", {
        "class": `${prefixCls}-icon-dot`
      }, null);
      // `progressDot` enjoy the highest priority
      if (progressDot) {
        if (typeof progressDot === 'function') {
          iconNode = _createVNode("span", {
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
          iconNode = _createVNode("span", {
            "class": `${prefixCls}-icon`
          }, [iconDot]);
        }
      } else if (icon && !isString(icon)) {
        iconNode = _createVNode("span", {
          "class": `${prefixCls}-icon`
        }, [icon]);
      } else if (icons && icons.finish && status === 'finish') {
        iconNode = _createVNode("span", {
          "class": `${prefixCls}-icon`
        }, [icons.finish]);
      } else if (icons && icons.error && status === 'error') {
        iconNode = _createVNode("span", {
          "class": `${prefixCls}-icon`
        }, [icons.error]);
      } else if (icon || status === 'finish' || status === 'error') {
        iconNode = _createVNode("span", {
          "class": iconClassName
        }, null);
      } else {
        iconNode = _createVNode("span", {
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
      const classString = classNames(`${prefixCls}-item`, `${prefixCls}-item-${mergedStatus}`, {
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
      const stepNode = _createVNode("div", _objectSpread(_objectSpread({}, omit(attrs, ['__legacy'])), {}, {
        "class": [classString, attrs.class],
        "style": [attrs.style, stepItemStyle]
      }), [_createVNode("div", _objectSpread(_objectSpread({}, accessibilityProps), {}, {
        "class": `${prefixCls}-item-container`
      }), [_createVNode("div", {
        "class": `${prefixCls}-item-tail`
      }, [tailContent]), _createVNode("div", {
        "class": `${prefixCls}-item-icon`
      }, [renderIconNode({
        icon,
        title,
        description
      })]), _createVNode("div", {
        "class": `${prefixCls}-item-content`
      }, [_createVNode("div", {
        "class": `${prefixCls}-item-title`
      }, [title, subTitle && _createVNode("div", {
        "title": typeof subTitle === 'string' ? subTitle : undefined,
        "class": `${prefixCls}-item-subtitle`
      }, [subTitle])]), description && _createVNode("div", {
        "class": `${prefixCls}-item-description`
      }, [description])])])]);
      if (props.itemRender) {
        return props.itemRender(stepNode);
      }
      return stepNode;
    };
  }
});