"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.imageGroupProps = exports.default = exports.context = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _Image = require("./Image");
var _Preview = _interopRequireDefault(require("./Preview"));
var _useMergedState = _interopRequireDefault(require("../../_util/hooks/useMergedState"));
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const previewGroupContext = Symbol('previewGroupContext');
const context = exports.context = {
  provide: val => {
    (0, _vue.provide)(previewGroupContext, val);
  },
  inject: () => {
    return (0, _vue.inject)(previewGroupContext, {
      isPreviewGroup: (0, _vue.shallowRef)(false),
      previewUrls: (0, _vue.computed)(() => new Map()),
      setPreviewUrls: () => {},
      current: (0, _vue.ref)(null),
      setCurrent: () => {},
      setShowPreview: () => {},
      setMousePosition: () => {},
      registerImage: null,
      rootClassName: ''
    });
  }
};
const imageGroupProps = () => ({
  previewPrefixCls: String,
  preview: {
    type: [Boolean, Object],
    default: true
  },
  icons: {
    type: Object,
    default: () => ({})
  }
});
exports.imageGroupProps = imageGroupProps;
const Group = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'PreviewGroup',
  inheritAttrs: false,
  props: imageGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const preview = (0, _vue.computed)(() => {
      const defaultValues = {
        visible: undefined,
        onVisibleChange: () => {},
        getContainer: undefined,
        current: 0
      };
      return typeof props.preview === 'object' ? (0, _Image.mergeDefaultValue)(props.preview, defaultValues) : defaultValues;
    });
    const previewUrls = (0, _vue.reactive)(new Map());
    const current = (0, _vue.ref)();
    const previewVisible = (0, _vue.computed)(() => preview.value.visible);
    const getPreviewContainer = (0, _vue.computed)(() => preview.value.getContainer);
    const onPreviewVisibleChange = (val, preval) => {
      var _a, _b;
      (_b = (_a = preview.value).onVisibleChange) === null || _b === void 0 ? void 0 : _b.call(_a, val, preval);
    };
    const [isShowPreview, setShowPreview] = (0, _useMergedState.default)(!!previewVisible.value, {
      value: previewVisible,
      onChange: onPreviewVisibleChange
    });
    const mousePosition = (0, _vue.ref)(null);
    const isControlled = (0, _vue.computed)(() => previewVisible.value !== undefined);
    const previewUrlsKeys = (0, _vue.computed)(() => Array.from(previewUrls.keys()));
    const currentControlledKey = (0, _vue.computed)(() => previewUrlsKeys.value[preview.value.current]);
    const canPreviewUrls = (0, _vue.computed)(() => new Map(Array.from(previewUrls).filter(_ref2 => {
      let [, {
        canPreview
      }] = _ref2;
      return !!canPreview;
    }).map(_ref3 => {
      let [id, {
        url
      }] = _ref3;
      return [id, url];
    })));
    const setPreviewUrls = function (id, url) {
      let canPreview = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      previewUrls.set(id, {
        url,
        canPreview
      });
    };
    const setCurrent = val => {
      current.value = val;
    };
    const setMousePosition = val => {
      mousePosition.value = val;
    };
    const registerImage = function (id, url) {
      let canPreview = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      const unRegister = () => {
        previewUrls.delete(id);
      };
      previewUrls.set(id, {
        url,
        canPreview
      });
      return unRegister;
    };
    const onPreviewClose = e => {
      e === null || e === void 0 ? void 0 : e.stopPropagation();
      setShowPreview(false);
      setMousePosition(null);
    };
    (0, _vue.watch)(currentControlledKey, val => {
      setCurrent(val);
    }, {
      immediate: true,
      flush: 'post'
    });
    (0, _vue.watchEffect)(() => {
      if (isShowPreview.value && isControlled.value) {
        setCurrent(currentControlledKey.value);
      }
    }, {
      flush: 'post'
    });
    context.provide({
      isPreviewGroup: (0, _vue.shallowRef)(true),
      previewUrls: canPreviewUrls,
      setPreviewUrls,
      current,
      setCurrent,
      setShowPreview,
      setMousePosition,
      registerImage
    });
    return () => {
      const dialogProps = __rest(preview.value, []);
      return (0, _vue.createVNode)(_vue.Fragment, null, [slots.default && slots.default(), (0, _vue.createVNode)(_Preview.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, dialogProps), {}, {
        "ria-hidden": !isShowPreview.value,
        "visible": isShowPreview.value,
        "prefixCls": props.previewPrefixCls,
        "onClose": onPreviewClose,
        "mousePosition": mousePosition.value,
        "src": canPreviewUrls.value.get(current.value),
        "icons": props.icons,
        "getContainer": getPreviewContainer.value
      }), null)]);
    };
  }
});
var _default = exports.default = Group;