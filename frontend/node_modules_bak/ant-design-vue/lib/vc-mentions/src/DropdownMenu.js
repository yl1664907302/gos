"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _menu = _interopRequireWildcard(require("../../menu"));
var _MentionsContext = _interopRequireDefault(require("./MentionsContext"));
var _spin = _interopRequireDefault(require("../../spin"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function noop() {}
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'DropdownMenu',
  props: {
    prefixCls: String,
    options: {
      type: Array,
      default: () => []
    }
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      activeIndex,
      setActiveIndex,
      selectOption,
      onFocus = noop,
      loading
    } = (0, _vue.inject)(_MentionsContext.default, {
      activeIndex: (0, _vue.shallowRef)(),
      loading: (0, _vue.shallowRef)(false)
    });
    let timeoutId;
    const onMousedown = e => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onFocus(e);
      });
    };
    (0, _vue.onBeforeUnmount)(() => {
      clearTimeout(timeoutId);
    });
    return () => {
      var _a;
      const {
        prefixCls,
        options
      } = props;
      const activeOption = options[activeIndex.value] || {};
      return (0, _vue.createVNode)(_menu.default, {
        "prefixCls": `${prefixCls}-menu`,
        "activeKey": activeOption.value,
        "onSelect": _ref2 => {
          let {
            key
          } = _ref2;
          const option = options.find(_ref3 => {
            let {
              value
            } = _ref3;
            return value === key;
          });
          selectOption(option);
        },
        "onMousedown": onMousedown
      }, {
        default: () => [!loading.value && options.map((option, index) => {
          var _a, _b;
          const {
            value,
            disabled,
            label = option.value,
            class: className,
            style
          } = option;
          return (0, _vue.createVNode)(_menu.Item, {
            "key": value,
            "disabled": disabled,
            "onMouseenter": () => {
              setActiveIndex(index);
            },
            "class": className,
            "style": style
          }, {
            default: () => [(_b = (_a = slots.option) === null || _a === void 0 ? void 0 : _a.call(slots, option)) !== null && _b !== void 0 ? _b : typeof label === 'function' ? label(option) : label]
          });
        }), !loading.value && options.length === 0 ? (0, _vue.createVNode)(_menu.Item, {
          "key": "notFoundContent",
          "disabled": true
        }, {
          default: () => [(_a = slots.notFoundContent) === null || _a === void 0 ? void 0 : _a.call(slots)]
        }) : null, loading.value && (0, _vue.createVNode)(_menu.Item, {
          "key": "loading",
          "disabled": true
        }, {
          default: () => [(0, _vue.createVNode)(_spin.default, {
            "size": "small"
          }, null)]
        })]
      });
    };
  }
});