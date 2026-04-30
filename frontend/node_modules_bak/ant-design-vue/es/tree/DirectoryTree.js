import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { resolveDirective as _resolveDirective, createVNode as _createVNode } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { nextTick, onUpdated, ref, watch, defineComponent, computed } from 'vue';
import debounce from 'lodash-es/debounce';
import FolderOpenOutlined from "@ant-design/icons-vue/es/icons/FolderOpenOutlined";
import FolderOutlined from "@ant-design/icons-vue/es/icons/FolderOutlined";
import FileOutlined from "@ant-design/icons-vue/es/icons/FileOutlined";
import classNames from '../_util/classNames';
import Tree, { treeProps } from './Tree';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { convertDataToEntities, convertTreeToData, fillFieldNames } from '../vc-tree/utils/treeUtil';
import { conductExpandParent } from '../vc-tree/util';
import { calcRangeKeys, convertDirectoryKeysToNodes } from './utils/dictUtil';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { filterEmpty } from '../_util/props-util';
import { someType } from '../_util/type';
export const directoryTreeProps = () => _extends(_extends({}, treeProps()), {
  expandAction: someType([Boolean, String])
});
function getIcon(props) {
  const {
    isLeaf,
    expanded
  } = props;
  if (isLeaf) {
    return _createVNode(FileOutlined, null, null);
  }
  return expanded ? _createVNode(FolderOpenOutlined, null, null) : _createVNode(FolderOutlined, null, null);
}
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADirectoryTree',
  inheritAttrs: false,
  props: initDefaultProps(directoryTreeProps(), {
    showIcon: true,
    expandAction: 'click'
  }),
  slots: Object,
  // emits: [
  //   'update:selectedKeys',
  //   'update:checkedKeys',
  //   'update:expandedKeys',
  //   'expand',
  //   'select',
  //   'check',
  //   'doubleclick',
  //   'dblclick',
  //   'click',
  // ],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit,
      expose
    } = _ref;
    var _a;
    // convertTreeToData 兼容 a-tree-node 历史写法，未来a-tree-node移除后，删除相关代码，不要再render中调用 treeData，否则死循环
    const treeData = ref(props.treeData || convertTreeToData(filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))));
    watch(() => props.treeData, () => {
      treeData.value = props.treeData;
    });
    onUpdated(() => {
      nextTick(() => {
        var _a;
        if (props.treeData === undefined && slots.default) {
          treeData.value = convertTreeToData(filterEmpty((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)));
        }
      });
    });
    // Shift click usage
    const lastSelectedKey = ref();
    const cachedSelectedKeys = ref();
    const fieldNames = computed(() => fillFieldNames(props.fieldNames));
    const treeRef = ref();
    const scrollTo = scroll => {
      var _a;
      (_a = treeRef.value) === null || _a === void 0 ? void 0 : _a.scrollTo(scroll);
    };
    expose({
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
    const getInitExpandedKeys = () => {
      const {
        keyEntities
      } = convertDataToEntities(treeData.value, {
        fieldNames: fieldNames.value
      });
      let initExpandedKeys;
      // Expanded keys
      if (props.defaultExpandAll) {
        initExpandedKeys = Object.keys(keyEntities);
      } else if (props.defaultExpandParent) {
        initExpandedKeys = conductExpandParent(props.expandedKeys || props.defaultExpandedKeys || [], keyEntities);
      } else {
        initExpandedKeys = props.expandedKeys || props.defaultExpandedKeys;
      }
      return initExpandedKeys;
    };
    const selectedKeys = ref(props.selectedKeys || props.defaultSelectedKeys || []);
    const expandedKeys = ref(getInitExpandedKeys());
    watch(() => props.selectedKeys, () => {
      if (props.selectedKeys !== undefined) {
        selectedKeys.value = props.selectedKeys;
      }
    }, {
      immediate: true
    });
    watch(() => props.expandedKeys, () => {
      if (props.expandedKeys !== undefined) {
        expandedKeys.value = props.expandedKeys;
      }
    }, {
      immediate: true
    });
    const expandFolderNode = (event, node) => {
      const {
        isLeaf
      } = node;
      if (isLeaf || event.shiftKey || event.metaKey || event.ctrlKey) {
        return;
      }
      // Call internal rc-tree expand function
      // https://github.com/ant-design/ant-design/issues/12567
      treeRef.value.onNodeExpand(event, node);
    };
    const onDebounceExpand = debounce(expandFolderNode, 200, {
      leading: true
    });
    const onExpand = (keys, info) => {
      if (props.expandedKeys === undefined) {
        expandedKeys.value = keys;
      }
      // Call origin function
      emit('update:expandedKeys', keys);
      emit('expand', keys, info);
    };
    const onClick = (event, node) => {
      const {
        expandAction
      } = props;
      // Expand the tree
      if (expandAction === 'click') {
        onDebounceExpand(event, node);
      }
      emit('click', event, node);
    };
    const onDoubleClick = (event, node) => {
      const {
        expandAction
      } = props;
      // Expand the tree
      if (expandAction === 'dblclick' || expandAction === 'doubleclick') {
        onDebounceExpand(event, node);
      }
      emit('doubleclick', event, node);
      emit('dblclick', event, node);
    };
    const onSelect = (keys, event) => {
      const {
        multiple
      } = props;
      const {
        node,
        nativeEvent
      } = event;
      const key = node[fieldNames.value.key];
      // const newState: DirectoryTreeState = {};
      // We need wrap this event since some value is not same
      const newEvent = _extends(_extends({}, event), {
        selected: true
      });
      // Windows / Mac single pick
      const ctrlPick = (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.ctrlKey) || (nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.metaKey);
      const shiftPick = nativeEvent === null || nativeEvent === void 0 ? void 0 : nativeEvent.shiftKey;
      // Generate new selected keys
      let newSelectedKeys;
      if (multiple && ctrlPick) {
        // Control click
        newSelectedKeys = keys;
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData.value, newSelectedKeys, fieldNames.value);
      } else if (multiple && shiftPick) {
        // Shift click
        newSelectedKeys = Array.from(new Set([...(cachedSelectedKeys.value || []), ...calcRangeKeys({
          treeData: treeData.value,
          expandedKeys: expandedKeys.value,
          startKey: key,
          endKey: lastSelectedKey.value,
          fieldNames: fieldNames.value
        })]));
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData.value, newSelectedKeys, fieldNames.value);
      } else {
        // Single click
        newSelectedKeys = [key];
        lastSelectedKey.value = key;
        cachedSelectedKeys.value = newSelectedKeys;
        newEvent.selectedNodes = convertDirectoryKeysToNodes(treeData.value, newSelectedKeys, fieldNames.value);
      }
      emit('update:selectedKeys', newSelectedKeys);
      emit('select', newSelectedKeys, newEvent);
      if (props.selectedKeys === undefined) {
        selectedKeys.value = newSelectedKeys;
      }
    };
    const onCheck = (checkedObjOrKeys, eventObj) => {
      emit('update:checkedKeys', checkedObjOrKeys);
      emit('check', checkedObjOrKeys, eventObj);
    };
    const {
      prefixCls,
      direction
    } = useConfigInject('tree', props);
    return () => {
      const connectClassName = classNames(`${prefixCls.value}-directory`, {
        [`${prefixCls.value}-directory-rtl`]: direction.value === 'rtl'
      }, attrs.class);
      const {
          icon = slots.icon,
          blockNode = true
        } = props,
        otherProps = __rest(props, ["icon", "blockNode"]);
      return _createVNode(Tree, _objectSpread(_objectSpread(_objectSpread({}, attrs), {}, {
        "icon": icon || getIcon,
        "ref": treeRef,
        "blockNode": blockNode
      }, otherProps), {}, {
        "prefixCls": prefixCls.value,
        "class": connectClassName,
        "expandedKeys": expandedKeys.value,
        "selectedKeys": selectedKeys.value,
        "onSelect": onSelect,
        "onClick": onClick,
        "onDblclick": onDoubleClick,
        "onExpand": onExpand,
        "onCheck": onCheck
      }), slots);
    };
  }
});