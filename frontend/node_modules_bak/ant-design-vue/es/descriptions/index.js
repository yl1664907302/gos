import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { onBeforeMount, ref, defineComponent, onBeforeUnmount, provide, toRef, computed } from 'vue';
import warning from '../_util/warning';
import useResponsiveObserve, { responsiveArray } from '../_util/responsiveObserve';
import Row from './Row';
import PropTypes from '../_util/vue-types';
import { cloneElement } from '../_util/vnode';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
export const DescriptionsItemProps = {
  prefixCls: String,
  label: PropTypes.any,
  span: Number
};
const descriptionsItemProp = () => ({
  prefixCls: String,
  label: PropTypes.any,
  labelStyle: {
    type: Object,
    default: undefined
  },
  contentStyle: {
    type: Object,
    default: undefined
  },
  span: {
    type: Number,
    default: 1
  }
});
export const DescriptionsItem = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADescriptionsItem',
  props: descriptionsItemProp(),
  setup(_, _ref) {
    let {
      slots
    } = _ref;
    return () => {
      var _a;
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
const DEFAULT_COLUMN_MAP = {
  xxxl: 3,
  xxl: 3,
  xl: 3,
  lg: 3,
  md: 3,
  sm: 2,
  xs: 1
};
function getColumn(column, screens) {
  if (typeof column === 'number') {
    return column;
  }
  if (typeof column === 'object') {
    for (let i = 0; i < responsiveArray.length; i++) {
      const breakpoint = responsiveArray[i];
      if (screens[breakpoint] && column[breakpoint] !== undefined) {
        return column[breakpoint] || DEFAULT_COLUMN_MAP[breakpoint];
      }
    }
  }
  return 3;
}
function getFilledItem(node, rowRestCol, span) {
  let clone = node;
  if (span === undefined || span > rowRestCol) {
    clone = cloneElement(node, {
      span: rowRestCol
    });
    warning(span === undefined, 'Descriptions', 'Sum of column `span` in a line not match `column` of Descriptions.');
  }
  return clone;
}
function getRows(children, column) {
  const childNodes = flattenChildren(children);
  const rows = [];
  let tmpRow = [];
  let rowRestCol = column;
  childNodes.forEach((node, index) => {
    var _a;
    const span = (_a = node.props) === null || _a === void 0 ? void 0 : _a.span;
    const mergedSpan = span || 1;
    // Additional handle last one
    if (index === childNodes.length - 1) {
      tmpRow.push(getFilledItem(node, rowRestCol, span));
      rows.push(tmpRow);
      return;
    }
    if (mergedSpan < rowRestCol) {
      rowRestCol -= mergedSpan;
      tmpRow.push(node);
    } else {
      tmpRow.push(getFilledItem(node, rowRestCol, mergedSpan));
      rows.push(tmpRow);
      rowRestCol = column;
      tmpRow = [];
    }
  });
  return rows;
}
export const descriptionsProps = () => ({
  prefixCls: String,
  bordered: {
    type: Boolean,
    default: undefined
  },
  size: {
    type: String,
    default: 'default'
  },
  title: PropTypes.any,
  extra: PropTypes.any,
  column: {
    type: [Number, Object],
    default: () => DEFAULT_COLUMN_MAP
  },
  layout: String,
  colon: {
    type: Boolean,
    default: undefined
  },
  labelStyle: {
    type: Object,
    default: undefined
  },
  contentStyle: {
    type: Object,
    default: undefined
  }
});
export const descriptionsContext = Symbol('descriptionsContext');
const Descriptions = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ADescriptions',
  inheritAttrs: false,
  props: descriptionsProps(),
  slots: Object,
  Item: DescriptionsItem,
  setup(props, _ref2) {
    let {
      slots,
      attrs
    } = _ref2;
    const {
      prefixCls,
      direction
    } = useConfigInject('descriptions', props);
    let token;
    const screens = ref({});
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const responsiveObserve = useResponsiveObserve();
    onBeforeMount(() => {
      token = responsiveObserve.value.subscribe(screen => {
        if (typeof props.column !== 'object') {
          return;
        }
        screens.value = screen;
      });
    });
    onBeforeUnmount(() => {
      responsiveObserve.value.unsubscribe(token);
    });
    provide(descriptionsContext, {
      labelStyle: toRef(props, 'labelStyle'),
      contentStyle: toRef(props, 'contentStyle')
    });
    const mergeColumn = computed(() => getColumn(props.column, screens.value));
    return () => {
      var _a, _b, _c;
      const {
        size,
        bordered = false,
        layout = 'horizontal',
        colon = true,
        title = (_a = slots.title) === null || _a === void 0 ? void 0 : _a.call(slots),
        extra = (_b = slots.extra) === null || _b === void 0 ? void 0 : _b.call(slots)
      } = props;
      const children = (_c = slots.default) === null || _c === void 0 ? void 0 : _c.call(slots);
      const rows = getRows(children, mergeColumn.value);
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [prefixCls.value, {
          [`${prefixCls.value}-${size}`]: size !== 'default',
          [`${prefixCls.value}-bordered`]: !!bordered,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [(title || extra) && _createVNode("div", {
        "class": `${prefixCls.value}-header`
      }, [title && _createVNode("div", {
        "class": `${prefixCls.value}-title`
      }, [title]), extra && _createVNode("div", {
        "class": `${prefixCls.value}-extra`
      }, [extra])]), _createVNode("div", {
        "class": `${prefixCls.value}-view`
      }, [_createVNode("table", null, [_createVNode("tbody", null, [rows.map((row, index) => _createVNode(Row, {
        "key": index,
        "index": index,
        "colon": colon,
        "prefixCls": prefixCls.value,
        "vertical": layout === 'vertical',
        "bordered": bordered,
        "row": row
      }, null))])])])]));
    };
  }
});
Descriptions.install = function (app) {
  app.component(Descriptions.name, Descriptions);
  app.component(Descriptions.Item.name, Descriptions.Item);
  return app;
};
export default Descriptions;