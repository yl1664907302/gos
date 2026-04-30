"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.previewProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _vcDialog = _interopRequireDefault(require("../../vc-dialog"));
var _IDialogPropTypes = require("../../vc-dialog/IDialogPropTypes");
var _css = require("../../vc-util/Dom/css");
var _addEventListener = _interopRequireDefault(require("../../vc-util/Dom/addEventListener"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _warning = require("../../vc-util/warning");
var _useFrameSetState = _interopRequireDefault(require("./hooks/useFrameSetState"));
var _getFixScaleEleTransPosition = _interopRequireDefault(require("./getFixScaleEleTransPosition"));
var _PreviewGroup = require("./PreviewGroup");
const initialPosition = {
  x: 0,
  y: 0
};
const previewProps = exports.previewProps = (0, _extends2.default)((0, _extends2.default)({}, (0, _IDialogPropTypes.dialogPropTypes)()), {
  src: String,
  alt: String,
  rootClassName: String,
  icons: {
    type: Object,
    default: () => ({})
  }
});
const Preview = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'Preview',
  inheritAttrs: false,
  props: previewProps,
  emits: ['close', 'afterClose'],
  setup(props, _ref) {
    let {
      emit,
      attrs
    } = _ref;
    const {
      rotateLeft,
      rotateRight,
      zoomIn,
      zoomOut,
      close,
      left,
      right,
      flipX,
      flipY
    } = (0, _vue.reactive)(props.icons);
    const scale = (0, _vue.shallowRef)(1);
    const rotate = (0, _vue.shallowRef)(0);
    const flip = (0, _vue.reactive)({
      x: 1,
      y: 1
    });
    const [position, setPosition] = (0, _useFrameSetState.default)(initialPosition);
    const onClose = () => emit('close');
    const imgRef = (0, _vue.shallowRef)();
    const originPositionRef = (0, _vue.reactive)({
      originX: 0,
      originY: 0,
      deltaX: 0,
      deltaY: 0
    });
    const isMoving = (0, _vue.shallowRef)(false);
    const groupContext = _PreviewGroup.context.inject();
    const {
      previewUrls,
      current,
      isPreviewGroup,
      setCurrent
    } = groupContext;
    const previewGroupCount = (0, _vue.computed)(() => previewUrls.value.size);
    const previewUrlsKeys = (0, _vue.computed)(() => Array.from(previewUrls.value.keys()));
    const currentPreviewIndex = (0, _vue.computed)(() => previewUrlsKeys.value.indexOf(current.value));
    const combinationSrc = (0, _vue.computed)(() => {
      return isPreviewGroup.value ? previewUrls.value.get(current.value) : props.src;
    });
    const showLeftOrRightSwitches = (0, _vue.computed)(() => isPreviewGroup.value && previewGroupCount.value > 1);
    const lastWheelZoomDirection = (0, _vue.shallowRef)({
      wheelDirection: 0
    });
    const onAfterClose = () => {
      scale.value = 1;
      rotate.value = 0;
      flip.x = 1;
      flip.y = 1;
      setPosition(initialPosition);
      emit('afterClose');
    };
    const onZoomIn = isWheel => {
      if (!isWheel) {
        scale.value++;
      } else {
        scale.value += 0.5;
      }
      setPosition(initialPosition);
    };
    const onZoomOut = isWheel => {
      if (scale.value > 1) {
        if (!isWheel) {
          scale.value--;
        } else {
          scale.value -= 0.5;
        }
      }
      setPosition(initialPosition);
    };
    const onRotateRight = () => {
      rotate.value += 90;
    };
    const onRotateLeft = () => {
      rotate.value -= 90;
    };
    const onFlipX = () => {
      flip.x = -flip.x;
    };
    const onFlipY = () => {
      flip.y = -flip.y;
    };
    const onSwitchLeft = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      if (currentPreviewIndex.value > 0) {
        setCurrent(previewUrlsKeys.value[currentPreviewIndex.value - 1]);
      }
    };
    const onSwitchRight = event => {
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      if (currentPreviewIndex.value < previewGroupCount.value - 1) {
        setCurrent(previewUrlsKeys.value[currentPreviewIndex.value + 1]);
      }
    };
    const wrapClassName = (0, _classNames.default)({
      [`${props.prefixCls}-moving`]: isMoving.value
    });
    const toolClassName = `${props.prefixCls}-operations-operation`;
    const iconClassName = `${props.prefixCls}-operations-icon`;
    const tools = [{
      icon: close,
      onClick: onClose,
      type: 'close'
    }, {
      icon: zoomIn,
      onClick: () => onZoomIn(),
      type: 'zoomIn'
    }, {
      icon: zoomOut,
      onClick: () => onZoomOut(),
      type: 'zoomOut',
      disabled: (0, _vue.computed)(() => scale.value === 1)
    }, {
      icon: rotateRight,
      onClick: onRotateRight,
      type: 'rotateRight'
    }, {
      icon: rotateLeft,
      onClick: onRotateLeft,
      type: 'rotateLeft'
    }, {
      icon: flipX,
      onClick: onFlipX,
      type: 'flipX'
    }, {
      icon: flipY,
      onClick: onFlipY,
      type: 'flipY'
    }];
    const onMouseUp = () => {
      if (props.visible && isMoving.value) {
        const width = imgRef.value.offsetWidth * scale.value;
        const height = imgRef.value.offsetHeight * scale.value;
        const {
          left,
          top
        } = (0, _css.getOffset)(imgRef.value);
        const isRotate = rotate.value % 180 !== 0;
        isMoving.value = false;
        const fixState = (0, _getFixScaleEleTransPosition.default)(isRotate ? height : width, isRotate ? width : height, left, top);
        if (fixState) {
          setPosition((0, _extends2.default)({}, fixState));
        }
      }
    };
    const onMouseDown = event => {
      // Only allow main button
      if (event.button !== 0) return;
      event.preventDefault();
      // Without this mask close will abnormal
      event.stopPropagation();
      originPositionRef.deltaX = event.pageX - position.x;
      originPositionRef.deltaY = event.pageY - position.y;
      originPositionRef.originX = position.x;
      originPositionRef.originY = position.y;
      isMoving.value = true;
    };
    const onMouseMove = event => {
      if (props.visible && isMoving.value) {
        setPosition({
          x: event.pageX - originPositionRef.deltaX,
          y: event.pageY - originPositionRef.deltaY
        });
      }
    };
    const onWheelMove = event => {
      if (!props.visible) return;
      event.preventDefault();
      const wheelDirection = event.deltaY;
      lastWheelZoomDirection.value = {
        wheelDirection
      };
    };
    const onKeyDown = event => {
      if (!props.visible || !showLeftOrRightSwitches.value) return;
      event.preventDefault();
      if (event.keyCode === _KeyCode.default.LEFT) {
        if (currentPreviewIndex.value > 0) {
          setCurrent(previewUrlsKeys.value[currentPreviewIndex.value - 1]);
        }
      } else if (event.keyCode === _KeyCode.default.RIGHT) {
        if (currentPreviewIndex.value < previewGroupCount.value - 1) {
          setCurrent(previewUrlsKeys.value[currentPreviewIndex.value + 1]);
        }
      }
    };
    const onDoubleClick = () => {
      if (props.visible) {
        if (scale.value !== 1) {
          scale.value = 1;
        }
        if (position.x !== initialPosition.x || position.y !== initialPosition.y) {
          setPosition(initialPosition);
        }
      }
    };
    let removeListeners = () => {};
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)([() => props.visible, isMoving], () => {
        removeListeners();
        let onTopMouseUpListener;
        let onTopMouseMoveListener;
        const onMouseUpListener = (0, _addEventListener.default)(window, 'mouseup', onMouseUp, false);
        const onMouseMoveListener = (0, _addEventListener.default)(window, 'mousemove', onMouseMove, false);
        const onScrollWheelListener = (0, _addEventListener.default)(window, 'wheel', onWheelMove, {
          passive: false
        });
        const onKeyDownListener = (0, _addEventListener.default)(window, 'keydown', onKeyDown, false);
        try {
          // Resolve if in iframe lost event
          /* istanbul ignore next */
          if (window.top !== window.self) {
            onTopMouseUpListener = (0, _addEventListener.default)(window.top, 'mouseup', onMouseUp, false);
            onTopMouseMoveListener = (0, _addEventListener.default)(window.top, 'mousemove', onMouseMove, false);
          }
        } catch (error) {
          /* istanbul ignore next */
          (0, _warning.warning)(false, `[vc-image] ${error}`);
        }
        removeListeners = () => {
          onMouseUpListener.remove();
          onMouseMoveListener.remove();
          onScrollWheelListener.remove();
          onKeyDownListener.remove();
          /* istanbul ignore next */
          if (onTopMouseUpListener) onTopMouseUpListener.remove();
          /* istanbul ignore next */
          if (onTopMouseMoveListener) onTopMouseMoveListener.remove();
        };
      }, {
        flush: 'post',
        immediate: true
      });
      (0, _vue.watch)([lastWheelZoomDirection], () => {
        const {
          wheelDirection
        } = lastWheelZoomDirection.value;
        if (wheelDirection > 0) {
          onZoomOut(true);
        } else if (wheelDirection < 0) {
          onZoomIn(true);
        }
      });
    });
    (0, _vue.onUnmounted)(() => {
      removeListeners();
    });
    return () => {
      const {
        visible,
        prefixCls,
        rootClassName
      } = props;
      return (0, _vue.createVNode)(_vcDialog.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "transitionName": props.transitionName,
        "maskTransitionName": props.maskTransitionName,
        "closable": false,
        "keyboard": true,
        "prefixCls": prefixCls,
        "onClose": onClose,
        "afterClose": onAfterClose,
        "visible": visible,
        "wrapClassName": wrapClassName,
        "rootClassName": rootClassName,
        "getContainer": props.getContainer
      }), {
        default: () => [(0, _vue.createVNode)("div", {
          "class": [`${props.prefixCls}-operations-wrapper`, rootClassName]
        }, [(0, _vue.createVNode)("ul", {
          "class": `${props.prefixCls}-operations`
        }, [tools.map(_ref2 => {
          let {
            icon: IconType,
            onClick,
            type,
            disabled
          } = _ref2;
          return (0, _vue.createVNode)("li", {
            "class": (0, _classNames.default)(toolClassName, {
              [`${props.prefixCls}-operations-operation-disabled`]: disabled && (disabled === null || disabled === void 0 ? void 0 : disabled.value)
            }),
            "onClick": onClick,
            "key": type
          }, [(0, _vue.cloneVNode)(IconType, {
            class: iconClassName
          })]);
        })])]), (0, _vue.createVNode)("div", {
          "class": `${props.prefixCls}-img-wrapper`,
          "style": {
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`
          }
        }, [(0, _vue.createVNode)("img", {
          "onMousedown": onMouseDown,
          "onDblclick": onDoubleClick,
          "ref": imgRef,
          "class": `${props.prefixCls}-img`,
          "src": combinationSrc.value,
          "alt": props.alt,
          "style": {
            transform: `scale3d(${flip.x * scale.value}, ${flip.y * scale.value}, 1) rotate(${rotate.value}deg)`
          }
        }, null)]), showLeftOrRightSwitches.value && (0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${props.prefixCls}-switch-left`, {
            [`${props.prefixCls}-switch-left-disabled`]: currentPreviewIndex.value <= 0
          }),
          "onClick": onSwitchLeft
        }, [left]), showLeftOrRightSwitches.value && (0, _vue.createVNode)("div", {
          "class": (0, _classNames.default)(`${props.prefixCls}-switch-right`, {
            [`${props.prefixCls}-switch-right-disabled`]: currentPreviewIndex.value >= previewGroupCount.value - 1
          }),
          "onClick": onSwitchRight
        }, [right])]
      });
    };
  }
});
var _default = exports.default = Preview;