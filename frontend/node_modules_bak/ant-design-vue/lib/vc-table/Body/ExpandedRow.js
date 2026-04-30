"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _Cell = _interopRequireDefault(require("../Cell"));
var _TableContext = require("../context/TableContext");
var _ExpandedRowContext = require("../context/ExpandedRowContext");
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'ExpandedRow',
  inheritAttrs: false,
  props: ['prefixCls', 'component', 'cellComponent', 'expanded', 'colSpan', 'isEmpty'],
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const tableContext = (0, _TableContext.useInjectTable)();
    const expandedRowContext = (0, _ExpandedRowContext.useInjectExpandedRow)();
    const {
      fixHeader,
      fixColumn,
      componentWidth,
      horizonScroll
    } = expandedRowContext;
    return () => {
      const {
        prefixCls,
        component: Component,
        cellComponent,
        expanded,
        colSpan,
        isEmpty
      } = props;
      return (0, _vue.createVNode)(Component, {
        "class": attrs.class,
        "style": {
          display: expanded ? null : 'none'
        }
      }, {
        default: () => [(0, _vue.createVNode)(_Cell.default, {
          "component": cellComponent,
          "prefixCls": prefixCls,
          "colSpan": colSpan
        }, {
          default: () => {
            var _a;
            let contentNode = (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
            if (isEmpty ? horizonScroll.value : fixColumn.value) {
              const _contentNode = function () {
                return contentNode;
              }();
              contentNode = (0, _vue.createVNode)("div", {
                "style": {
                  width: `${componentWidth.value - (fixHeader.value ? tableContext.scrollbarSize : 0)}px`,
                  position: 'sticky',
                  left: 0,
                  overflow: 'hidden'
                },
                "class": `${prefixCls}-expanded-row-fixed`
              }, [contentNode]);
            }
            return contentNode;
          }
        })]
      });
    };
  }
});