"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _vcResizeObserver = _interopRequireDefault(require("../../vc-resize-observer"));
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'MeasureCell',
  props: ['columnKey'],
  setup(props, _ref) {
    let {
      emit
    } = _ref;
    const tdRef = (0, _vue.ref)();
    (0, _vue.onMounted)(() => {
      if (tdRef.value) {
        emit('columnResize', props.columnKey, tdRef.value.offsetWidth);
      }
    });
    return () => {
      return (0, _vue.createVNode)(_vcResizeObserver.default, {
        "onResize": _ref2 => {
          let {
            offsetWidth
          } = _ref2;
          emit('columnResize', props.columnKey, offsetWidth);
        }
      }, {
        default: () => [(0, _vue.createVNode)("td", {
          "ref": tdRef,
          "style": {
            padding: 0,
            border: 0,
            height: 0
          }
        }, [(0, _vue.createVNode)("div", {
          "style": {
            height: 0,
            overflow: 'hidden'
          }
        }, [(0, _vue.createTextVNode)("\xA0")])])]
      });
    };
  }
});