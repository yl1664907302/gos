"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _uiUtil = require("../../utils/uiUtil");
var _PanelContext = require("../../PanelContext");
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
  name: 'TimeUnitColumn',
  props: ['prefixCls', 'units', 'onSelect', 'value', 'active', 'hideDisabledOptions'],
  setup(props) {
    const {
      open
    } = (0, _PanelContext.useInjectPanel)();
    const ulRef = (0, _vue.shallowRef)(null);
    const liRefs = (0, _vue.ref)(new Map());
    const scrollRef = (0, _vue.ref)();
    (0, _vue.watch)(() => props.value, () => {
      const li = liRefs.value.get(props.value);
      if (li && open.value !== false) {
        (0, _uiUtil.scrollTo)(ulRef.value, li.offsetTop, 120);
      }
    });
    (0, _vue.onBeforeUnmount)(() => {
      var _a;
      (_a = scrollRef.value) === null || _a === void 0 ? void 0 : _a.call(scrollRef);
    });
    (0, _vue.watch)(open, () => {
      var _a;
      (_a = scrollRef.value) === null || _a === void 0 ? void 0 : _a.call(scrollRef);
      (0, _vue.nextTick)(() => {
        if (open.value) {
          const li = liRefs.value.get(props.value);
          if (li) {
            scrollRef.value = (0, _uiUtil.waitElementReady)(li, () => {
              (0, _uiUtil.scrollTo)(ulRef.value, li.offsetTop, 0);
            });
          }
        }
      });
    }, {
      immediate: true,
      flush: 'post'
    });
    return () => {
      const {
        prefixCls,
        units,
        onSelect,
        value,
        active,
        hideDisabledOptions
      } = props;
      const cellPrefixCls = `${prefixCls}-cell`;
      return (0, _vue.createVNode)("ul", {
        "class": (0, _classNames.default)(`${prefixCls}-column`, {
          [`${prefixCls}-column-active`]: active
        }),
        "ref": ulRef,
        "style": {
          position: 'relative'
        }
      }, [units.map(unit => {
        if (hideDisabledOptions && unit.disabled) {
          return null;
        }
        return (0, _vue.createVNode)("li", {
          "key": unit.value,
          "ref": element => {
            liRefs.value.set(unit.value, element);
          },
          "class": (0, _classNames.default)(cellPrefixCls, {
            [`${cellPrefixCls}-disabled`]: unit.disabled,
            [`${cellPrefixCls}-selected`]: value === unit.value
          }),
          "onClick": () => {
            if (unit.disabled) {
              return;
            }
            onSelect(unit.value);
          }
        }, [(0, _vue.createVNode)("div", {
          "class": `${cellPrefixCls}-inner`
        }, [unit.label])]);
      })]);
    };
  }
});