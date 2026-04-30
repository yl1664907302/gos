import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { computed, defineComponent, nextTick, ref, shallowRef, toRaw, watch } from 'vue';
import useMemo from '../_util/hooks/useMemo';
import KeyCode from '../_util/KeyCode';
import Tree from '../vc-tree/Tree';
import { getAllKeys, isCheckDisabled } from './utils/valueUtil';
import { useBaseProps } from '../vc-select';
import useInjectLegacySelectContext from './LegacyContext';
import useInjectSelectContext from './TreeSelectContext';
const HIDDEN_STYLE = {
  width: 0,
  height: 0,
  display: 'flex',
  overflow: 'hidden',
  opacity: 0,
  border: 0,
  padding: 0,
  margin: 0
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'OptionList',
  inheritAttrs: false,
  setup(_, _ref) {
    let {
      slots,
      expose
    } = _ref;
    const baseProps = useBaseProps();
    const legacyContext = useInjectLegacySelectContext();
    const context = useInjectSelectContext();
    const treeRef = ref();
    const memoTreeData = useMemo(() => context.treeData, [() => baseProps.open, () => context.treeData], next => next[0]);
    const mergedCheckedKeys = computed(() => {
      const {
        checkable,
        halfCheckedKeys,
        checkedKeys
      } = legacyContext;
      if (!checkable) {
        return null;
      }
      return {
        checked: checkedKeys,
        halfChecked: halfCheckedKeys
      };
    });
    watch(() => baseProps.open, () => {
      nextTick(() => {
        var _a;
        if (baseProps.open && !baseProps.multiple && legacyContext.checkedKeys.length) {
          (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo({
            key: legacyContext.checkedKeys[0]
          });
        }
      });
    }, {
      immediate: true,
      flush: 'post'
    });
    // ========================== Search ==========================
    const lowerSearchValue = computed(() => String(baseProps.searchValue).toLowerCase());
    const filterTreeNode = treeNode => {
      if (!lowerSearchValue.value) {
        return false;
      }
      return String(treeNode[legacyContext.treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue.value);
    };
    // =========================== Keys ===========================
    const expandedKeys = shallowRef(legacyContext.treeDefaultExpandedKeys);
    const searchExpandedKeys = shallowRef(null);
    watch(() => baseProps.searchValue, () => {
      if (baseProps.searchValue) {
        searchExpandedKeys.value = getAllKeys(toRaw(context.treeData), toRaw(context.fieldNames));
      }
    }, {
      immediate: true
    });
    const mergedExpandedKeys = computed(() => {
      if (legacyContext.treeExpandedKeys) {
        return legacyContext.treeExpandedKeys.slice();
      }
      return baseProps.searchValue ? searchExpandedKeys.value : expandedKeys.value;
    });
    const onInternalExpand = keys => {
      var _a;
      expandedKeys.value = keys;
      searchExpandedKeys.value = keys;
      (_a = legacyContext.onTreeExpand) === null || _a === void 0 ? void 0 : _a.call(legacyContext, keys);
    };
    // ========================== Events ==========================
    const onListMouseDown = event => {
      event.preventDefault();
    };
    const onInternalSelect = (_, _ref2) => {
      let {
        node
      } = _ref2;
      var _a, _b;
      const {
        checkable,
        checkedKeys
      } = legacyContext;
      if (checkable && isCheckDisabled(node)) {
        return;
      }
      (_a = context.onSelect) === null || _a === void 0 ? void 0 : _a.call(context, node.key, {
        selected: !checkedKeys.includes(node.key)
      });
      if (!baseProps.multiple) {
        (_b = baseProps.toggleOpen) === null || _b === void 0 ? void 0 : _b.call(baseProps, false);
      }
    };
    // ========================= Keyboard =========================
    const activeKey = ref(null);
    const activeEntity = computed(() => legacyContext.keyEntities[activeKey.value]);
    const setActiveKey = key => {
      activeKey.value = key;
    };
    expose({
      scrollTo: function () {
        var _a, _b;
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        return (_b = (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo) === null || _b === void 0 ? void 0 : _b.call(_a, ...args);
      },
      onKeydown: event => {
        var _a;
        const {
          which
        } = event;
        switch (which) {
          // >>> Arrow keys
          case KeyCode.UP:
          case KeyCode.DOWN:
          case KeyCode.LEFT:
          case KeyCode.RIGHT:
            (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.onKeydown(event);
            break;
          // >>> Select item
          case KeyCode.ENTER:
            {
              if (activeEntity.value) {
                const {
                  selectable,
                  value
                } = activeEntity.value.node || {};
                if (selectable !== false) {
                  onInternalSelect(null, {
                    node: {
                      key: activeKey.value
                    },
                    selected: !legacyContext.checkedKeys.includes(value)
                  });
                }
              }
              break;
            }
          // >>> Close
          case KeyCode.ESC:
            {
              baseProps.toggleOpen(false);
            }
        }
      },
      onKeyup: () => {}
    });
    return () => {
      var _a;
      const {
        prefixCls,
        multiple,
        searchValue,
        open,
        notFoundContent = (_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots)
      } = baseProps;
      const {
        listHeight,
        listItemHeight,
        virtual,
        dropdownMatchSelectWidth,
        treeExpandAction
      } = context;
      const {
        checkable,
        treeDefaultExpandAll,
        treeIcon,
        showTreeIcon,
        switcherIcon,
        treeLine,
        loadData,
        treeLoadedKeys,
        treeMotion,
        onTreeLoad,
        checkedKeys
      } = legacyContext;
      // ========================== Render ==========================
      if (memoTreeData.value.length === 0) {
        return _createVNode("div", {
          "role": "listbox",
          "class": `${prefixCls}-empty`,
          "onMousedown": onListMouseDown
        }, [notFoundContent]);
      }
      const treeProps = {
        fieldNames: context.fieldNames
      };
      if (treeLoadedKeys) {
        treeProps.loadedKeys = treeLoadedKeys;
      }
      if (mergedExpandedKeys.value) {
        treeProps.expandedKeys = mergedExpandedKeys.value;
      }
      return _createVNode("div", {
        "onMousedown": onListMouseDown
      }, [activeEntity.value && open && _createVNode("span", {
        "style": HIDDEN_STYLE,
        "aria-live": "assertive"
      }, [activeEntity.value.node.value]), _createVNode(Tree, _objectSpread(_objectSpread({
        "ref": treeRef,
        "focusable": false,
        "prefixCls": `${prefixCls}-tree`,
        "treeData": memoTreeData.value,
        "height": listHeight,
        "itemHeight": listItemHeight,
        "virtual": virtual !== false && dropdownMatchSelectWidth !== false,
        "multiple": multiple,
        "icon": treeIcon,
        "showIcon": showTreeIcon,
        "switcherIcon": switcherIcon,
        "showLine": treeLine,
        "loadData": searchValue ? null : loadData,
        "motion": treeMotion,
        "activeKey": activeKey.value,
        "checkable": checkable,
        "checkStrictly": true,
        "checkedKeys": mergedCheckedKeys.value,
        "selectedKeys": !checkable ? checkedKeys : [],
        "defaultExpandAll": treeDefaultExpandAll
      }, treeProps), {}, {
        "onActiveChange": setActiveKey,
        "onSelect": onInternalSelect,
        "onCheck": onInternalSelect,
        "onExpand": onInternalExpand,
        "onLoad": onTreeLoad,
        "filterTreeNode": filterTreeNode,
        "expandAction": treeExpandAction
      }), _extends(_extends({}, slots), {
        checkable: legacyContext.customSlots.treeCheckable
      }))]);
    };
  }
});