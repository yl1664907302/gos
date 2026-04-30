"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _contextTypes = require("./contextTypes");
var _Indent = _interopRequireDefault(require("./Indent"));
var _treeUtil = require("./utils/treeUtil");
var _props = require("./props");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _warning = require("../vc-util/warning");
var _pickAttrs = _interopRequireDefault(require("../_util/pickAttrs"));
var _eagerComputed = _interopRequireDefault(require("../_util/eagerComputed"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const ICON_OPEN = 'open';
const ICON_CLOSE = 'close';
const defaultTitle = '---';
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATreeNode',
  inheritAttrs: false,
  props: _props.treeNodeProps,
  isTreeNode: 1,
  setup(props, _ref) {
    let {
      attrs,
      slots,
      expose
    } = _ref;
    (0, _warning.warning)(!('slots' in props.data), `treeData slots is deprecated, please use ${Object.keys(props.data.slots || {}).map(key => '`v-slot:' + key + '` ')}instead`);
    const dragNodeHighlight = (0, _vue.shallowRef)(false);
    const context = (0, _contextTypes.useInjectTreeContext)();
    const {
      expandedKeysSet,
      selectedKeysSet,
      loadedKeysSet,
      loadingKeysSet,
      checkedKeysSet,
      halfCheckedKeysSet
    } = (0, _contextTypes.useInjectKeysState)();
    const {
      dragOverNodeKey,
      dropPosition,
      keyEntities
    } = context.value;
    const mergedTreeNodeProps = (0, _vue.computed)(() => {
      return (0, _treeUtil.getTreeNodeProps)(props.eventKey, {
        expandedKeysSet: expandedKeysSet.value,
        selectedKeysSet: selectedKeysSet.value,
        loadedKeysSet: loadedKeysSet.value,
        loadingKeysSet: loadingKeysSet.value,
        checkedKeysSet: checkedKeysSet.value,
        halfCheckedKeysSet: halfCheckedKeysSet.value,
        dragOverNodeKey,
        dropPosition,
        keyEntities
      });
    });
    const expanded = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.expanded);
    const selected = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.selected);
    const checked = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.checked);
    const loaded = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.loaded);
    const loading = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.loading);
    const halfChecked = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.halfChecked);
    const dragOver = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.dragOver);
    const dragOverGapTop = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.dragOverGapTop);
    const dragOverGapBottom = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.dragOverGapBottom);
    const pos = (0, _eagerComputed.default)(() => mergedTreeNodeProps.value.pos);
    const selectHandle = (0, _vue.shallowRef)();
    const hasChildren = (0, _vue.computed)(() => {
      const {
        eventKey
      } = props;
      const {
        keyEntities
      } = context.value;
      const {
        children
      } = keyEntities[eventKey] || {};
      return !!(children || []).length;
    });
    const isLeaf = (0, _vue.computed)(() => {
      const {
        isLeaf
      } = props;
      const {
        loadData
      } = context.value;
      const has = hasChildren.value;
      if (isLeaf === false) {
        return false;
      }
      return isLeaf || !loadData && !has || loadData && loaded.value && !has;
    });
    const nodeState = (0, _vue.computed)(() => {
      if (isLeaf.value) {
        return null;
      }
      return expanded.value ? ICON_OPEN : ICON_CLOSE;
    });
    const isDisabled = (0, _vue.computed)(() => {
      const {
        disabled
      } = props;
      const {
        disabled: treeDisabled
      } = context.value;
      return !!(treeDisabled || disabled);
    });
    const isCheckable = (0, _vue.computed)(() => {
      const {
        checkable
      } = props;
      const {
        checkable: treeCheckable
      } = context.value;
      // Return false if tree or treeNode is not checkable
      if (!treeCheckable || checkable === false) return false;
      return treeCheckable;
    });
    const isSelectable = (0, _vue.computed)(() => {
      const {
        selectable
      } = props;
      const {
        selectable: treeSelectable
      } = context.value;
      // Ignore when selectable is undefined or null
      if (typeof selectable === 'boolean') {
        return selectable;
      }
      return treeSelectable;
    });
    const renderArgsData = (0, _vue.computed)(() => {
      const {
        data,
        active,
        checkable,
        disableCheckbox,
        disabled,
        selectable
      } = props;
      return (0, _extends2.default)((0, _extends2.default)({
        active,
        checkable,
        disableCheckbox,
        disabled,
        selectable
      }, data), {
        dataRef: data,
        data,
        isLeaf: isLeaf.value,
        checked: checked.value,
        expanded: expanded.value,
        loading: loading.value,
        selected: selected.value,
        halfChecked: halfChecked.value
      });
    });
    const instance = (0, _vue.getCurrentInstance)();
    const eventData = (0, _vue.computed)(() => {
      const {
        eventKey
      } = props;
      const {
        keyEntities
      } = context.value;
      const {
        parent
      } = keyEntities[eventKey] || {};
      return (0, _extends2.default)((0, _extends2.default)({}, (0, _treeUtil.convertNodePropsToEventData)((0, _extends2.default)({}, props, mergedTreeNodeProps.value))), {
        parent
      });
    });
    const dragNodeEvent = (0, _vue.reactive)({
      eventData,
      eventKey: (0, _vue.computed)(() => props.eventKey),
      selectHandle,
      pos,
      key: instance.vnode.key
    });
    expose(dragNodeEvent);
    const onSelectorDoubleClick = e => {
      const {
        onNodeDoubleClick
      } = context.value;
      onNodeDoubleClick(e, eventData.value);
    };
    const onSelect = e => {
      if (isDisabled.value) return;
      const {
        onNodeSelect
      } = context.value;
      e.preventDefault();
      onNodeSelect(e, eventData.value);
    };
    const onCheck = e => {
      if (isDisabled.value) return;
      const {
        disableCheckbox
      } = props;
      const {
        onNodeCheck
      } = context.value;
      if (!isCheckable.value || disableCheckbox) return;
      e.preventDefault();
      const targetChecked = !checked.value;
      onNodeCheck(e, eventData.value, targetChecked);
    };
    const onSelectorClick = e => {
      // Click trigger before select/check operation
      const {
        onNodeClick
      } = context.value;
      onNodeClick(e, eventData.value);
      if (isSelectable.value) {
        onSelect(e);
      } else {
        onCheck(e);
      }
    };
    const onMouseEnter = e => {
      const {
        onNodeMouseEnter
      } = context.value;
      onNodeMouseEnter(e, eventData.value);
    };
    const onMouseLeave = e => {
      const {
        onNodeMouseLeave
      } = context.value;
      onNodeMouseLeave(e, eventData.value);
    };
    const onContextmenu = e => {
      const {
        onNodeContextMenu
      } = context.value;
      onNodeContextMenu(e, eventData.value);
    };
    const onDragStart = e => {
      const {
        onNodeDragStart
      } = context.value;
      e.stopPropagation();
      dragNodeHighlight.value = true;
      onNodeDragStart(e, dragNodeEvent);
      try {
        // ie throw error
        // firefox-need-it
        e.dataTransfer.setData('text/plain', '');
      } catch (error) {
        // empty
      }
    };
    const onDragEnter = e => {
      const {
        onNodeDragEnter
      } = context.value;
      e.preventDefault();
      e.stopPropagation();
      onNodeDragEnter(e, dragNodeEvent);
    };
    const onDragOver = e => {
      const {
        onNodeDragOver
      } = context.value;
      e.preventDefault();
      e.stopPropagation();
      onNodeDragOver(e, dragNodeEvent);
    };
    const onDragLeave = e => {
      const {
        onNodeDragLeave
      } = context.value;
      e.stopPropagation();
      onNodeDragLeave(e, dragNodeEvent);
    };
    const onDragEnd = e => {
      const {
        onNodeDragEnd
      } = context.value;
      e.stopPropagation();
      dragNodeHighlight.value = false;
      onNodeDragEnd(e, dragNodeEvent);
    };
    const onDrop = e => {
      const {
        onNodeDrop
      } = context.value;
      e.preventDefault();
      e.stopPropagation();
      dragNodeHighlight.value = false;
      onNodeDrop(e, dragNodeEvent);
    };
    // Disabled item still can be switch
    const onExpand = e => {
      const {
        onNodeExpand
      } = context.value;
      if (loading.value) return;
      onNodeExpand(e, eventData.value);
    };
    const isDraggable = () => {
      const {
        data
      } = props;
      const {
        draggable
      } = context.value;
      return !!(draggable && (!draggable.nodeDraggable || draggable.nodeDraggable(data)));
    };
    // ==================== Render: Drag Handler ====================
    const renderDragHandler = () => {
      const {
        draggable,
        prefixCls
      } = context.value;
      return draggable && (draggable === null || draggable === void 0 ? void 0 : draggable.icon) ? (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-draggable-icon`
      }, [draggable.icon]) : null;
    };
    const renderSwitcherIconDom = () => {
      var _a, _b, _c;
      const {
        switcherIcon: switcherIconFromProps = slots.switcherIcon || ((_a = context.value.slots) === null || _a === void 0 ? void 0 : _a[(_c = (_b = props.data) === null || _b === void 0 ? void 0 : _b.slots) === null || _c === void 0 ? void 0 : _c.switcherIcon])
      } = props;
      const {
        switcherIcon: switcherIconFromCtx
      } = context.value;
      const switcherIcon = switcherIconFromProps || switcherIconFromCtx;
      // if switcherIconDom is null, no render switcher span
      if (typeof switcherIcon === 'function') {
        return switcherIcon(renderArgsData.value);
      }
      return switcherIcon;
    };
    // Load data to avoid default expanded tree without data
    const syncLoadData = () => {
      //const { expanded, loading, loaded } = props;
      const {
        loadData,
        onNodeLoad
      } = context.value;
      if (loading.value) {
        return;
      }
      // read from state to avoid loadData at same time
      if (loadData && expanded.value && !isLeaf.value) {
        // We needn't reload data when has children in sync logic
        // It's only needed in node expanded
        if (!hasChildren.value && !loaded.value) {
          onNodeLoad(eventData.value);
        }
      }
    };
    (0, _vue.onMounted)(() => {
      syncLoadData();
    });
    (0, _vue.onUpdated)(() => {
      // https://github.com/vueComponent/ant-design-vue/issues/4835
      syncLoadData();
    });
    // Switcher
    const renderSwitcher = () => {
      const {
        prefixCls
      } = context.value;
      // if switcherIconDom is null, no render switcher span
      const switcherIconDom = renderSwitcherIconDom();
      if (isLeaf.value) {
        return switcherIconDom !== false ? (0, _vue.createVNode)("span", {
          "class": (0, _classNames.default)(`${prefixCls}-switcher`, `${prefixCls}-switcher-noop`)
        }, [switcherIconDom]) : null;
      }
      const switcherCls = (0, _classNames.default)(`${prefixCls}-switcher`, `${prefixCls}-switcher_${expanded.value ? ICON_OPEN : ICON_CLOSE}`);
      return switcherIconDom !== false ? (0, _vue.createVNode)("span", {
        "onClick": onExpand,
        "class": switcherCls
      }, [switcherIconDom]) : null;
    };
    // Checkbox
    const renderCheckbox = () => {
      var _a, _b;
      const {
        disableCheckbox
      } = props;
      const {
        prefixCls
      } = context.value;
      const disabled = isDisabled.value;
      const checkable = isCheckable.value;
      if (!checkable) return null;
      return (0, _vue.createVNode)("span", {
        "class": (0, _classNames.default)(`${prefixCls}-checkbox`, checked.value && `${prefixCls}-checkbox-checked`, !checked.value && halfChecked.value && `${prefixCls}-checkbox-indeterminate`, (disabled || disableCheckbox) && `${prefixCls}-checkbox-disabled`),
        "onClick": onCheck
      }, [(_b = (_a = context.value).customCheckable) === null || _b === void 0 ? void 0 : _b.call(_a)]);
    };
    const renderIcon = () => {
      const {
        prefixCls
      } = context.value;
      return (0, _vue.createVNode)("span", {
        "class": (0, _classNames.default)(`${prefixCls}-iconEle`, `${prefixCls}-icon__${nodeState.value || 'docu'}`, loading.value && `${prefixCls}-icon_loading`)
      }, null);
    };
    const renderDropIndicator = () => {
      const {
        disabled,
        eventKey
      } = props;
      const {
        draggable,
        dropLevelOffset,
        dropPosition,
        prefixCls,
        indent,
        dropIndicatorRender,
        dragOverNodeKey,
        direction
      } = context.value;
      const rootDraggable = draggable !== false;
      // allowDrop is calculated in Tree.tsx, there is no need for calc it here
      const showIndicator = !disabled && rootDraggable && dragOverNodeKey === eventKey;
      return showIndicator ? dropIndicatorRender({
        dropPosition,
        dropLevelOffset,
        indent,
        prefixCls,
        direction
      }) : null;
    };
    // Icon + Title
    const renderSelector = () => {
      var _a, _b, _c, _d, _e, _f;
      const {
        // title = slots.title ||
        //   context.value.slots?.[props.data?.slots?.title] ||
        //   context.value.slots?.title,
        // selected,
        icon = slots.icon,
        // loading,
        data
      } = props;
      const title = slots.title || ((_a = context.value.slots) === null || _a === void 0 ? void 0 : _a[(_c = (_b = props.data) === null || _b === void 0 ? void 0 : _b.slots) === null || _c === void 0 ? void 0 : _c.title]) || ((_d = context.value.slots) === null || _d === void 0 ? void 0 : _d.title) || props.title;
      const {
        prefixCls,
        showIcon,
        icon: treeIcon,
        loadData
        // slots: contextSlots,
      } = context.value;
      const disabled = isDisabled.value;
      const wrapClass = `${prefixCls}-node-content-wrapper`;
      // Icon - Still show loading icon when loading without showIcon
      let $icon;
      if (showIcon) {
        const currentIcon = icon || ((_e = context.value.slots) === null || _e === void 0 ? void 0 : _e[(_f = data === null || data === void 0 ? void 0 : data.slots) === null || _f === void 0 ? void 0 : _f.icon]) || treeIcon;
        $icon = currentIcon ? (0, _vue.createVNode)("span", {
          "class": (0, _classNames.default)(`${prefixCls}-iconEle`, `${prefixCls}-icon__customize`)
        }, [typeof currentIcon === 'function' ? currentIcon(renderArgsData.value) : currentIcon]) : renderIcon();
      } else if (loadData && loading.value) {
        $icon = renderIcon();
      }
      // Title
      let titleNode;
      if (typeof title === 'function') {
        titleNode = title(renderArgsData.value);
        // } else if (contextSlots.titleRender) {
        //   titleNode = contextSlots.titleRender(renderArgsData.value);
      } else {
        titleNode = title;
      }
      titleNode = titleNode === undefined ? defaultTitle : titleNode;
      const $title = (0, _vue.createVNode)("span", {
        "class": `${prefixCls}-title`
      }, [titleNode]);
      return (0, _vue.createVNode)("span", {
        "ref": selectHandle,
        "title": typeof title === 'string' ? title : '',
        "class": (0, _classNames.default)(`${wrapClass}`, `${wrapClass}-${nodeState.value || 'normal'}`, !disabled && (selected.value || dragNodeHighlight.value) && `${prefixCls}-node-selected`),
        "onMouseenter": onMouseEnter,
        "onMouseleave": onMouseLeave,
        "onContextmenu": onContextmenu,
        "onClick": onSelectorClick,
        "onDblclick": onSelectorDoubleClick
      }, [$icon, $title, renderDropIndicator()]);
    };
    return () => {
      const _a = (0, _extends2.default)((0, _extends2.default)({}, props), attrs),
        {
          eventKey,
          isLeaf,
          isStart,
          isEnd,
          domRef,
          active,
          data,
          onMousemove,
          selectable
        } = _a,
        otherProps = __rest(_a, ["eventKey", "isLeaf", "isStart", "isEnd", "domRef", "active", "data", "onMousemove", "selectable"]);
      const {
        prefixCls,
        filterTreeNode,
        keyEntities,
        dropContainerKey,
        dropTargetKey,
        draggingNodeKey
      } = context.value;
      const disabled = isDisabled.value;
      const dataOrAriaAttributeProps = (0, _pickAttrs.default)(otherProps, {
        aria: true,
        data: true
      });
      const {
        level
      } = keyEntities[eventKey] || {};
      const isEndNode = isEnd[isEnd.length - 1];
      const mergedDraggable = isDraggable();
      const draggableWithoutDisabled = !disabled && mergedDraggable;
      const dragging = draggingNodeKey === eventKey;
      const ariaSelected = selectable !== undefined ? {
        'aria-selected': !!selectable
      } : undefined;
      // console.log(1);
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({
        "ref": domRef,
        "class": (0, _classNames.default)(attrs.class, `${prefixCls}-treenode`, {
          [`${prefixCls}-treenode-disabled`]: disabled,
          [`${prefixCls}-treenode-switcher-${expanded.value ? 'open' : 'close'}`]: !isLeaf,
          [`${prefixCls}-treenode-checkbox-checked`]: checked.value,
          [`${prefixCls}-treenode-checkbox-indeterminate`]: halfChecked.value,
          [`${prefixCls}-treenode-selected`]: selected.value,
          [`${prefixCls}-treenode-loading`]: loading.value,
          [`${prefixCls}-treenode-active`]: active,
          [`${prefixCls}-treenode-leaf-last`]: isEndNode,
          [`${prefixCls}-treenode-draggable`]: draggableWithoutDisabled,
          dragging,
          'drop-target': dropTargetKey === eventKey,
          'drop-container': dropContainerKey === eventKey,
          'drag-over': !disabled && dragOver.value,
          'drag-over-gap-top': !disabled && dragOverGapTop.value,
          'drag-over-gap-bottom': !disabled && dragOverGapBottom.value,
          'filter-node': filterTreeNode && filterTreeNode(eventData.value)
        }),
        "style": attrs.style,
        "draggable": draggableWithoutDisabled,
        "aria-grabbed": dragging,
        "onDragstart": draggableWithoutDisabled ? onDragStart : undefined,
        "onDragenter": mergedDraggable ? onDragEnter : undefined,
        "onDragover": mergedDraggable ? onDragOver : undefined,
        "onDragleave": mergedDraggable ? onDragLeave : undefined,
        "onDrop": mergedDraggable ? onDrop : undefined,
        "onDragend": mergedDraggable ? onDragEnd : undefined,
        "onMousemove": onMousemove
      }, ariaSelected), dataOrAriaAttributeProps), [(0, _vue.createVNode)(_Indent.default, {
        "prefixCls": prefixCls,
        "level": level,
        "isStart": isStart,
        "isEnd": isEnd
      }, null), renderDragHandler(), renderSwitcher(), renderCheckbox(), renderSelector()]);
    };
  }
});