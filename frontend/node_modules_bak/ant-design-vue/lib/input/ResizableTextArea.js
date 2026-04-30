"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vcResizeObserver = _interopRequireDefault(require("../vc-resize-observer"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _raf = _interopRequireDefault(require("../_util/raf"));
var _warning = _interopRequireDefault(require("../_util/warning"));
var _omit = _interopRequireDefault(require("../_util/omit"));
var _inputProps = require("./inputProps");
var _calculateNodeHeight = _interopRequireDefault(require("./calculateNodeHeight"));
var _BaseInput = _interopRequireDefault(require("../_util/BaseInput"));
const RESIZE_START = 0;
const RESIZE_MEASURING = 1;
const RESIZE_STABLE = 2;
const ResizableTextArea = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ResizableTextArea',
  inheritAttrs: false,
  props: (0, _inputProps.textAreaProps)(),
  setup(props, _ref) {
    let {
      attrs,
      emit,
      expose
    } = _ref;
    let nextFrameActionId;
    let resizeFrameId;
    const textAreaRef = (0, _vue.ref)();
    const textareaStyles = (0, _vue.ref)({});
    const resizeStatus = (0, _vue.ref)(RESIZE_STABLE);
    (0, _vue.onBeforeUnmount)(() => {
      _raf.default.cancel(nextFrameActionId);
      _raf.default.cancel(resizeFrameId);
    });
    // https://github.com/ant-design/ant-design/issues/21870
    const fixFirefoxAutoScroll = () => {
      try {
        if (textAreaRef.value && document.activeElement === textAreaRef.value.input) {
          const currentStart = textAreaRef.value.getSelectionStart();
          const currentEnd = textAreaRef.value.getSelectionEnd();
          const scrollTop = textAreaRef.value.getScrollTop();
          textAreaRef.value.setSelectionRange(currentStart, currentEnd);
          textAreaRef.value.setScrollTop(scrollTop);
        }
      } catch (e) {
        // Fix error in Chrome:
        // Failed to read the 'selectionStart' property from 'HTMLInputElement'
        // http://stackoverflow.com/q/21177489/3040605
      }
    };
    const minRows = (0, _vue.ref)();
    const maxRows = (0, _vue.ref)();
    (0, _vue.watchEffect)(() => {
      const autoSize = props.autoSize || props.autosize;
      if (autoSize) {
        minRows.value = autoSize.minRows;
        maxRows.value = autoSize.maxRows;
      } else {
        minRows.value = undefined;
        maxRows.value = undefined;
      }
    });
    const needAutoSize = (0, _vue.computed)(() => !!(props.autoSize || props.autosize));
    const startResize = () => {
      resizeStatus.value = RESIZE_START;
    };
    (0, _vue.watch)([() => props.value, minRows, maxRows, needAutoSize], () => {
      if (needAutoSize.value) {
        startResize();
      }
    }, {
      immediate: true
    });
    const autoSizeStyle = (0, _vue.ref)();
    (0, _vue.watch)([resizeStatus, textAreaRef], () => {
      if (!textAreaRef.value) return;
      if (resizeStatus.value === RESIZE_START) {
        resizeStatus.value = RESIZE_MEASURING;
      } else if (resizeStatus.value === RESIZE_MEASURING) {
        const textareaStyles = (0, _calculateNodeHeight.default)(textAreaRef.value.input, false, minRows.value, maxRows.value);
        resizeStatus.value = RESIZE_STABLE;
        autoSizeStyle.value = textareaStyles;
      } else {
        fixFirefoxAutoScroll();
      }
    }, {
      immediate: true,
      flush: 'post'
    });
    const instance = (0, _vue.getCurrentInstance)();
    const resizeRafRef = (0, _vue.ref)();
    const cleanRaf = () => {
      _raf.default.cancel(resizeRafRef.value);
    };
    const onInternalResize = size => {
      if (resizeStatus.value === RESIZE_STABLE) {
        emit('resize', size);
        if (needAutoSize.value) {
          cleanRaf();
          resizeRafRef.value = (0, _raf.default)(() => {
            startResize();
          });
        }
      }
    };
    (0, _vue.onBeforeUnmount)(() => {
      cleanRaf();
    });
    const resizeTextarea = () => {
      startResize();
    };
    expose({
      resizeTextarea,
      textArea: (0, _vue.computed)(() => {
        var _a;
        return (_a = textAreaRef.value) === null || _a === void 0 ? void 0 : _a.input;
      }),
      instance
    });
    (0, _warning.default)(props.autosize === undefined, 'Input.TextArea', 'autosize is deprecated, please use autoSize instead.');
    const renderTextArea = () => {
      const {
        prefixCls,
        disabled
      } = props;
      const otherProps = (0, _omit.default)(props, ['prefixCls', 'onPressEnter', 'autoSize', 'autosize', 'defaultValue', 'allowClear', 'type', 'maxlength', 'valueModifiers']);
      const cls = (0, _classNames.default)(prefixCls, attrs.class, {
        [`${prefixCls}-disabled`]: disabled
      });
      const mergedAutoSizeStyle = needAutoSize.value ? autoSizeStyle.value : null;
      const style = [attrs.style, textareaStyles.value, mergedAutoSizeStyle];
      const textareaProps = (0, _extends2.default)((0, _extends2.default)((0, _extends2.default)({}, otherProps), attrs), {
        style,
        class: cls
      });
      if (resizeStatus.value === RESIZE_START || resizeStatus.value === RESIZE_MEASURING) {
        style.push({
          overflowX: 'hidden',
          overflowY: 'hidden'
        });
      }
      if (!textareaProps.autofocus) {
        delete textareaProps.autofocus;
      }
      if (textareaProps.rows === 0) {
        delete textareaProps.rows;
      }
      return (0, _vue.createVNode)(_vcResizeObserver.default, {
        "onResize": onInternalResize,
        "disabled": !needAutoSize.value
      }, {
        default: () => [(0, _vue.createVNode)(_BaseInput.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, textareaProps), {}, {
          "ref": textAreaRef,
          "tag": "textarea"
        }), null)]
      });
    };
    return () => {
      return renderTextArea();
    };
  }
});
var _default = exports.default = ResizableTextArea;