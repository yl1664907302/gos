"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "buttonProps", {
  enumerable: true,
  get: function () {
    return _buttonTypes.default;
  }
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _wave = _interopRequireDefault(require("../_util/wave"));
var _buttonTypes = _interopRequireDefault(require("./buttonTypes"));
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _DisabledContext = require("../config-provider/DisabledContext");
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _LoadingIcon = _interopRequireDefault(require("./LoadingIcon"));
var _style = _interopRequireDefault(require("./style"));
var _buttonGroup = require("./button-group");
var _Compact = require("../space/Compact");
const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);
function isUnBorderedButtonType(type) {
  return type === 'text' || type === 'link';
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AButton',
  inheritAttrs: false,
  __ANT_BUTTON: true,
  props: (0, _propsUtil.initDefaultProps)((0, _buttonTypes.default)(), {
    type: 'default'
  }),
  slots: Object,
  // emits: ['click', 'mousedown'],
  setup(props, _ref) {
    let {
      slots,
      attrs,
      emit,
      expose
    } = _ref;
    const {
      prefixCls,
      autoInsertSpaceInButton,
      direction,
      size
    } = (0, _useConfigInject.default)('btn', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const groupSizeContext = _buttonGroup.GroupSizeContext.useInject();
    const disabledContext = (0, _DisabledContext.useInjectDisabled)();
    const mergedDisabled = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.disabled) !== null && _a !== void 0 ? _a : disabledContext.value;
    });
    const buttonNodeRef = (0, _vue.shallowRef)(null);
    const delayTimeoutRef = (0, _vue.shallowRef)(undefined);
    let isNeedInserted = false;
    const innerLoading = (0, _vue.shallowRef)(false);
    const hasTwoCNChar = (0, _vue.shallowRef)(false);
    const autoInsertSpace = (0, _vue.computed)(() => autoInsertSpaceInButton.value !== false);
    const {
      compactSize,
      compactItemClassnames
    } = (0, _Compact.useCompactItemContext)(prefixCls, direction);
    // =============== Update Loading ===============
    const loadingOrDelay = (0, _vue.computed)(() => typeof props.loading === 'object' && props.loading.delay ? props.loading.delay || true : !!props.loading);
    (0, _vue.watch)(loadingOrDelay, val => {
      clearTimeout(delayTimeoutRef.value);
      if (typeof loadingOrDelay.value === 'number') {
        delayTimeoutRef.value = setTimeout(() => {
          innerLoading.value = val;
        }, loadingOrDelay.value);
      } else {
        innerLoading.value = val;
      }
    }, {
      immediate: true
    });
    const classes = (0, _vue.computed)(() => {
      const {
        type,
        shape = 'default',
        ghost,
        block,
        danger
      } = props;
      const pre = prefixCls.value;
      const sizeClassNameMap = {
        large: 'lg',
        small: 'sm',
        middle: undefined
      };
      const sizeFullname = compactSize.value || (groupSizeContext === null || groupSizeContext === void 0 ? void 0 : groupSizeContext.size) || size.value;
      const sizeCls = sizeFullname ? sizeClassNameMap[sizeFullname] || '' : '';
      return [compactItemClassnames.value, {
        [hashId.value]: true,
        [`${pre}`]: true,
        [`${pre}-${shape}`]: shape !== 'default' && shape,
        [`${pre}-${type}`]: type,
        [`${pre}-${sizeCls}`]: sizeCls,
        [`${pre}-loading`]: innerLoading.value,
        [`${pre}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
        [`${pre}-two-chinese-chars`]: hasTwoCNChar.value && autoInsertSpace.value,
        [`${pre}-block`]: block,
        [`${pre}-dangerous`]: !!danger,
        [`${pre}-rtl`]: direction.value === 'rtl'
      }];
    });
    const fixTwoCNChar = () => {
      // Fix for HOC usage like <FormatMessage />
      const node = buttonNodeRef.value;
      if (!node || autoInsertSpaceInButton.value === false) {
        return;
      }
      const buttonText = node.textContent;
      if (isNeedInserted && isTwoCNChar(buttonText)) {
        if (!hasTwoCNChar.value) {
          hasTwoCNChar.value = true;
        }
      } else if (hasTwoCNChar.value) {
        hasTwoCNChar.value = false;
      }
    };
    const handleClick = event => {
      // https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || mergedDisabled.value) {
        event.preventDefault();
        return;
      }
      emit('click', event);
    };
    const handleMousedown = event => {
      emit('mousedown', event);
    };
    const insertSpace = (child, needInserted) => {
      const SPACE = needInserted ? ' ' : '';
      if (child.type === _vue.Text) {
        let text = child.children.trim();
        if (isTwoCNChar(text)) {
          text = text.split('').join(SPACE);
        }
        return (0, _vue.createVNode)("span", null, [text]);
      }
      return child;
    };
    (0, _vue.watchEffect)(() => {
      (0, _devWarning.default)(!(props.ghost && isUnBorderedButtonType(props.type)), 'Button', "`link` or `text` button can't be a `ghost` button.");
    });
    (0, _vue.onMounted)(fixTwoCNChar);
    (0, _vue.onUpdated)(fixTwoCNChar);
    (0, _vue.onBeforeUnmount)(() => {
      delayTimeoutRef.value && clearTimeout(delayTimeoutRef.value);
    });
    const focus = () => {
      var _a;
      (_a = buttonNodeRef.value) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const blur = () => {
      var _a;
      (_a = buttonNodeRef.value) === null || _a === void 0 ? void 0 : _a.blur();
    };
    expose({
      focus,
      blur
    });
    return () => {
      var _a, _b;
      const {
        icon = (_a = slots.icon) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = props;
      const children = (0, _propsUtil.flattenChildren)((_b = slots.default) === null || _b === void 0 ? void 0 : _b.call(slots));
      isNeedInserted = children.length === 1 && !icon && !isUnBorderedButtonType(props.type);
      const {
        type,
        htmlType,
        href,
        title,
        target
      } = props;
      const iconType = innerLoading.value ? 'loading' : icon;
      const buttonProps = (0, _extends2.default)((0, _extends2.default)({}, attrs), {
        title,
        disabled: mergedDisabled.value,
        class: [classes.value, attrs.class, {
          [`${prefixCls.value}-icon-only`]: children.length === 0 && !!iconType
        }],
        onClick: handleClick,
        onMousedown: handleMousedown
      });
      // https://github.com/vueComponent/ant-design-vue/issues/4930
      if (!mergedDisabled.value) {
        delete buttonProps.disabled;
      }
      const iconNode = icon && !innerLoading.value ? icon : (0, _vue.createVNode)(_LoadingIcon.default, {
        "existIcon": !!icon,
        "prefixCls": prefixCls.value,
        "loading": !!innerLoading.value
      }, null);
      const kids = children.map(child => insertSpace(child, isNeedInserted && autoInsertSpace.value));
      if (href !== undefined) {
        return wrapSSR((0, _vue.createVNode)("a", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, buttonProps), {}, {
          "href": href,
          "target": target,
          "ref": buttonNodeRef
        }), [iconNode, kids]));
      }
      let buttonNode = (0, _vue.createVNode)("button", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, buttonProps), {}, {
        "ref": buttonNodeRef,
        "type": htmlType
      }), [iconNode, kids]);
      if (!isUnBorderedButtonType(type)) {
        const _buttonNode = function () {
          return buttonNode;
        }();
        buttonNode = (0, _vue.createVNode)(_wave.default, {
          "ref": "wave",
          "disabled": !!innerLoading.value
        }, {
          default: () => [_buttonNode]
        });
      }
      return wrapSSR(buttonNode);
    };
  }
});