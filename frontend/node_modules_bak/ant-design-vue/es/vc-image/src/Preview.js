import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent, onMounted, onUnmounted, reactive, shallowRef, watch, cloneVNode } from 'vue';
import classnames from '../../_util/classNames';
import Dialog from '../../vc-dialog';
import { dialogPropTypes } from '../../vc-dialog/IDialogPropTypes';
import { getOffset } from '../../vc-util/Dom/css';
import addEventListener from '../../vc-util/Dom/addEventListener';
import KeyCode from '../../_util/KeyCode';
import { warning } from '../../vc-util/warning';
import useFrameSetState from './hooks/useFrameSetState';
import getFixScaleEleTransPosition from './getFixScaleEleTransPosition';
import { context } from './PreviewGroup';
const initialPosition = {
  x: 0,
  y: 0
};
export const previewProps = _extends(_extends({}, dialogPropTypes()), {
  src: String,
  alt: String,
  rootClassName: String,
  icons: {
    type: Object,
    default: () => ({})
  }
});
const Preview = defineComponent({
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
    } = reactive(props.icons);
    const scale = shallowRef(1);
    const rotate = shallowRef(0);
    const flip = reactive({
      x: 1,
      y: 1
    });
    const [position, setPosition] = useFrameSetState(initialPosition);
    const onClose = () => emit('close');
    const imgRef = shallowRef();
    const originPositionRef = reactive({
      originX: 0,
      originY: 0,
      deltaX: 0,
      deltaY: 0
    });
    const isMoving = shallowRef(false);
    const groupContext = context.inject();
    const {
      previewUrls,
      current,
      isPreviewGroup,
      setCurrent
    } = groupContext;
    const previewGroupCount = computed(() => previewUrls.value.size);
    const previewUrlsKeys = computed(() => Array.from(previewUrls.value.keys()));
    const currentPreviewIndex = computed(() => previewUrlsKeys.value.indexOf(current.value));
    const combinationSrc = computed(() => {
      return isPreviewGroup.value ? previewUrls.value.get(current.value) : props.src;
    });
    const showLeftOrRightSwitches = computed(() => isPreviewGroup.value && previewGroupCount.value > 1);
    const lastWheelZoomDirection = shallowRef({
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
    const wrapClassName = classnames({
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
      disabled: computed(() => scale.value === 1)
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
        } = getOffset(imgRef.value);
        const isRotate = rotate.value % 180 !== 0;
        isMoving.value = false;
        const fixState = getFixScaleEleTransPosition(isRotate ? height : width, isRotate ? width : height, left, top);
        if (fixState) {
          setPosition(_extends({}, fixState));
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
      if (event.keyCode === KeyCode.LEFT) {
        if (currentPreviewIndex.value > 0) {
          setCurrent(previewUrlsKeys.value[currentPreviewIndex.value - 1]);
        }
      } else if (event.keyCode === KeyCode.RIGHT) {
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
    onMounted(() => {
      watch([() => props.visible, isMoving], () => {
        removeListeners();
        let onTopMouseUpListener;
        let onTopMouseMoveListener;
        const onMouseUpListener = addEventListener(window, 'mouseup', onMouseUp, false);
        const onMouseMoveListener = addEventListener(window, 'mousemove', onMouseMove, false);
        const onScrollWheelListener = addEventListener(window, 'wheel', onWheelMove, {
          passive: false
        });
        const onKeyDownListener = addEventListener(window, 'keydown', onKeyDown, false);
        try {
          // Resolve if in iframe lost event
          /* istanbul ignore next */
          if (window.top !== window.self) {
            onTopMouseUpListener = addEventListener(window.top, 'mouseup', onMouseUp, false);
            onTopMouseMoveListener = addEventListener(window.top, 'mousemove', onMouseMove, false);
          }
        } catch (error) {
          /* istanbul ignore next */
          warning(false, `[vc-image] ${error}`);
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
      watch([lastWheelZoomDirection], () => {
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
    onUnmounted(() => {
      removeListeners();
    });
    return () => {
      const {
        visible,
        prefixCls,
        rootClassName
      } = props;
      return _createVNode(Dialog, _objectSpread(_objectSpread({}, attrs), {}, {
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
        default: () => [_createVNode("div", {
          "class": [`${props.prefixCls}-operations-wrapper`, rootClassName]
        }, [_createVNode("ul", {
          "class": `${props.prefixCls}-operations`
        }, [tools.map(_ref2 => {
          let {
            icon: IconType,
            onClick,
            type,
            disabled
          } = _ref2;
          return _createVNode("li", {
            "class": classnames(toolClassName, {
              [`${props.prefixCls}-operations-operation-disabled`]: disabled && (disabled === null || disabled === void 0 ? void 0 : disabled.value)
            }),
            "onClick": onClick,
            "key": type
          }, [cloneVNode(IconType, {
            class: iconClassName
          })]);
        })])]), _createVNode("div", {
          "class": `${props.prefixCls}-img-wrapper`,
          "style": {
            transform: `translate3d(${position.x}px, ${position.y}px, 0)`
          }
        }, [_createVNode("img", {
          "onMousedown": onMouseDown,
          "onDblclick": onDoubleClick,
          "ref": imgRef,
          "class": `${props.prefixCls}-img`,
          "src": combinationSrc.value,
          "alt": props.alt,
          "style": {
            transform: `scale3d(${flip.x * scale.value}, ${flip.y * scale.value}, 1) rotate(${rotate.value}deg)`
          }
        }, null)]), showLeftOrRightSwitches.value && _createVNode("div", {
          "class": classnames(`${props.prefixCls}-switch-left`, {
            [`${props.prefixCls}-switch-left-disabled`]: currentPreviewIndex.value <= 0
          }),
          "onClick": onSwitchLeft
        }, [left]), showLeftOrRightSwitches.value && _createVNode("div", {
          "class": classnames(`${props.prefixCls}-switch-right`, {
            [`${props.prefixCls}-switch-right-disabled`]: currentPreviewIndex.value >= previewGroupCount.value - 1
          }),
          "onClick": onSwitchRight
        }, [right])]
      });
    };
  }
});
export default Preview;