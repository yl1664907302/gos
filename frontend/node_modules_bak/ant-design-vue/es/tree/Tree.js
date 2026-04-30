import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
import { watchEffect, ref, defineComponent, computed } from 'vue';
import classNames from '../_util/classNames';
import VcTree from '../vc-tree';
import PropTypes from '../_util/vue-types';
import { filterEmpty } from '../_util/props-util';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { treeProps as vcTreeProps } from '../vc-tree/props';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import renderSwitcherIcon from './utils/iconUtil';
import dropIndicatorRender from './utils/dropIndicator';
import devWarning from '../vc-util/devWarning';
import { warning } from '../vc-util/warning';
import omit from '../_util/omit';
import { booleanType, someType, arrayType, functionType, objectType } from '../_util/type';
// CSSINJS
import useStyle from './style';
export const treeProps = () => {
  const baseTreeProps = vcTreeProps();
  return _extends(_extends({}, baseTreeProps), {
    showLine: someType([Boolean, Object]),
    /** 是否支持多选 */
    multiple: booleanType(),
    /** 是否自动展开父节点 */
    autoExpandParent: booleanType(),
    /** checkable状态下节点选择完全受控（父子节点选中状态不再关联）*/
    checkStrictly: booleanType(),
    /** 是否支持选中 */
    checkable: booleanType(),
    /** 是否禁用树 */
    disabled: booleanType(),
    /** 默认展开所有树节点 */
    defaultExpandAll: booleanType(),
    /** 默认展开对应树节点 */
    defaultExpandParent: booleanType(),
    /** 默认展开指定的树节点 */
    defaultExpandedKeys: arrayType(),
    /** （受控）展开指定的树节点 */
    expandedKeys: arrayType(),
    /** （受控）选中复选框的树节点 */
    checkedKeys: someType([Array, Object]),
    /** 默认选中复选框的树节点 */
    defaultCheckedKeys: arrayType(),
    /** （受控）设置选中的树节点 */
    selectedKeys: arrayType(),
    /** 默认选中的树节点 */
    defaultSelectedKeys: arrayType(),
    selectable: booleanType(),
    loadedKeys: arrayType(),
    draggable: booleanType(),
    showIcon: booleanType(),
    icon: functionType(),
    switcherIcon: PropTypes.any,
    prefixCls: String,
    /**
     * @default{title,key,children}
     * deprecated, please use `fieldNames` instead
     * 替换treeNode中 title,key,children字段为treeData中对应的字段
     */
    replaceFields: objectType(),
    blockNode: booleanType(),
    openAnimation: PropTypes.any,
    onDoubleclick: baseTreeProps.onDblclick,
    'onUpdate:selectedKeys': functionType(),
    'onUpdate:checkedKeys': functionType(),
    'onUpdate:expandedKeys': functionType()
  });
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATree',
  inheritAttrs: false,
  props: initDefaultProps(treeProps(), {
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
    warning(!(props.treeData === undefined && slots.default), '`children` of Tree is deprecated. Please use `treeData` instead.');
    const {
      prefixCls,
      direction,
      virtual
    } = useConfigInject('tree', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const treeRef = ref();
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
      selectedKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.selectedKeys;
      }),
      checkedKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.checkedKeys;
      }),
      halfCheckedKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.halfCheckedKeys;
      }),
      loadedKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadedKeys;
      }),
      loadingKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.loadingKeys;
      }),
      expandedKeys: computed(() => {
        var _a;
        return (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.expandedKeys;
      })
    });
    watchEffect(() => {
      devWarning(props.replaceFields === undefined, 'Tree', '`replaceFields` is deprecated, please use fieldNames instead');
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
      const newProps = _extends(_extends(_extends({}, attrs), omit(props, ['onUpdate:checkedKeys', 'onUpdate:expandedKeys', 'onUpdate:selectedKeys', 'onDoubleclick'])), {
        showLine: Boolean(showLine),
        dropIndicatorRender,
        fieldNames,
        icon,
        itemHeight
      });
      const children = slots.default ? filterEmpty(slots.default()) : undefined;
      return wrapSSR(_createVNode(VcTree, _objectSpread(_objectSpread({}, newProps), {}, {
        "virtual": virtual.value,
        "motion": motion,
        "ref": treeRef,
        "prefixCls": prefixCls.value,
        "class": classNames({
          [`${prefixCls.value}-icon-hide`]: !showIcon,
          [`${prefixCls.value}-block-node`]: blockNode,
          [`${prefixCls.value}-unselectable`]: !selectable,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value),
        "direction": direction.value,
        "checkable": checkable,
        "selectable": selectable,
        "switcherIcon": nodeProps => renderSwitcherIcon(prefixCls.value, switcherIcon, nodeProps, slots.leafIcon, showLine),
        "onCheck": handleCheck,
        "onExpand": handleExpand,
        "onSelect": handleSelect,
        "onDblclick": onDblclick || onDoubleclick,
        "children": children
      }), _extends(_extends({}, slots), {
        checkable: () => _createVNode("span", {
          "class": `${prefixCls.value}-checkbox-inner`
        }, null)
      })));
    };
  }
});