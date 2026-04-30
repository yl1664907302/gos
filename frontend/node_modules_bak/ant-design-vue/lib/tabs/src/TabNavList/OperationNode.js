"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.operationNodeProps = exports.default = void 0;
var _vue = require("vue");
var _menu = _interopRequireWildcard(require("../../../menu"));
var _vcDropdown = _interopRequireDefault(require("../../../vc-dropdown"));
var _AddButton = _interopRequireDefault(require("./AddButton"));
var _type = require("../../../_util/type");
var _KeyCode = _interopRequireDefault(require("../../../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../../../_util/vue-types"));
var _useState = _interopRequireDefault(require("../../../_util/hooks/useState"));
var _EllipsisOutlined = _interopRequireDefault(require("@ant-design/icons-vue/lib/icons/EllipsisOutlined"));
var _OverrideContext = require("../../../menu/src/OverrideContext");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const operationNodeProps = exports.operationNodeProps = {
  prefixCls: {
    type: String
  },
  id: {
    type: String
  },
  tabs: {
    type: Object
  },
  rtl: {
    type: Boolean
  },
  tabBarGutter: {
    type: Number
  },
  activeKey: {
    type: [String, Number]
  },
  mobile: {
    type: Boolean
  },
  moreIcon: _vueTypes.default.any,
  moreTransitionName: {
    type: String
  },
  editable: {
    type: Object
  },
  locale: {
    type: Object,
    default: undefined
  },
  removeAriaLabel: String,
  onTabClick: {
    type: Function
  },
  popupClassName: String,
  getPopupContainer: (0, _type.functionType)()
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'OperationNode',
  inheritAttrs: false,
  props: operationNodeProps,
  emits: ['tabClick'],
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    // ======================== Dropdown ========================
    const [open, setOpen] = (0, _useState.default)(false);
    const [selectedKey, setSelectedKey] = (0, _useState.default)(null);
    const selectOffset = offset => {
      const enabledTabs = props.tabs.filter(tab => !tab.disabled);
      let selectedIndex = enabledTabs.findIndex(tab => tab.key === selectedKey.value) || 0;
      const len = enabledTabs.length;
      for (let i = 0; i < len; i += 1) {
        selectedIndex = (selectedIndex + offset + len) % len;
        const tab = enabledTabs[selectedIndex];
        if (!tab.disabled) {
          setSelectedKey(tab.key);
          return;
        }
      }
    };
    const onKeyDown = e => {
      const {
        which
      } = e;
      if (!open.value) {
        if ([_KeyCode.default.DOWN, _KeyCode.default.SPACE, _KeyCode.default.ENTER].includes(which)) {
          setOpen(true);
          e.preventDefault();
        }
        return;
      }
      switch (which) {
        case _KeyCode.default.UP:
          selectOffset(-1);
          e.preventDefault();
          break;
        case _KeyCode.default.DOWN:
          selectOffset(1);
          e.preventDefault();
          break;
        case _KeyCode.default.ESC:
          setOpen(false);
          break;
        case _KeyCode.default.SPACE:
        case _KeyCode.default.ENTER:
          if (selectedKey.value !== null) props.onTabClick(selectedKey.value, e);
          break;
      }
    };
    const popupId = (0, _vue.computed)(() => `${props.id}-more-popup`);
    const selectedItemId = (0, _vue.computed)(() => selectedKey.value !== null ? `${popupId.value}-${selectedKey.value}` : null);
    const onRemoveTab = (event, key) => {
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key,
        event
      });
    };
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)(selectedKey, () => {
        const ele = document.getElementById(selectedItemId.value);
        if (ele && ele.scrollIntoView) {
          ele.scrollIntoView(false);
        }
      }, {
        flush: 'post',
        immediate: true
      });
    });
    (0, _vue.watch)(open, () => {
      if (!open.value) {
        setSelectedKey(null);
      }
    });
    (0, _OverrideContext.useProvideOverride)({});
    return () => {
      var _a;
      const {
        prefixCls,
        id,
        tabs,
        locale,
        mobile,
        moreIcon = ((_a = slots.moreIcon) === null || _a === void 0 ? void 0 : _a.call(slots)) || (0, _vue.createVNode)(_EllipsisOutlined.default, null, null),
        moreTransitionName,
        editable,
        tabBarGutter,
        rtl,
        onTabClick,
        popupClassName
      } = props;
      if (!tabs.length) return null;
      const dropdownPrefix = `${prefixCls}-dropdown`;
      const dropdownAriaLabel = locale === null || locale === void 0 ? void 0 : locale.dropdownAriaLabel;
      // ========================= Render =========================
      const moreStyle = {
        [rtl ? 'marginRight' : 'marginLeft']: tabBarGutter
      };
      if (!tabs.length) {
        moreStyle.visibility = 'hidden';
        moreStyle.order = 1;
      }
      const overlayClassName = (0, _classNames.default)({
        [`${dropdownPrefix}-rtl`]: rtl,
        [`${popupClassName}`]: true
      });
      const moreNode = mobile ? null : (0, _vue.createVNode)(_vcDropdown.default, {
        "prefixCls": dropdownPrefix,
        "trigger": ['hover'],
        "visible": open.value,
        "transitionName": moreTransitionName,
        "onVisibleChange": setOpen,
        "overlayClassName": overlayClassName,
        "mouseEnterDelay": 0.1,
        "mouseLeaveDelay": 0.1,
        "getPopupContainer": props.getPopupContainer
      }, {
        overlay: () => (0, _vue.createVNode)(_menu.default, {
          "onClick": _ref2 => {
            let {
              key,
              domEvent
            } = _ref2;
            onTabClick(key, domEvent);
            setOpen(false);
          },
          "id": popupId.value,
          "tabindex": -1,
          "role": "listbox",
          "aria-activedescendant": selectedItemId.value,
          "selectedKeys": [selectedKey.value],
          "aria-label": dropdownAriaLabel !== undefined ? dropdownAriaLabel : 'expanded dropdown'
        }, {
          default: () => [tabs.map(tab => {
            var _a, _b;
            const removable = editable && tab.closable !== false && !tab.disabled;
            return (0, _vue.createVNode)(_menu.MenuItem, {
              "key": tab.key,
              "id": `${popupId.value}-${tab.key}`,
              "role": "option",
              "aria-controls": id && `${id}-panel-${tab.key}`,
              "disabled": tab.disabled
            }, {
              default: () => [(0, _vue.createVNode)("span", null, [typeof tab.tab === 'function' ? tab.tab() : tab.tab]), removable && (0, _vue.createVNode)("button", {
                "type": "button",
                "aria-label": props.removeAriaLabel || 'remove',
                "tabindex": 0,
                "class": `${dropdownPrefix}-menu-item-remove`,
                "onClick": e => {
                  e.stopPropagation();
                  onRemoveTab(e, tab.key);
                }
              }, [((_a = tab.closeIcon) === null || _a === void 0 ? void 0 : _a.call(tab)) || ((_b = editable.removeIcon) === null || _b === void 0 ? void 0 : _b.call(editable)) || '×'])]
            });
          })]
        }),
        default: () => (0, _vue.createVNode)("button", {
          "type": "button",
          "class": `${prefixCls}-nav-more`,
          "style": moreStyle,
          "tabindex": -1,
          "aria-hidden": "true",
          "aria-haspopup": "listbox",
          "aria-controls": popupId.value,
          "id": `${id}-more`,
          "aria-expanded": open.value,
          "onKeydown": onKeyDown
        }, [moreIcon])
      });
      return (0, _vue.createVNode)("div", {
        "class": (0, _classNames.default)(`${prefixCls}-nav-operations`, attrs.class),
        "style": attrs.style
      }, [moreNode, (0, _vue.createVNode)(_AddButton.default, {
        "prefixCls": prefixCls,
        "locale": locale,
        "editable": editable
      }, null)]);
    };
  }
});