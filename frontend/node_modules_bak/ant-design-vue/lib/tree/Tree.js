"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.treeProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _vcTree = _interopRequireDefault(require("../vc-tree"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _props = require("../vc-tree/props");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _iconUtil = _interopRequireDefault(require("./utils/iconUtil"));
var _dropIndicator = _interopRequireDefault(require("./utils/dropIndicator"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _warning = require("../vc-util/warning");
var _omit = _interopRequireDefault(require("../_util/omit"));
var _type = require("../_util/type");
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const treeProps = () => {
  const baseTreeProps = (0, _props.treeProps)();
  return (0, _extends2.default)((0, _extends2.default)({}, baseTreeProps), {
    showLine: (0, _type.someType)([Boolean, Object]),
    /** 是否支持多选 */
    multiple: (0, _type.booleanType)(),
    /** 是否自动展开父节点 */
    autoExpandParent: (0, _type.booleanType)(),
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: (0, _type.booleanType)(),
    /** 是否支持选中 */
    checkable: (0, _type.booleanType)(),
    /** 是否禁用树 */
    disabled: (0, _type.booleanType)(),
    /** 默认展开所有树节点 */
    defaultExpandAll: (0, _type.booleanType)(),
    /** 默认展开对应树节点 */
    defaultExpandParent: (0, _type.booleanType)(),
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: (0, _type.arrayType)(),
    /** （受控）展开指定的树节点 */
    expandedKeys: (0, _type.arrayType)(),
    /** （受控）选中复选框的树节点 */
    checkedKeys: (0, _type.someType)([Array, Object]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: (0, _type.arrayType)(),
    /** （受控）设置选中的树节点 */
    selectedKeys: (0, _type.arrayType)(),
    /** 默认选中的树节点 */
    defaultSelectedKeys: (0, _type.arrayType)(),
    selectable: (0, _type.booleanType)(),
    loadedKeys: (0, _type.arrayType)(),
    draggable: (0, _type.booleanType)(),
    showIcon: (0, _type.booleanType)(),
    icon: (0, _type.functionType)(),
    switcherIcon: _vueTypes.default.any,
    prefixCls: String,
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: (0, _type.objectType)(),
    blockNode: (0, _type.booleanType)(),
    openAnimation: _vueTypes.default.any,
    onDoubleclick: baseTreeProps.onDblclick,
    'onUpdate:selectedKeys': (0, _type.functionType)(),
    'onUpdate:checkedKeys': (0, _type.functionType)(),
    'onUpdate:expandedKeys': (0, _type.functionType)()
  });
};
exports.treeProps = treeProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ATree',
  inheritAttrs: false,
  props: (0, _initDefaultProps.default)(treeProps(), {
    checkable: false,
    selectable: true,
    showIcon: false,
    blockNode: false
  }),
  slots: Object,
  setup(props, _ref) {
    let {
      attrs,
      expose,
      emit,
      slots
    } = _ref;
    (0, _warning.warning)(!(props.treeData === undefined && slots.default), '`children` of Tree is deprecated. Please use `treeData` instead.');
    const {
      prefixCls,
      direction,
      virtual
    } = (0, _useConfigInject.default)('tree', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const treeRef = (0, _vue.ref)();
    const scrollTo = scroll => {
      var _a;
      (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(scroll);
    };
    expose({
      treeRef,
      onNodeExpand: function () {
        var _a;
        (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.onNodeExpand(...arguments);
      },
      scrollTo,
      selectedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.selectedKeys;
      }),
      checkedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.checkedKeys;
      }),
      halfCheckedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.halfCheckedKeys;
      }),
      loadedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadedKeys;
      }),
      loadingKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadingKeys;
      }),
      expandedKeys: (0, _vue.computed)(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.expandedKeys;
      })
    });
    (0, _vue.watchEffect)(() => {
      (0, _devWarning.default)(props.replaceFields === undefined, 'Tree', '`replaceFields` is deprecated, please use fieldNames instead');
    });
    const handleCheck = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };
    const handleExpand = (expandedKeys, eventObj) => {
      emit('update:expandedKeys', expandedKeys);
      emit('expand', expandedKeys, eventObj);
    };
    const handleSelect = (selectedKeys, eventObj) => {
      emit('update:selectedKeys', selectedKeys);
      emit('select', selectedKeys, eventObj);
    };
    return () => {
      const {
        showIcon,
        showLine,
        switcherIcon = slots.switcherIcon,
        icon = slots.icon,
        blockNode,
        checkable,
        selectable,
        fieldNames = props.replaceFields,
        motion = props.openAnimation,
        itemHeight = 28,
        onDoubleclick,
        onDblclick
      } = props;
      const newProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, attrs), (0, _omit.default)(props, ['onUpdate:checkedKeys', 'onUpdate:expandedKeys', 'onUpdate:selectedKeys', 'onDoubleclick'])), {
        showLine: Boolean(showLine),
        dropIndicatorRender: _dropIndicator.default,
        fieldNames,
        icon,
        itemHeight
      });
      const children = slots.default ? (0, _propsUtil.filterEmpty)(slots.default()) : undefined;
      return wrapSSR((0, _vue.createVNode)(_vcTree.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, newProps), {}, {
        "virtual": virtual.value,
        "motion": motion,
        "ref": treeRef,
        "prefixCls": prefixCls.value,
        "class": (0, _classNames.default)({
          [`${prefixCls.value}-icon-hide`]: !showIcon,
          [`${prefixCls.value}-block-node`]: blockNode,
          [`${prefixCls.value}-unselectable`]: !selectable,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value),
        "direction": direction.value,
        "checkable": checkable,
        "selectable": selectable,
        "switcherIcon": nodeProps => (0, _iconUtil.default)(prefixCls.value, switcherIcon, nodeProps, slots.leafIcon, showLine),
        "onCheck": handleCheck,
        "onExpand": handleExpand,
        "onSelect": handleSelect,
        "onDblclick": onDblclick || onDoubleclick,
        "children": children
      }), (0, _extends2.default)((0, _extends2.default)({}, slots), {
        checkable: () => (0, _vue.createVNode)("span", {
          "class": `${prefixCls.value}-checkbox-inner`
        }, null)
      })));
    };
  }
});