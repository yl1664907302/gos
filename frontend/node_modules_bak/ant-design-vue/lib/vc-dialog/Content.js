"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _transition = require("../_util/transition");
var _IDialogPropTypes = _interopRequireDefault(require("./IDialogPropTypes"));
var _util = require("./util");
const sentinelStyle = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none'
};
const entityStyle = {
  outline: 'none'
};
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogContent',
  inheritAttrs: false,
  props: (0, _extends2.default)((0, _extends2.default)({}, (0, _IDialogPropTypes.default)()), {
    motionName: String,
    ariaId: String,
    onVisibleChanged: Function,
    onMousedown: Function,
    onMouseup: Function
  }),
  setup(props, _ref) {
    let {
      expose,
      slots,
      attrs
    } = _ref;
    const sentinelStartRef = (0, _vue.ref)();
    const sentinelEndRef = (0, _vue.ref)();
    const dialogRef = (0, _vue.ref)();
    expose({
      focus: () => {
        var _a;
        (_a = sentinelStartRef.value) === null || _a === void 0 ? void 0 : _a.focus({
          preventScroll: true
        });
      },
      changeActive: next => {
        const {
          activeElement
        } = document;
        if (next && activeElement === sentinelEndRef.value) {
          sentinelStartRef.value.focus({
            preventScroll: true
          });
        } else if (!next && activeElement === sentinelStartRef.value) {
          sentinelEndRef.value.focus({
            preventScroll: true
          });
        }
      }
    });
    const transformOrigin = (0, _vue.ref)();
    const contentStyleRef = (0, _vue.computed)(() => {
      const {
        width,
        height
      } = props;
      const contentStyle = {};
      if (width !== undefined) {
        contentStyle.width = typeof width === 'number' ? `${width}px` : width;
      }
      if (height !== undefined) {
        contentStyle.height = typeof height === 'number' ? `${height}px` : height;
      }
      if (transformOrigin.value) {
        contentStyle.transformOrigin = transformOrigin.value;
      }
      return contentStyle;
    });
    const onPrepare = () => {
      (0, _vue.nextTick)(() => {
        if (dialogRef.value) {
          const elementOffset = (0, _util.offset)(dialogRef.value);
          transformOrigin.value = props.mousePosition ? `${props.mousePosition.x - elementOffset.left}px ${props.mousePosition.y - elementOffset.top}px` : '';
        }
      });
    };
    const onVisibleChanged = visible => {
      props.onVisibleChanged(visible);
    };
    return () => {
      var _a, _b, _c, _d;
      const {
        prefixCls,
        footer = (_a = slots.footer) === null || _a === void 0 ? void 0 : _a.call(slots),
        title = (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots),
        ariaId,
        closable,
        closeIcon = (_c = slots.closeIcon) === null || _c === void 0 ? void 0 : _c.call(slots),
        onClose,
        bodyStyle,
        bodyProps,
        onMousedown,
        onMouseup,
        visible,
        modalRender = slots.modalRender,
        destroyOnClose,
        motionName
      } = props;
      let footerNode;
      if (footer) {
        footerNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-footer`
        }, [footer]);
      }
      let headerNode;
      if (title) {
        headerNode = (0, _vue.createVNode)("div", {
          "class": `${prefixCls}-header`
        }, [(0, _vue.createVNode)("div", {
          "class": `${prefixCls}-title`,
          "id": ariaId
        }, [title])]);
      }
      let closer;
      if (closable) {
        closer = (0, _vue.createVNode)("button", {
          "type": "button",
          "onClick": onClose,
          "aria-label": "Close",
          "class": `${prefixCls}-close`
        }, [closeIcon || (0, _vue.createVNode)("span", {
          "class": `${prefixCls}-close-x`
        }, null)]);
      }
      const content = (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-content`
      }, [closer, headerNode, (0, _vue.createVNode)("div", (0, _objectSpread2.default)({
        "class": `${prefixCls}-body`,
        "style": bodyStyle
      }, bodyProps), [(_d = slots.default) === null || _d === void 0 ? void 0 : _d.call(slots)]), footerNode]);
      const transitionProps = (0, _transition.getTransitionProps)(motionName);
      return (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, transitionProps), {}, {
        "onBeforeEnter": onPrepare,
        "onAfterEnter": () => onVisibleChanged(true),
        "onAfterLeave": () => onVisibleChanged(false)
      }), {
        default: () => [visible || !destroyOnClose ? (0, _vue.withDirectives)((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
          "ref": dialogRef,
          "key": "dialog-element",
          "role": "document",
          "style": [contentStyleRef.value, attrs.style],
          "class": [prefixCls, attrs.class],
          "onMousedown": onMousedown,
          "onMouseup": onMouseup
        }), [(0, _vue.createVNode)("div", {
          "tabindex": 0,
          "ref": sentinelStartRef,
          "style": entityStyle
        }, [modalRender ? modalRender({
          originVNode: content
        }) : content]), (0, _vue.createVNode)("div", {
          "tabindex": 0,
          "ref": sentinelEndRef,
          "style": sentinelStyle
        }, null)]), [[_vue.vShow, visible]]) : null]
      });
    };
  }
});