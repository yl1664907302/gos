"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "collapseProps", {
  enumerable: true,
  get: function () {
    return _commonProps.collapseProps;
  }
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _propsUtil = require("../_util/props-util");
var _vnode = require("../_util/vnode");
var _commonProps = require("./commonProps");
var _util = require("../_util/util");
var _RightOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/RightOutlined"));
var _firstNotUndefined = _interopRequireDefault(require("../_util/firstNotUndefined"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _collapseMotion = _interopRequireDefault(require("../_util/collapseMotion"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

function getActiveKeysArray(activeKey) {
  let currentActiveKey = activeKey;
  if (!Array.isArray(currentActiveKey)) {
    const activeKeyType = typeof currentActiveKey;
    currentActiveKey = activeKeyType === 'number' || activeKeyType === 'string' ? [currentActiveKey] : [];
  }
  return currentActiveKey.map(key => String(key));
}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACollapse',
  inheritAttrs: false,
  props: (0, _propsUtil.initDefaultProps)((0, _commonProps.collapseProps)(), {
    accordion: false,
    destroyInactivePanel: false,
    bordered: true,
    expandIconPosition: 'start'
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const stateActiveKey = (0, _vue.ref)(getActiveKeysArray((0, _firstNotUndefined.default)([props.activeKey, props.defaultActiveKey])));
    (0, _vue.watch)(() => props.activeKey, () => {
      stateActiveKey.value = getActiveKeysArray(props.activeKey);
    }, {
      deep: true
    });
    const {
      prefixCls,
      direction,
      rootPrefixCls
    } = (0, _useConfigInject.default)('collapse', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const iconPosition = (0, _vue.computed)(() => {
      const {
        expandIconPosition
      } = props;
      if (expandIconPosition !== undefined) {
        return expandIconPosition;
      }
      return direction.value === 'rtl' ? 'end' : 'start';
    });
    const renderExpandIcon = panelProps => {
      const {
        expandIcon = slots.expandIcon
      } = props;
      const icon = expandIcon ? expandIcon(panelProps) : (0, _vue.createVNode)(_RightOutlined.default, {
        "rotate": panelProps.isActive ? 90 : undefined
      }, null);
      return (0, _vue.createVNode)("div", {
        "class": [`${prefixCls.value}-expand-icon`, hashId.value],
        "onClick": () => ['header', 'icon'].includes(props.collapsible) && onClickItem(panelProps.panelKey)
      }, [(0, _propsUtil.isValidElement)(Array.isArray(expandIcon) ? icon[0] : icon) ? (0, _vnode.cloneElement)(icon, {
        class: `${prefixCls.value}-arrow`
      }, false) : icon]);
    };
    const setActiveKey = activeKey => {
      if (props.activeKey === undefined) {
        stateActiveKey.value = activeKey;
      }
      const newKey = props.accordion ? activeKey[0] : activeKey;
      emit('update:activeKey', newKey);
      emit('change', newKey);
    };
    const onClickItem = key => {
      let activeKey = stateActiveKey.value;
      if (props.accordion) {
        activeKey = activeKey[0] === key ? [] : [key];
      } else {
        activeKey = [...activeKey];
        const index = activeKey.indexOf(key);
        const isActive = index > -1;
        if (isActive) {
          // remove active state
          activeKey.splice(index, 1);
        } else {
          activeKey.push(key);
        }
      }
      setActiveKey(activeKey);
    };
    const getNewChild = (child, index) => {
      var _a, _b, _c;
      if ((0, _propsUtil.isEmptyElement)(child)) return;
      const activeKey = stateActiveKey.value;
      const {
        accordion,
        destroyInactivePanel,
        collapsible,
        openAnimation
      } = props;
      const animation = openAnimation || (0, _collapseMotion.default)(`${rootPrefixCls.value}-motion-collapse`);
      // If there is no key provide, use the panel order as default key
      const key = String((_a = child.key) !== null && _a !== void 0 ? _a : index);
      const {
        header = (_c = (_b = child.children) === null || _b === void 0 ? void 0 : _b.header) === null || _c === void 0 ? void 0 : _c.call(_b),
        headerClass,
        collapsible: childCollapsible,
        disabled
      } = child.props || {};
      let isActive = false;
      if (accordion) {
        isActive = activeKey[0] === key;
      } else {
        isActive = activeKey.indexOf(key) > -1;
      }
      let mergeCollapsible = childCollapsible !== null && childCollapsible !== void 0 ? childCollapsible : collapsible;
      // legacy 2.x
      if (disabled || disabled === '') {
        mergeCollapsible = 'disabled';
      }
      const newProps = {
        key,
        panelKey: key,
        header,
        headerClass,
        isActive,
        prefixCls: prefixCls.value,
        destroyInactivePanel,
        openAnimation: animation,
        accordion,
        onItemClick: mergeCollapsible === 'disabled' ? null : onClickItem,
        expandIcon: renderExpandIcon,
        collapsible: mergeCollapsible
      };
      return (0, _vnode.cloneElement)(child, newProps);
    };
    const getItems = () => {
      var _a;
      return (0, _propsUtil.flattenChildren)((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)).map(getNewChild);
    };
    return () => {
      const {
        accordion,
        bordered,
        ghost
      } = props;
      const collapseClassName = (0, _classNames.default)(prefixCls.value, {
        [`${prefixCls.value}-borderless`]: !bordered,
        [`${prefixCls.value}-icon-position-${iconPosition.value}`]: true,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [`${prefixCls.value}-ghost`]: !!ghost,
        [attrs.class]: !!attrs.class
      }, hashId.value);
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "class": collapseClassName
      }, (0, _util.getDataAndAriaProps)(attrs)), {}, {
        "style": attrs.style,
        "role": accordion ? 'tablist' : null
      }), [getItems()]));
    };
  }
});