import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import Menu, { MenuItem } from '../../../menu';
import Dropdown from '../../../vc-dropdown';
import AddButton from './AddButton';
import { functionType } from '../../../_util/type';
import KeyCode from '../../../_util/KeyCode';
import classNames from '../../../_util/classNames';
import { defineComponent, watch, computed, onMounted } from 'vue';
import PropTypes from '../../../_util/vue-types';
import useState from '../../../_util/hooks/useState';
import EllipsisOutlined from "@ant-design/icons-vue/es/icons/EllipsisOutlined";
import { useProvideOverride } from '../../../menu/src/OverrideContext';
export const operationNodeProps = {
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
  moreIcon: PropTypes.any,
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
  getPopupContainer: functionType()
};
export default defineComponent({
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
    const [open, setOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState(null);
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
        if ([KeyCode.DOWN, KeyCode.SPACE, KeyCode.ENTER].includes(which)) {
          setOpen(true);
          e.preventDefault();
        }
        return;
      }
      switch (which) {
        case KeyCode.UP:
          selectOffset(-1);
          e.preventDefault();
          break;
        case KeyCode.DOWN:
          selectOffset(1);
          e.preventDefault();
          break;
        case KeyCode.ESC:
          setOpen(false);
          break;
        case KeyCode.SPACE:
        case KeyCode.ENTER:
          if (selectedKey.value !== null) props.onTabClick(selectedKey.value, e);
          break;
      }
    };
    const popupId = computed(() => `${props.id}-more-popup`);
    const selectedItemId = computed(() => selectedKey.value !== null ? `${popupId.value}-${selectedKey.value}` : null);
    const onRemoveTab = (event, key) => {
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key,
        event
      });
    };
    onMounted(() => {
      watch(selectedKey, () => {
        const ele = document.getElementById(selectedItemId.value);
        if (ele && ele.scrollIntoView) {
          ele.scrollIntoView(false);
        }
      }, {
        flush: 'post',
        immediate: true
      });
    });
    watch(open, () => {
      if (!open.value) {
        setSelectedKey(null);
      }
    });
    useProvideOverride({});
    return () => {
      var _a;
      const {
        prefixCls,
        id,
        tabs,
        locale,
        mobile,
        moreIcon = ((_a = slots.moreIcon) === null || _a === void 0 ? void 0 : _a.call(slots)) || _createVNode(EllipsisOutlined, null, null),
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
      const overlayClassName = classNames({
        [`${dropdownPrefix}-rtl`]: rtl,
        [`${popupClassName}`]: true
      });
      const moreNode = mobile ? null : _createVNode(Dropdown, {
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
        overlay: () => _createVNode(Menu, {
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
            return _createVNode(MenuItem, {
              "key": tab.key,
              "id": `${popupId.value}-${tab.key}`,
              "role": "option",
              "aria-controls": id && `${id}-panel-${tab.key}`,
              "disabled": tab.disabled
            }, {
              default: () => [_createVNode("span", null, [typeof tab.tab === 'function' ? tab.tab() : tab.tab]), removable && _createVNode("button", {
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
        default: () => _createVNode("button", {
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
      return _createVNode("div", {
        "class": classNames(`${prefixCls}-nav-operations`, attrs.class),
        "style": attrs.style
      }, [moreNode, _createVNode(AddButton, {
        "prefixCls": prefixCls,
        "locale": locale,
        "editable": editable
      }, null)]);
    };
  }
});