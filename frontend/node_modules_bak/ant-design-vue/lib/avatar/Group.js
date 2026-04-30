"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.groupProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vnode = require("../_util/vnode");
var _Avatar = _interopRequireDefault(require("./Avatar"));
var _popover = _interopRequireDefault(require("../popover"));
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var _AvatarContext = require("./AvatarContext");
const groupProps = () => ({
  prefixCls: String,
  maxCount: Number,
  maxStyle: {
    type: Object,
    default: undefined
  },
  maxPopoverPlacement: {
    type: String,
    default: 'top'
  },
  maxPopoverTrigger: String,
  /*
   * Size of avatar, options: `large`, `small`, `default`
   * or a custom number size
   * */
  size: {
    type: [Number, String, Object],
    default: 'default'
  },
  shape: {
    type: String,
    default: 'circle'
  }
});
exports.groupProps = groupProps;
const Group = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AAvatarGroup',
  inheritAttrs: false,
  props: groupProps(),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('avatar', props);
    const groupPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-group`);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    (0, _vue.watchEffect)(() => {
      const context = {
        size: props.size,
        shape: props.shape
      };
      (0, _AvatarContext.useAvatarProviderContext)(context);
    });
    return () => {
      const {
        maxPopoverPlacement = 'top',
        maxCount,
        maxStyle,
        maxPopoverTrigger = 'hover',
        shape
      } = props;
      const cls = {
        [groupPrefixCls.value]: true,
        [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${attrs.class}`]: !!attrs.class,
        [hashId.value]: true
      };
      const children = (0, _propsUtil.getPropsSlot)(slots, props);
      const childrenWithProps = (0, _propsUtil.flattenChildren)(children).map((child, index) => (0, _vnode.cloneElement)(child, {
        key: `avatar-key-${index}`
      }));
      const numOfChildren = childrenWithProps.length;
      if (maxCount && maxCount < numOfChildren) {
        const childrenShow = childrenWithProps.slice(0, maxCount);
        const childrenHidden = childrenWithProps.slice(maxCount, numOfChildren);
        childrenShow.push((0, _vue.createVNode)(_popover.default, {
          "key": "avatar-popover-key",
          "content": childrenHidden,
          "trigger": maxPopoverTrigger,
          "placement": maxPopoverPlacement,
          "overlayClassName": `${groupPrefixCls.value}-popover`
        }, {
          default: () => [(0, _vue.createVNode)(_Avatar.default, {
            "style": maxStyle,
            "shape": shape
          }, {
            default: () => [`+${numOfChildren - maxCount}`]
          })]
        }));
        return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "class": cls,
          "style": attrs.style
        }), [childrenShow]));
      }
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": cls,
        "style": attrs.style
      }), [childrenWithProps]));
    };
  }
});
var _default = exports.default = Group;