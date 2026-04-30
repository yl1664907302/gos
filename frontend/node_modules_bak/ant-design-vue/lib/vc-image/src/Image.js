"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeDefaultValue = exports.imageProps = exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _isNumber = _interopRequireDefault(require("lodash/isNumber"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _vueTypes = _interopRequireDefault(require("../../_util/vue-types"));
var _css = require("../../vc-util/Dom/css");
var _useMergedState = _interopRequireDefault(require("../../_util/hooks/useMergedState"));
var _Preview = _interopRequireDefault(require("./Preview"));
var _PreviewGroup = _interopRequireWildcard(require("./PreviewGroup"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const imageProps = () => ({
  src: String,
  wrapperClassName: String,
  wrapperStyle: {
    type: Object,
    default: undefined
  },
  rootClassName: String,
  prefixCls: String,
  previewPrefixCls: String,
  width: [Number, String],
  height: [Number, String],
  previewMask: {
    type: [Boolean, Function],
    default: undefined
  },
  placeholder: _vueTypes.default.any,
  fallback: String,
  preview: {
    type: [Boolean, Object],
    default: true
  },
  onClick: {
    type: Function
  },
  onError: {
    type: Function
  }
});
exports.imageProps = imageProps;
const mergeDefaultValue = (obj, defaultValues) => {
  const res = (0, _extends2.default)({}, obj);
  Object.keys(defaultValues).forEach(key => {
    if (obj[key] === undefined) {
      res[key] = defaultValues[key];
    }
  });
  return res;
};
exports.mergeDefaultValue = mergeDefaultValue;
let uuid = 0;
const ImageInternal = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'VcImage',
  inheritAttrs: false,
  props: imageProps(),
  emits: ['click', 'error'],
  setup(props, _ref) {
    let {
      attrs,
      slots,
      emit
    } = _ref;
    const prefixCls = (0, _vue.computed)(() => props.prefixCls);
    const previewPrefixCls = (0, _vue.computed)(() => `${prefixCls.value}-preview`);
    const preview = (0, _vue.computed)(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined
      };
      return typeof props.preview === 'object' ? mergeDefaultValue(props.preview, defaultValues) : defaultValues;
    });
    const src = (0, _vue.computed)(() => {
      var _a;
      return (_a = preview.value.src) !== null && _a !== void 0 ? _a : props.src;
    });
    const isCustomPlaceholder = (0, _vue.computed)(() => props.placeholder && props.placeholder !== true || slots.placeholder);
    const previewVisible = (0, _vue.computed)(() => preview.value.visible);
    const getPreviewContainer = (0, _vue.computed)(() => preview.value.getContainer);
    const isControlled = (0, _vue.computed)(() => previewVisible.value !== undefined);
    const onPreviewVisibleChange = (val, preval) => {
      var _a, _b;
      (_b = (_a = preview.value).onVisibleChange) === null || _b === void 0 ? void 0 : _b.call(_a, val, preval);
    };
    const [isShowPreview, setShowPreview] = (0, _useMergedState.default)(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange
    });
    const status = (0, _vue.ref)(isCustomPlaceholder.value ? 'loading' : 'normal');
    (0, _vue.watch)(() => props.src, () => {
      status.value = isCustomPlaceholder.value ? 'loading' : 'normal';
    });
    const mousePosition = (0, _vue.ref)(null);
    const isError = (0, _vue.computed)(() => status.value === 'error');
    const groupContext = _PreviewGroup.context.inject();
    const {
      isPreviewGroup,
      setCurrent,
      setShowPreview: setGroupShowPreview,
      setMousePosition: setGroupMousePosition,
      registerImage
    } = groupContext;
    const currentId = (0, _vue.ref)(uuid++);
    const canPreview = (0, _vue.computed)(() => props.preview && !isError.value);
    const onLoad = () => {
      status.value = 'normal';
    };
    const onError = e => {
      status.value = 'error';
      emit('error', e);
    };
    const onPreview = e => {
      if (!isControlled.value) {
        const {
          left,
          top
        } = (0, _css.getOffset)(e.target);
        if (isPreviewGroup.value) {
          setCurrent(currentId.value);
          setGroupMousePosition({
            x: left,
            y: top
          });
        } else {
          mousePosition.value = {
            x: left,
            y: top
          };
        }
      }
      if (isPreviewGroup.value) {
        setGroupShowPreview(true);
      } else {
        setShowPreview(true);
      }
      emit('click', e);
    };
    const onPreviewClose = () => {
      setShowPreview(false);
      if (!isControlled.value) {
        mousePosition.value = null;
      }
    };
    const img = (0, _vue.ref)(null);
    (0, _vue.watch)(() => img, () => {
      if (status.value !== 'loading') return;
      if (img.value.complete && (img.value.naturalWidth || img.value.naturalHeight)) {
        onLoad();
      }
    });
    let unRegister = () => {};
    (0, _vue.onMounted)(() => {
      (0, _vue.watch)([src, canPreview], () => {
        unRegister();
        if (!isPreviewGroup.value) {
          return () => {};
        }
        unRegister = registerImage(currentId.value, src.value, canPreview.value);
        if (!canPreview.value) {
          unRegister();
        }
      }, {
        flush: 'post',
        immediate: true
      });
    });
    (0, _vue.onUnmounted)(() => {
      unRegister();
    });
    const toSizePx = l => {
      if ((0, _isNumber.default)(l)) return l + 'px';
      return l;
    };
    return () => {
      const {
        prefixCls,
        wrapperClassName,
        fallback,
        src: imgSrc,
        placeholder,
        wrapperStyle,
        rootClassName,
        width,
        height,
        crossorigin,
        decoding,
        alt,
        sizes,
        srcset,
        usemap,
        class: cls,
        style
      } = (0, _extends2.default)((0, _extends2.default)({}, props), attrs);
      const _a = preview.value,
        {
          icons,
          maskClassName
        } = _a,
        dialogProps = __rest(_a, ["icons", "maskClassName"]);
      const wrappperClass = (0, _classNames.default)(prefixCls, wrapperClassName, rootClassName, {
        [`${prefixCls}-error`]: isError.value
      });
      const mergedSrc = isError.value && fallback ? fallback : src.value;
      const imgCommonProps = {
        crossorigin,
        decoding,
        alt,
        sizes,
        srcset,
        usemap,
        width,
        height,
        class: (0, _classNames.default)(`${prefixCls}-img`, {
          [`${prefixCls}-img-placeholder`]: placeholder === true
        }, cls),
        style: (0, _extends2.default)({
          height: toSizePx(height)
        }, style)
      };
      return (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("div", {
        "class": wrappperClass,
        "onClick": canPreview.value ? onPreview : e => {
          emit('click', e);
        },
        "style": (0, _extends2.default)({
          width: toSizePx(width),
          height: toSizePx(height)
        }, wrapperStyle)
      }, [(0, _vue.createVNode)("img", (0, _objectSpread2.default)((0, _objectSpread2.default)((0, _objectSpread2.default)({}, imgCommonProps), isError.value && fallback ? {
        src: fallback
      } : {
        onLoad,
        onError,
        src: imgSrc
      }), {}, {
        "ref": img
      }), null), status.value === 'loading' && (0, _vue.createVNode)("div", {
        "aria-hidden": "true",
        "class": `${prefixCls}-placeholder`
      }, [placeholder || slots.placeholder && slots.placeholder()]), slots.previewMask && canPreview.value && (0, _vue.createVNode)("div", {
        "class": [`${prefixCls}-mask`, maskClassName]
      }, [slots.previewMask()])]), !isPreviewGroup.value && canPreview.value && (0, _vue.createVNode)(_Preview.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, dialogProps), {}, {
        "aria-hidden": !isShowPreview.value,
        "visible": isShowPreview.value,
        "prefixCls": previewPrefixCls.value,
        "onClose": onPreviewClose,
        "mousePosition": mousePosition.value,
        "src": mergedSrc,
        "alt": alt,
        "getContainer": getPreviewContainer.value,
        "icons": icons,
        "rootClassName": rootClassName
      }), null)]);
    };
  }
});
ImageInternal.PreviewGroup = _PreviewGroup.default;
var _default = exports.default = ImageInternal;