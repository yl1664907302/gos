"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _KeyCode = _interopRequireDefault(require("../../../_util/KeyCode"));
var _classNames = _interopRequireDefault(require("../../../_util/classNames"));
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'TabNode',
  props: {
    id: {
      type: String
    },
    prefixCls: {
      type: String
    },
    tab: {
      type: Object
    },
    active: {
      type: Boolean
    },
    closable: {
      type: Boolean
    },
    editable: {
      type: Object
    },
    onClick: {
      type: Function
    },
    onResize: {
      type: Function
    },
    renderWrapper: {
      type: Function
    },
    removeAriaLabel: {
      type: String
    },
    // onRemove: { type: Function as PropType<() => void> },
    onFocus: {
      type: Function
    }
  },
  emits: ['click', 'resize', 'remove', 'focus'],
  setup(props, _ref) {
    let {
      expose,
      attrs
    } = _ref;
    const domRef = (0, _vue.ref)();
    function onInternalClick(e) {
      var _a;
      if ((_a = props.tab) === null || _a === void 0 ? void 0 : _a.disabled) {
        return;
      }
      props.onClick(e);
    }
    expose({
      domRef
    });
    // onBeforeUnmount(() => {
    //   props.onRemove();
    // });
    function onRemoveTab(event) {
      var _a;
      event.preventDefault();
      event.stopPropagation();
      props.editable.onEdit('remove', {
        key: (_a = props.tab) === null || _a === void 0 ? void 0 : _a.key,
        event
      });
    }
    const removable = (0, _vue.computed)(() => {
      var _a;
      return props.editable && props.closable !== false && !((_a = props.tab) === null || _a === void 0 ? void 0 : _a.disabled);
    });
    return () => {
      var _a;
      const {
        prefixCls,
        id,
        active,
        tab: {
          key,
          tab,
          disabled,
          closeIcon
        },
        renderWrapper,
        removeAriaLabel,
        editable,
        onFocus
      } = props;
      const tabPrefix = `${prefixCls}-tab`;
      const node = (0, _vue.createVNode)("div", {
        "key": key,
        "ref": domRef,
        "class": (0, _classNames.default)(tabPrefix, {
          [`${tabPrefix}-with-remove`]: removable.value,
          [`${tabPrefix}-active`]: active,
          [`${tabPrefix}-disabled`]: disabled
        }),
        "style": attrs.style,
        "onClick": onInternalClick
      }, [(0, _vue.createVNode)("div", {
        "role": "tab",
        "aria-selected": active,
        "id": id && `${id}-tab-${key}`,
        "class": `${tabPrefix}-btn`,
        "aria-controls": id && `${id}-panel-${key}`,
        "aria-disabled": disabled,
        "tabindex": disabled ? null : 0,
        "onClick": e => {
          e.stopPropagation();
          onInternalClick(e);
        },
        "onKeydown": e => {
          if ([_KeyCode.default.SPACE, _KeyCode.default.ENTER].includes(e.which)) {
            e.preventDefault();
            onInternalClick(e);
          }
        },
        "onFocus": onFocus
      }, [typeof tab === 'function' ? tab() : tab]), removable.value && (0, _vue.createVNode)("button", {
        "type": "button",
        "aria-label": removeAriaLabel || 'remove',
        "tabindex": 0,
        "class": `${tabPrefix}-remove`,
        "onClick": e => {
          e.stopPropagation();
          onRemoveTab(e);
        }
      }, [(closeIcon === null || closeIcon === void 0 ? void 0 : closeIcon()) || ((_a = editable.removeIcon) === null || _a === void 0 ? void 0 : _a.call(editable)) || '×'])]);
      return renderWrapper ? renderWrapper(node) : node;
    };
  }
});