"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useMemo = _interopRequireDefault(require("../_util/hooks/useMemo"));
var _KeyCode = _interopRequireDefault(require("../_util/KeyCode"));
var _Tree = _interopRequireDefault(require("../vc-tree/Tree"));
var _valueUtil = require("./utils/valueUtil");
var _vcSelect = require("../vc-select");
var _LegacyContext = _interopRequireDefault(require("./LegacyContext"));
var _TreeSelectContext = _interopRequireDefault(require("./TreeSelectContext"));
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
var _default = exports.default = (0, _vue.defineComponent)({
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
    const baseProps = (0, _vcSelect.useBaseProps)();
    const legacyContext = (0, _LegacyContext.default)();
    const context = (0, _TreeSelectContext.default)();
    const treeRef = (0, _vue.ref)();
    const memoTreeData = (0, _useMemo.default)(() => context.treeData, [() => baseProps.open, () => context.treeData], next => next[0]);
    const mergedCheckedKeys = (0, _vue.computed)(() => {
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
    (0, _vue.watch)(() => baseProps.open, () => {
      (0, _vue.nextTick)(() => {
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
    const lowerSearchValue = (0, _vue.computed)(() => String(baseProps.searchValue).toLowerCase());
    const filterTreeNode = treeNode => {
      if (!lowerSearchValue.value) {
        return false;
      }
      return String(treeNode[legacyContext.treeNodeFilterProp]).toLowerCase().includes(lowerSearchValue.value);
    };
    // =========================== Keys ===========================
    const expandedKeys = (0, _vue.shallowRef)(legacyContext.treeDefaultExpandedKeys);
    const searchExpandedKeys = (0, _vue.shallowRef)(null);
    (0, _vue.watch)(() => baseProps.searchValue, () => {
      if (baseProps.searchValue) {
        searchExpandedKeys.value = (0, _valueUtil.getAllKeys)((0, _vue.toRaw)(context.treeData), (0, _vue.toRaw)(context.fieldNames));
      }
    }, {
      immediate: true
    });
    const mergedExpandedKeys = (0, _vue.computed)(() => {
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
      if (checkable && (0, _valueUtil.isCheckDisabled)(node)) {
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
    const activeKey = (0, _vue.ref)(null);
    const activeEntity = (0, _vue.computed)(() => legacyContext.keyEntities[activeKey.value]);
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
          case _KeyCode.default.UP:
          case _KeyCode.default.DOWN:
          case _KeyCode.default.LEFT:
          case _KeyCode.default.RIGHT:
            (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.onKeydown(event);
            break;
          // >>> Select item
          case _KeyCode.default.ENTER:
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
          case _KeyCode.default.ESC:
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
        return (0, _vue.createVNode)("div", {
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
      return (0, _vue.createVNode)("div", {
        "onMousedown": onListMouseDown
      }, [activeEntity.value && open && (0, _vue.createVNode)("span", {
        "style": HIDDEN_STYLE,
        "aria-live": "assertive"
      }, [activeEntity.value.node.value]), (0, _vue.createVNode)(_Tree.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({
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
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        checkable: legacyContext.customSlots.treeCheckable
      }))]);
    };
  }
});