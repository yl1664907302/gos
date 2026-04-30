import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, Fragment as _Fragment } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { ref, watch, defineComponent, computed, onMounted, onUnmounted } from 'vue';
import isNumber from 'lodash-es/isNumber';
import cn from '../../_util/classNames';
import PropTypes from '../../_util/vue-types';
import { getOffset } from '../../vc-util/Dom/css';
import useMergedState from '../../_util/hooks/useMergedState';
import Preview from './Preview';
import PreviewGroup, { context } from './PreviewGroup';
export const imageProps = () => ({
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
  placeholder: PropTypes.any,
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
export const mergeDefaultValue = (obj, defaultValues) => {
  const res = _extends({}, obj);
  Object.keys(defaultValues).forEach(key => {
    if (obj[key] === undefined) {
      res[key] = defaultValues[key];
    }
  });
  return res;
};
let uuid = 0;
const ImageInternal = defineComponent({
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
    const prefixCls = computed(() => props.prefixCls);
    const previewPrefixCls = computed(() => `${prefixCls.value}-preview`);
    const preview = computed(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined
      };
      return typeof props.preview === 'object' ? mergeDefaultValue(props.preview, defaultValues) : defaultValues;
    });
    const src = computed(() => {
      var _a;
      return (_a = preview.value.src) !== null && _a !== void 0 ? _a : props.src;
    });
    const isCustomPlaceholder = computed(() => props.placeholder && props.placeholder !== true || slots.placeholder);
    const previewVisible = computed(() => preview.value.visible);
    const getPreviewContainer = computed(() => preview.value.getContainer);
    const isControlled = computed(() => previewVisible.value !== undefined);
    const onPreviewVisibleChange = (val, preval) => {
      var _a, _b;
      (_b = (_a = preview.value).onVisibleChange) === null || _b === void 0 ? void 0 : _b.call(_a, val, preval);
    };
    const [isShowPreview, setShowPreview] = useMergedState(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange
    });
    const status = ref(isCustomPlaceholder.value ? 'loading' : 'normal');
    watch(() => props.src, () => {
      status.value = isCustomPlaceholder.value ? 'loading' : 'normal';
    });
    const mousePosition = ref(null);
    const isError = computed(() => status.value === 'error');
    const groupContext = context.inject();
    const {
      isPreviewGroup,
      setCurrent,
      setShowPreview: setGroupShowPreview,
      setMousePosition: setGroupMousePosition,
      registerImage
    } = groupContext;
    const currentId = ref(uuid++);
    const canPreview = computed(() => props.preview && !isError.value);
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
        } = getOffset(e.target);
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
    const img = ref(null);
    watch(() => img, () => {
      if (status.value !== 'loading') return;
      if (img.value.complete && (img.value.naturalWidth || img.value.naturalHeight)) {
        onLoad();
      }
    });
    let unRegister = () => {};
    onMounted(() => {
      watch([src, canPreview], () => {
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
    onUnmounted(() => {
      unRegister();
    });
    const toSizePx = l => {
      if (isNumber(l)) return l + 'px';
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
      } = _extends(_extends({}, props), attrs);
      const _a = preview.value,
        {
          icons,
          maskClassName
        } = _a,
        dialogProps = __rest(_a, ["icons", "maskClassName"]);
      const wrappperClass = cn(prefixCls, wrapperClassName, rootClassName, {
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
        class: cn(`${prefixCls}-img`, {
          [`${prefixCls}-img-placeholder`]: placeholder === true
        }, cls),
        style: _extends({
          height: toSizePx(height)
        }, style)
      };
      return _createVNode(_Fragment, null, [_createVNode("div", {
        "class": wrappperClass,
        "onClick": canPreview.value ? onPreview : e => {
          emit('click', e);
        },
        "style": _extends({
          width: toSizePx(width),
          height: toSizePx(height)
        }, wrapperStyle)
      }, [_createVNode("img", _objectSpread(_objectSpread(_objectSpread({}, imgCommonProps), isError.value && fallback ? {
        src: fallback
      } : {
        onLoad,
        onError,
        src: imgSrc
      }), {}, {
        "ref": img
      }), null), status.value === 'loading' && _createVNode("div", {
        "aria-hidden": "true",
        "class": `${prefixCls}-placeholder`
      }, [placeholder || slots.placeholder && slots.placeholder()]), slots.previewMask && canPreview.value && _createVNode("div", {
        "class": [`${prefixCls}-mask`, maskClassName]
      }, [slots.previewMask()])]), !isPreviewGroup.value && canPreview.value && _createVNode(Preview, _objectSpread(_objectSpread({}, dialogProps), {}, {
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
ImageInternal.PreviewGroup = PreviewGroup;
export default ImageInternal;