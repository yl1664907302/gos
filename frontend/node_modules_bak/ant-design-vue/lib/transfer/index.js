"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transferProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _list = _interopRequireDefault(require("./list"));
var _operation = _interopRequireDefault(require("./operation"));
var _LocaleReceiver = _interopRequireDefault(require("../locale-provider/LocaleReceiver"));
var _en_US = _interopRequireDefault(require("../locale/en_US"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _FormItemContext = require("../form/FormItemContext");
var _statusUtils = require("../_util/statusUtils");
var _transKeys = require("../_util/transKeys");
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const transferProps = () => ({
  id: String,
  prefixCls: String,
  dataSource: (0, _type.arrayType)([]),
  disabled: (0, _type.booleanType)(),
  targetKeys: (0, _type.arrayType)(),
  selectedKeys: (0, _type.arrayType)(),
  render: (0, _type.functionType)(),
  listStyle: (0, _type.someType)([Function, Object], () => ({})),
  operationStyle: (0, _type.objectType)(undefined),
  titles: (0, _type.arrayType)(),
  operations: (0, _type.arrayType)(),
  showSearch: (0, _type.booleanType)(false),
  filterOption: (0, _type.functionType)(),
  searchPlaceholder: String,
  notFoundContent: _vueTypes.default.any,
  locale: (0, _type.objectType)(),
  rowKey: (0, _type.functionType)(),
  showSelectAll: (0, _type.booleanType)(),
  selectAllLabels: (0, _type.arrayType)(),
  children: (0, _type.functionType)(),
  oneWay: (0, _type.booleanType)(),
  pagination: (0, _type.someType)([Object, Boolean]),
  status: (0, _type.stringType)(),
  onChange: (0, _type.functionType)(),
  onSelectChange: (0, _type.functionType)(),
  onSearch: (0, _type.functionType)(),
  onScroll: (0, _type.functionType)(),
  'onUpdate:targetKeys': (0, _type.functionType)(),
  'onUpdate:selectedKeys': (0, _type.functionType)()
});
exports.transferProps = transferProps;
const Transfer = (0, _vue.defineComponent)({
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
    } = (0, _useConfigInject.default)('transfer', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const sourceSelectedKeys = (0, _vue.ref)([]);
    const targetSelectedKeys = (0, _vue.ref)([]);
    const formItemContext = (0, _FormItemContext.useInjectFormItemContext)();
    const formItemInputContext = _FormItemContext.FormItemInputContext.useInject();
    const mergedStatus = (0, _vue.computed)(() => (0, _statusUtils.getMergedStatus)(formItemInputContext.status, props.status));
    (0, _vue.watch)(() => props.selectedKeys, () => {
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
      const notFoundContent = (0, _propsUtil.getPropsSlot)(slots, props, 'notFoundContent');
      if (notFoundContent) {
        oldLocale.notFoundContent = notFoundContent;
      }
      if (props.searchPlaceholder !== undefined) {
        oldLocale.searchPlaceholder = props.searchPlaceholder;
      }
      return (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, transferLocale), oldLocale), props.locale);
    };
    const moveTo = direction => {
      const {
        targetKeys = [],
        dataSource = []
      } = props;
      const moveKeys = direction === 'right' ? sourceSelectedKeys.value : targetSelectedKeys.value;
      const dataSourceDisabledKeysMap = (0, _transKeys.groupDisabledKeysMap)(dataSource);
      // filter the disabled options
      const newMoveKeys = moveKeys.filter(key => !dataSourceDisabledKeysMap.has(key));
      const newMoveKeysMap = (0, _transKeys.groupKeysMap)(newMoveKeys);
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
        emit('selectChange', holder, (0, _vue.toRaw)(targetSelectedKeys.value));
      } else {
        if (!props.selectedKeys) {
          targetSelectedKeys.value = holder;
        }
        emit('update:selectedKeys', [...holder, ...sourceSelectedKeys.value]);
        emit('selectChange', (0, _vue.toRaw)(sourceSelectedKeys.value), holder);
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
    const leftDataSource = (0, _vue.ref)([]);
    const rightDataSource = (0, _vue.ref)([]);
    (0, _vue.watchEffect)(() => {
      const {
        dataSource,
        rowKey,
        targetKeys = []
      } = props;
      const ld = [];
      const rd = new Array(targetKeys.length);
      const targetKeysMap = (0, _transKeys.groupKeysMap)(targetKeys);
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
      const cls = (0, _classNames.default)(prefixCls.value, className, {
        [`${prefixCls.value}-disabled`]: disabled,
        [`${prefixCls.value}-customize-list`]: !!children,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
      }, (0, _statusUtils.getStatusClassNames)(prefixCls.value, mergedStatus.value, formItemInputContext.hasFeedback), hashId.value);
      const titles = props.titles;
      const leftTitle = (_c = (_a = titles && titles[0]) !== null && _a !== void 0 ? _a : (_b = slots.leftTitle) === null || _b === void 0 ? void 0 : _b.call(slots)) !== null && _c !== void 0 ? _c : (locale.titles || ['', ''])[0];
      const rightTitle = (_f = (_d = titles && titles[1]) !== null && _d !== void 0 ? _d : (_e = slots.rightTitle) === null || _e === void 0 ? void 0 : _e.call(slots)) !== null && _f !== void 0 ? _f : (locale.titles || ['', ''])[1];
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": cls,
        "style": style,
        "id": id
      }), [(0, _vue.createVNode)(_list.default, (0, _objectSpread2.default)({
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
      }), (0, _vue.createVNode)(_operation.default, {
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
      }, null), (0, _vue.createVNode)(_list.default, (0, _objectSpread2.default)({
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
    return () => wrapSSR((0, _vue.createVNode)(_LocaleReceiver.default, {
      "componentName": "Transfer",
      "defaultLocale": _en_US.default.Transfer,
      "children": renderTransfer
    }, null));
  }
});
var _default = exports.default = (0, _type.withInstall)(Transfer);