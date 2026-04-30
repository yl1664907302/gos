import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { computed, watchEffect, defineComponent, ref, watch, toRaw } from 'vue';
import PropTypes from '../_util/vue-types';
import { getPropsSlot } from '../_util/props-util';
import classNames from '../_util/classNames';
import List from './list';
import Operation from './operation';
import LocaleReceiver from '../locale-provider/LocaleReceiver';
import defaultLocale from '../locale/en_US';
import { withInstall, stringType, arrayType, someType, booleanType, objectType, functionType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { FormItemInputContext, useInjectFormItemContext } from '../form/FormItemContext';
import { getStatusClassNames, getMergedStatus } from '../_util/statusUtils';
import { groupKeysMap, groupDisabledKeysMap } from '../_util/transKeys';
// CSSINJS
import useStyle from './style';
export const transferProps = () => ({
  id: String,
  prefixCls: String,
  dataSource: arrayType([]),
  disabled: booleanType(),
  targetKeys: arrayType(),
  selectedKeys: arrayType(),
  render: functionType(),
  listStyle: someType([Function, Object], () => ({})),
  operationStyle: objectType(undefined),
  titles: arrayType(),
  operations: arrayType(),
  showSearch: booleanType(false),
  filterOption: functionType(),
  searchPlaceholder: String,
  notFoundContent: PropTypes.any,
  locale: objectType(),
  rowKey: functionType(),
  showSelectAll: booleanType(),
  selectAllLabels: arrayType(),
  children: functionType(),
  oneWay: booleanType(),
  pagination: someType([Object, Boolean]),
  status: stringType(),
  onChange: functionType(),
  onSelectChange: functionType(),
  onSearch: functionType(),
  onScroll: functionType(),
  'onUpdate:targetKeys': functionType(),
  'onUpdate:selectedKeys': functionType()
});
const Transfer = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ATransfer',
  inheritAttrs: false,
  props: transferProps(),
  slots: Object,
  // emits: ['update:targetKeys', 'update:selectedKeys', 'change', 'search', 'scroll', 'selectChange'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      slots,
      expose
    } = _ref;
    const {
      configProvider,
      prefixCls,
      direction
    } = useConfigInject('transfer', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const sourceSelectedKeys = ref([]);
    const targetSelectedKeys = ref([]);
    const formItemContext = useInjectFormItemContext();
    const formItemInputContext = FormItemInputContext.useInject();
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.status, props.status));
    watch(() => props.selectedKeys, () => {
      var _a, _b;
      sourceSelectedKeys.value = ((_a = props.selectedKeys) === null || _a === void 0 ? void 0 : _a.filter(key => props.targetKeys.indexOf(key) === -1)) || [];
      targetSelectedKeys.value = ((_b = props.selectedKeys) === null || _b === void 0 ? void 0 : _b.filter(key => props.targetKeys.indexOf(key) > -1)) || [];
    }, {
      immediate: true
    });
    const getLocale = (transferLocale, renderEmpty) => {
      // Keep old locale props still working.
      const oldLocale = {
        notFoundContent: renderEmpty('Transfer')
      };
      const notFoundContent = getPropsSlot(slots, props, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (props.searchPlaceholder !== undefined) {
        oldLocale.searchPlaceholder = props.searchPlaceholder;
      }
      return _extends(_extends(_extends({}, transferLocale), oldLocale), props.locale);
    };
    const moveTo = direction => {
      const {
        targetKeys = [],
        dataSource = []
      } = props;
      const moveKeys = direction === 'right' ? sourceSelectedKeys.value : targetSelectedKeys.value;
      const dataSourceDisabledKeysMap = groupDisabledKeysMap(dataSource);
      // filter the disabled options
      const newMoveKeys = moveKeys.filter(key => !dataSourceDisabledKeysMap.has(key));
      const newMoveKeysMap = groupKeysMap(newMoveKeys);
      // move items to target box
      const newTargetKeys = direction === 'right' ? newMoveKeys.concat(targetKeys) : targetKeys.filter(targetKey => !newMoveKeysMap.has(targetKey));
      // empty checked keys
      const oppositeDirection = direction === 'right' ? 'left' : 'right';
      direction === 'right' ? sourceSelectedKeys.value = [] : targetSelectedKeys.value = [];
      emit('update:targetKeys', newTargetKeys);
      handleSelectChange(oppositeDirection, []);
      emit('change', newTargetKeys, direction, newMoveKeys);
      formItemContext.onFieldChange();
    };
    const moveToLeft = () => {
      moveTo('left');
    };
    const moveToRight = () => {
      moveTo('right');
    };
    const onItemSelectAll = (direction, selectedKeys) => {
      handleSelectChange(direction, selectedKeys);
    };
    const onLeftItemSelectAll = selectedKeys => {
      return onItemSelectAll('left', selectedKeys);
    };
    const onRightItemSelectAll = selectedKeys => {
      return onItemSelectAll('right', selectedKeys);
    };
    const handleSelectChange = (direction, holder) => {
      if (direction === 'left') {
        if (!props.selectedKeys) {
          sourceSelectedKeys.value = holder;
        }
        emit('update:selectedKeys', [...holder, ...targetSelectedKeys.value]);
        emit('selectChange', holder, toRaw(targetSelectedKeys.value));
      } else {
        if (!props.selectedKeys) {
          targetSelectedKeys.value = holder;
        }
        emit('update:selectedKeys', [...holder, ...sourceSelectedKeys.value]);
        emit('selectChange', toRaw(sourceSelectedKeys.value), holder);
      }
    };
    const handleFilter = (direction, e) => {
      const value = e.target.value;
      emit('search', direction, value);
    };
    const handleLeftFilter = e => {
      handleFilter('left', e);
    };
    const handleRightFilter = e => {
      handleFilter('right', e);
    };
    const handleClear = direction => {
      emit('search', direction, '');
    };
    const handleLeftClear = () => {
      handleClear('left');
    };
    const handleRightClear = () => {
      handleClear('right');
    };
    const onItemSelect = (direction, selectedKey, checked) => {
      const holder = direction === 'left' ? [...sourceSelectedKeys.value] : [...targetSelectedKeys.value];
      const index = holder.indexOf(selectedKey);
      if (index > -1) {
        holder.splice(index, 1);
      }
      if (checked) {
        holder.push(selectedKey);
      }
      handleSelectChange(direction, holder);
    };
    const onLeftItemSelect = (selectedKey, checked) => {
      return onItemSelect('left', selectedKey, checked);
    };
    const onRightItemSelect = (selectedKey, checked) => {
      return onItemSelect('right', selectedKey, checked);
    };
    const onRightItemRemove = targetedKeys => {
      const {
        targetKeys = []
      } = props;
      const newTargetKeys = targetKeys.filter(key => !targetedKeys.includes(key));
      emit('update:targetKeys', newTargetKeys);
      emit('change', newTargetKeys, 'left', [...targetedKeys]);
    };
    const handleScroll = (direction, e) => {
      emit('scroll', direction, e);
    };
    const handleLeftScroll = e => {
      handleScroll('left', e);
    };
    const handleRightScroll = e => {
      handleScroll('right', e);
    };
    const handleListStyle = (listStyle, direction) => {
      if (typeof listStyle === 'function') {
        return listStyle({
          direction
        });
      }
      return listStyle;
    };
    const leftDataSource = ref([]);
    const rightDataSource = ref([]);
    watchEffect(() => {
      const {
        dataSource,
        rowKey,
        targetKeys = []
      } = props;
      const ld = [];
      const rd = new Array(targetKeys.length);
      const targetKeysMap = groupKeysMap(targetKeys);
      dataSource.forEach(record => {
        if (rowKey) {
          record.key = rowKey(record);
        }
        // rightData should be ordered by targetKeys
        // leftData should be ordered by dataSource
        if (targetKeysMap.has(record.key)) {
          rd[targetKeysMap.get(record.key)] = record;
        } else {
          ld.push(record);
        }
      });
      leftDataSource.value = ld;
      rightDataSource.value = rd;
    });
    expose({
      handleSelectChange
    });
    const renderTransfer = transferLocale => {
      var _a, _b, _c, _d, _e, _f;
      const {
        disabled,
        operations = [],
        showSearch,
        listStyle,
        operationStyle,
        filterOption,
        showSelectAll,
        selectAllLabels = [],
        oneWay,
        pagination,
        id = formItemContext.id.value
      } = props;
      const {
        class: className,
        style
      } = attrs;
      const children = slots.children;
      const mergedPagination = !children && pagination;
      const renderEmpty = configProvider.renderEmpty;
      const locale = getLocale(transferLocale, renderEmpty);
      const {
        footer
      } = slots;
      const renderItem = props.render || slots.render;
      const leftActive = targetSelectedKeys.value.length > 0;
      const rightActive = sourceSelectedKeys.value.length > 0;
      const cls = classNames(prefixCls.value, className, {
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-customize-list`]: !!children,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, getStatusClassNames(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), hashId.value);
      const titles = props.titles;
      const leftTitle = (_c = (_a = titles && titles[0]) !== null && _a !== void 0 ? _a : (_b = slots.leftTitle) === null || _b === void 0 ? void 0 : _b.call(slots)) !== null && _c !== void 0 ? _c : (locale.titles || ['', ''])[0];
      const rightTitle = (_f = (_d = titles && titles[1]) !== null && _d !== void 0 ? _d : (_e = slots.rightTitle) === null || _e === void 0 ? void 0 : _e.call(slots)) !== null && _f !== void 0 ? _f : (locale.titles || ['', ''])[1];
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": cls,
        "style": style,
        "id": id
      }), [_createVNode(List, _objectSpread({
        "key": "leftList",
        "prefixCls": `${prefixCls.value}-list`,
        "dataSource": leftDataSource.value,
        "filterOption": filterOption,
        "style": handleListStyle(listStyle, 'left'),
        "checkedKeys": sourceSelectedKeys.value,
        "handleFilter": handleLeftFilter,
        "handleClear": handleLeftClear,
        "onItemSelect": onLeftItemSelect,
        "onItemSelectAll": onLeftItemSelectAll,
        "renderItem": renderItem,
        "showSearch": showSearch,
        "renderList": children,
        "onScroll": handleLeftScroll,
        "disabled": disabled,
        "direction": direction.value === 'rtl' ? 'right' : 'left',
        "showSelectAll": showSelectAll,
        "selectAllLabel": selectAllLabels[0] || slots.leftSelectAllLabel,
        "pagination": mergedPagination
      }, locale), {
        titleText: () => leftTitle,
        footer
      }), _createVNode(Operation, {
        "key": "operation",
        "class": `${prefixCls.value}-operation`,
        "rightActive": rightActive,
        "rightArrowText": operations[0],
        "moveToRight": moveToRight,
        "leftActive": leftActive,
        "leftArrowText": operations[1],
        "moveToLeft": moveToLeft,
        "style": operationStyle,
        "disabled": disabled,
        "direction": direction.value,
        "oneWay": oneWay
      }, null), _createVNode(List, _objectSpread({
        "key": "rightList",
        "prefixCls": `${prefixCls.value}-list`,
        "dataSource": rightDataSource.value,
        "filterOption": filterOption,
        "style": handleListStyle(listStyle, 'right'),
        "checkedKeys": targetSelectedKeys.value,
        "handleFilter": handleRightFilter,
        "handleClear": handleRightClear,
        "onItemSelect": onRightItemSelect,
        "onItemSelectAll": onRightItemSelectAll,
        "onItemRemove": onRightItemRemove,
        "renderItem": renderItem,
        "showSearch": showSearch,
        "renderList": children,
        "onScroll": handleRightScroll,
        "disabled": disabled,
        "direction": direction.value === 'rtl' ? 'left' : 'right',
        "showSelectAll": showSelectAll,
        "selectAllLabel": selectAllLabels[1] || slots.rightSelectAllLabel,
        "showRemove": oneWay,
        "pagination": mergedPagination
      }, locale), {
        titleText: () => rightTitle,
        footer
      })]);
    };
    return () => wrapSSR(_createVNode(LocaleReceiver, {
      "componentName": "Transfer",
      "defaultLocale": defaultLocale.Transfer,
      "children": renderTransfer
    }, null));
  }
});
export default withInstall(Transfer);