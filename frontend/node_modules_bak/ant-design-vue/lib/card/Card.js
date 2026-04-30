"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.cardProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _tabs = _interopRequireDefault(require("../tabs"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _style = _interopRequireDefault(require("./style"));
var _skeleton = _interopRequireDefault(require("../skeleton"));
var _vnode = require("../_util/vnode");
const {
  TabPane
} = _tabs.default;
const cardProps = () => ({
  prefixCls: String,
  title: _vueTypes.default.any,
  extra: _vueTypes.default.any,
  bordered: {
    type: Boolean,
    default: true
  },
  bodyStyle: {
    type: Object,
    default: undefined
  },
  headStyle: {
    type: Object,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: false
  },
  hoverable: {
    type: Boolean,
    default: false
  },
  type: {
    type: String
  },
  size: {
    type: String
  },
  actions: _vueTypes.default.any,
  tabList: {
    type: Array
  },
  tabBarExtraContent: _vueTypes.default.any,
  activeTabKey: String,
  defaultActiveTabKey: String,
  cover: _vueTypes.default.any,
  onTabChange: {
    type: Function
  }
});
exports.cardProps = cardProps;
const Card = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACard',
  inheritAttrs: false,
  props: cardProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction,
      size
    } = (0, _useConfigInject.default)('card', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const getAction = actions => {
      const actionList = actions.map((action, index) => (0, _vue.isVNode)(action) && !(0, _propsUtil.isEmptyElement)(action) || !(0, _vue.isVNode)(action) ? (0, _vue.createVNode)("li", {
        "style": {
          width: `${100 / actions.length}%`
        },
        "key": `action-${index}`
      }, [(0, _vue.createVNode)("span", null, [action])]) : null);
      return actionList;
    };
    const triggerTabChange = key => {
      var _a;
      (_a = props.onTabChange) === null || _a === void 0 ? void 0 : _a.call(props, key);
    };
    const isContainGrid = function () {
      let obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      let containGrid;
      obj.forEach(element => {
        if (element && (0, _isPlainObject.default)(element.type) && element.type.__ANT_CARD_GRID) {
          containGrid = true;
        }
      });
      return containGrid;
    };
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const {
        headStyle = {},
        bodyStyle = {},
        loading,
        bordered = true,
        type,
        tabList,
        hoverable,
        activeTabKey,
        defaultActiveTabKey,
        tabBarExtraContent = (0, _propsUtil.filterEmptyWithUndefined)((_a = slots.tabBarExtraContent) === null || _a === void 0 ? void 0 : _a.call(slots)),
        title = (0, _propsUtil.filterEmptyWithUndefined)((_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots)),
        extra = (0, _propsUtil.filterEmptyWithUndefined)((_c = slots.extra) === null || _c === void 0 ? void 0 : _c.call(slots)),
        actions = (0, _propsUtil.filterEmptyWithUndefined)((_d = slots.actions) === null || _d === void 0 ? void 0 : _d.call(slots)),
        cover = (0, _propsUtil.filterEmptyWithUndefined)((_e = slots.cover) === null || _e === void 0 ? void 0 : _e.call(slots))
      } = props;
      const children = (0, _propsUtil.flattenChildren)((_f = slots.default) === null || _f === void 0 ? void 0 : _f.call(slots));
      const pre = prefixCls.value;
      const classString = {
        [`${pre}`]: true,
        [hashId.value]: true,
        [`${pre}-loading`]: loading,
        [`${pre}-bordered`]: bordered,
        [`${pre}-hoverable`]: !!hoverable,
        [`${pre}-contain-grid`]: isContainGrid(children),
        [`${pre}-contain-tabs`]: tabList && tabList.length,
        [`${pre}-${size.value}`]: size.value,
        [`${pre}-type-${type}`]: !!type,
        [`${pre}-rtl`]: direction.value === 'rtl'
      };
      const loadingBlock = (0, _vue.createVNode)(_skeleton.default, {
        "loading": true,
        "active": true,
        "paragraph": {
          rows: 4
        },
        "title": false
      }, {
        default: () => [children]
      });
      const hasActiveTabKey = activeTabKey !== undefined;
      const tabsProps = {
        size: 'large',
        [hasActiveTabKey ? 'activeKey' : 'defaultActiveKey']: hasActiveTabKey ? activeTabKey : defaultActiveTabKey,
        onChange: triggerTabChange,
        class: `${pre}-head-tabs`
      };
      let head;
      const tabs = tabList && tabList.length ? (0, _vue.createVNode)(_tabs.default, tabsProps, {
        default: () => [tabList.map(item => {
          const {
            tab: temp,
            slots: itemSlots
          } = item;
          const name = itemSlots === null || itemSlots === void 0 ? void 0 : itemSlots.tab;
          (0, _devWarning.default)(!itemSlots, 'Card', `tabList slots is deprecated, Please use \`customTab\` instead.`);
          let tab = temp !== undefined ? temp : slots[name] ? slots[name](item) : null;
          tab = (0, _vnode.customRenderSlot)(slots, 'customTab', item, () => [tab]);
          return (0, _vue.createVNode)(TabPane, {
            "tab": tab,
            "key": item.key,
            "disabled": item.disabled
          }, null);
        })],
        rightExtra: tabBarExtraContent ? () => tabBarExtraContent : null
      }) : null;
      if (title || extra || tabs) {
        head = (0, _vue.createVNode)("div", {
          "class": `${pre}-head`,
          "style": headStyle
        }, [(0, _vue.createVNode)("div", {
          "class": `${pre}-head-wrapper`
        }, [title && (0, _vue.createVNode)("div", {
          "class": `${pre}-head-title`
        }, [title]), extra && (0, _vue.createVNode)("div", {
          "class": `${pre}-extra`
        }, [extra])]), tabs]);
      }
      const coverDom = cover ? (0, _vue.createVNode)("div", {
        "class": `${pre}-cover`
      }, [cover]) : null;
      const body = (0, _vue.createVNode)("div", {
        "class": `${pre}-body`,
        "style": bodyStyle
      }, [loading ? loadingBlock : children]);
      const actionDom = actions && actions.length ? (0, _vue.createVNode)("ul", {
        "class": `${pre}-actions`
      }, [getAction(actions)]) : null;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": "cardContainerRef"
      }, attrs), {}, {
        "class": [classString, attrs.class]
      }), [head, coverDom, children && children.length ? body : null, actionDom]));
    };
  }
});
var _default = exports.default = Card;