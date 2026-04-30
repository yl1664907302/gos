"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
var _LocaleReceiver = require("../locale/LocaleReceiver");
var _type = require("../_util/type");
var _spin = _interopRequireDefault(require("../spin"));
var _button = _interopRequireDefault(require("../button"));
var _iconsVue = require("@ant-design/icons-vue/lib/icons");
var _internal = require("../theme/internal");
var _QRCode = require("./QRCode");
var _warning = _interopRequireDefault(require("../_util/warning"));
var _interface = require("./interface");
const QRCode = (0, _vue.defineComponent)({
  name: 'AQrcode',
  inheritAttrs: false,
  props: (0, _interface.qrcodeProps)(),
  emits: ['refresh'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      expose
    } = _ref;
    if (process.env.NODE_ENV !== 'production') {
      (0, _warning.default)(!(props.icon && props.errorLevel === 'L'), 'QRCode', 'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.');
    }
    const [locale] = (0, _LocaleReceiver.useLocaleReceiver)('QRCode');
    const {
      prefixCls
    } = (0, _useConfigInject.default)('qrcode', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const [, token] = (0, _internal.useToken)();
    const qrCodeCanvas = (0, _vue.ref)();
    expose({
      toDataURL: (type, quality) => {
        var _a;
        return (_a = qrCodeCanvas.value) === null || _a === void 0 ? void 0 : _a.toDataURL(type, quality);
      }
    });
    const qrCodeProps = (0, _vue.computed)(() => {
      const {
        value,
        icon = '',
        size = 160,
        iconSize = 40,
        color = token.value.colorText,
        bgColor = 'transparent',
        errorLevel = 'M'
      } = props;
      const imageSettings = {
        src: icon,
        x: undefined,
        y: undefined,
        height: iconSize,
        width: iconSize,
        excavate: true
      };
      return {
        value,
        size: size - (token.value.paddingSM + token.value.lineWidth) * 2,
        level: errorLevel,
        bgColor,
        fgColor: color,
        imageSettings: icon ? imageSettings : undefined
      };
    });
    return () => {
      const pre = prefixCls.value;
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "style": [attrs.style, {
          width: `${props.size}px`,
          height: `${props.size}px`,
          backgroundColor: qrCodeProps.value.bgColor
        }],
        "class": [hashId.value, pre, {
          [`${pre}-borderless`]: !props.bordered
        }]
      }), [props.status !== 'active' && (0, _vue.createVNode)("div", {
        "class": `${pre}-mask`
      }, [props.status === 'loading' && (0, _vue.createVNode)(_spin.default, null, null), props.status === 'expired' && (0, _vue.createVNode)(_vue.Fragment, null, [(0, _vue.createVNode)("p", {
        "class": `${pre}-expired`
      }, [locale.value.expired]), (0, _vue.createVNode)(_button.default, {
        "type": "link",
        "onClick": e => emit('refresh', e)
      }, {
        default: () => [locale.value.refresh],
        icon: () => (0, _vue.createVNode)(_iconsVue.ReloadOutlined, null, null)
      })]), props.status === 'scanned' && (0, _vue.createVNode)("p", {
        "class": `${pre}-scanned`
      }, [locale.value.scanned])]), props.type === 'canvas' ? (0, _vue.createVNode)(_QRCode.QRCodeCanvas, (0, _objectSpread2.default)({
        "ref": qrCodeCanvas
      }, qrCodeProps.value), null) : (0, _vue.createVNode)(_QRCode.QRCodeSVG, qrCodeProps.value, null)]));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(QRCode);