import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { isVNode, defineComponent } from 'vue';
import Tabs from '../tabs';
import PropTypes from '../_util/vue-types';
import { flattenChildren, isEmptyElement, filterEmptyWithUndefined } from '../_util/props-util';
import isPlainObject from 'lodash-es/isPlainObject';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import devWarning from '../vc-util/devWarning';
import useStyle from './style';
import Skeleton from '../skeleton';
import { customRenderSlot } from '../_util/vnode';
const {
  TabPane
} = Tabs;
export const cardProps = () => ({
  prefixCls: String,
  title: PropTypes.any,
  extra: PropTypes.any,
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
  actions: PropTypes.any,
  tabList: {
    type: Array
  },
  tabBarExtraContent: PropTypes.any,
  activeTabKey: String,
  defaultActiveTabKey: String,
  cover: PropTypes.any,
  onTabChange: {
    type: Function
  }
});
const Card = defineComponent({
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
    } = useConfigInject('card', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const getAction = actions => {
      const actionList = actions.map((action, index) => isVNode(action) && !isEmptyElement(action) || !isVNode(action) ? _createVNode("li", {
        "style": {
          width: `${100 / actions.length}%`
        },
        "key": `action-${index}`
      }, [_createVNode("span", null, [action])]) : null);
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
        if (element && isPlainObject(element.type) && element.type.__ANT_CARD_GRID) {
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
        tabBarExtraContent = filterEmptyWithUndefined((_a = slots.tabBarExtraContent) === null || _a === void 0 ? void 0 : _a.call(slots)),
        title = filterEmptyWithUndefined((_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots)),
        extra = filterEmptyWithUndefined((_c = slots.extra) === null || _c === void 0 ? void 0 : _c.call(slots)),
        actions = filterEmptyWithUndefined((_d = slots.actions) === null || _d === void 0 ? void 0 : _d.call(slots)),
        cover = filterEmptyWithUndefined((_e = slots.cover) === null || _e === void 0 ? void 0 : _e.call(slots))
      } = props;
      const children = flattenChildren((_f = slots.default) === null || _f === void 0 ? void 0 : _f.call(slots));
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
      const loadingBlock = _createVNode(Skeleton, {
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
      const tabs = tabList && tabList.length ? _createVNode(Tabs, tabsProps, {
        default: () => [tabList.map(item => {
          const {
            tab: temp,
            slots: itemSlots
          } = item;
          const name = itemSlots === null || itemSlots === void 0 ? void 0 : itemSlots.tab;
          devWarning(!itemSlots, 'Card', `tabList slots is deprecated, Please use \`customTab\` instead.`);
          let tab = temp !== undefined ? temp : slots[name] ? slots[name](item) : null;
          tab = customRenderSlot(slots, 'customTab', item, () => [tab]);
          return _createVNode(TabPane, {
            "tab": tab,
            "key": item.key,
            "disabled": item.disabled
          }, null);
        })],
        rightExtra: tabBarExtraContent ? () => tabBarExtraContent : null
      }) : null;
      if (title || extra || tabs) {
        head = _createVNode("div", {
          "class": `${pre}-head`,
          "style": headStyle
        }, [_createVNode("div", {
          "class": `${pre}-head-wrapper`
        }, [title && _createVNode("div", {
          "class": `${pre}-head-title`
        }, [title]), extra && _createVNode("div", {
          "class": `${pre}-extra`
        }, [extra])]), tabs]);
      }
      const coverDom = cover ? _createVNode("div", {
        "class": `${pre}-cover`
      }, [cover]) : null;
      const body = _createVNode("div", {
        "class": `${pre}-body`,
        "style": bodyStyle
      }, [loading ? loadingBlock : children]);
      const actionDom = actions && actions.length ? _createVNode("ul", {
        "class": `${pre}-actions`
      }, [getAction(actions)]) : null;
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({
        "ref": "cardContainerRef"
      }, attrs), {}, {
        "class": [classString, attrs.class]
      }), [head, coverDom, children && children.length ? body : null, actionDom]));
    };
  }
});
export default Card;