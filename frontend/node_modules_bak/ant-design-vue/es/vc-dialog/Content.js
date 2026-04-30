import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { withDirectives as _withDirectives, vShow as _vShow, createVNode as _createVNode } from "vue";
import { Transition, computed, ref, defineComponent, nextTick } from 'vue';
import { getTransitionProps } from '../_util/transition';
import dialogPropTypes from './IDialogPropTypes';
import { offset } from './util';
const sentinelStyle = {
  width: 0,
  height: 0,
  overflow: 'hidden',
  outline: 'none'
};
const entityStyle = {
  outline: 'none'
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'DialogContent',
  inheritAttrs: false,
  props: _extends(_extends({}, dialogPropTypes()), {
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
    const sentinelStartRef = ref();
    const sentinelEndRef = ref();
    const dialogRef = ref();
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
    const transformOrigin = ref();
    const contentStyleRef = computed(() => {
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
      nextTick(() => {
        if (dialogRef.value) {
          const elementOffset = offset(dialogRef.value);
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
        footerNode = _createVNode("div", {
          "class": `${prefixCls}-footer`
        }, [footer]);
      }
      let headerNode;
      if (title) {
        headerNode = _createVNode("div", {
          "class": `${prefixCls}-header`
        }, [_createVNode("div", {
          "class": `${prefixCls}-title`,
          "id": ariaId
        }, [title])]);
      }
      let closer;
      if (closable) {
        closer = _createVNode("button", {
          "type": "button",
          "onClick": onClose,
          "aria-label": "Close",
          "class": `${prefixCls}-close`
        }, [closeIcon || _createVNode("span", {
          "class": `${prefixCls}-close-x`
        }, null)]);
      }
      const content = _createVNode("div", {
        "class": `${prefixCls}-content`
      }, [closer, headerNode, _createVNode("div", _objectSpread({
        "class": `${prefixCls}-body`,
        "style": bodyStyle
      }, bodyProps), [(_d = slots.default) === null || _d === void 0 ? void 0 : _d.call(slots)]), footerNode]);
      const transitionProps = getTransitionProps(motionName);
      return _createVNode(Transition, _objectSpread(_objectSpread({}, transitionProps), {}, {
        "onBeforeEnter": onPrepare,
        "onAfterEnter": () => onVisibleChanged(true),
        "onAfterLeave": () => onVisibleChanged(false)
      }), {
        default: () => [visible || !destroyOnClose ? _withDirectives(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
          "ref": dialogRef,
          "key": "dialog-element",
          "role": "document",
          "style": [contentStyleRef.value, attrs.style],
          "class": [prefixCls, attrs.class],
          "onMousedown": onMousedown,
          "onMouseup": onMouseup
        }), [_createVNode("div", {
          "tabindex": 0,
          "ref": sentinelStartRef,
          "style": entityStyle
        }, [modalRender ? modalRender({
          originVNode: content
        }) : content]), _createVNode("div", {
          "tabindex": 0,
          "ref": sentinelEndRef,
          "style": sentinelStyle
        }, null)]), [[_vShow, visible]]) : null]
      });
    };
  }
});