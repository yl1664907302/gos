import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { resolveDirective as _resolveDirective, Fragment as _Fragment, createVNode as _createVNode } from "vue";
import { defineComponent, computed, ref } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useStyle from './style';
import { useLocaleReceiver } from '../locale/LocaleReceiver';
import { withInstall } from '../_util/type';
import Spin from '../spin';
import Button from '../button';
import { ReloadOutlined } from '@ant-design/icons-vue';
import { useToken } from '../theme/internal';
import { QRCodeCanvas, QRCodeSVG } from './QRCode';
import warning from '../_util/warning';
import { qrcodeProps } from './interface';
const QRCode = defineComponent({
  name: 'AQrcode',
  inheritAttrs: false,
  props: qrcodeProps(),
  emits: ['refresh'],
  setup(props, _ref) {
    let {
      emit,
      attrs,
      expose
    } = _ref;
    if (process.env.NODE_ENV !== 'production') {
      warning(!(props.icon && props.errorLevel === 'L'), 'QRCode', 'ErrorLevel `L` is not recommended to be used with `icon`, for scanning result would be affected by low level.');
    }
    const [locale] = useLocaleReceiver('QRCode');
    const {
      prefixCls
    } = useConfigInject('qrcode', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const [, token] = useToken();
    const qrCodeCanvas = ref();
    expose({
      toDataURL: (type, quality) => {
        var _a;
        return (_a = qrCodeCanvas.value) === null || _a === void 0 ? void 0 : _a.toDataURL(type, quality);
      }
    });
    const qrCodeProps = computed(() => {
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
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "style": [attrs.style, {
          width: `${props.size}px`,
          height: `${props.size}px`,
          backgroundColor: qrCodeProps.value.bgColor
        }],
        "class": [hashId.value, pre, {
          [`${pre}-borderless`]: !props.bordered
        }]
      }), [props.status !== 'active' && _createVNode("div", {
        "class": `${pre}-mask`
      }, [props.status === 'loading' && _createVNode(Spin, null, null), props.status === 'expired' && _createVNode(_Fragment, null, [_createVNode("p", {
        "class": `${pre}-expired`
      }, [locale.value.expired]), _createVNode(Button, {
        "type": "link",
        "onClick": e => emit('refresh', e)
      }, {
        default: () => [locale.value.refresh],
        icon: () => _createVNode(ReloadOutlined, null, null)
      })]), props.status === 'scanned' && _createVNode("p", {
        "class": `${pre}-scanned`
      }, [locale.value.scanned])]), props.type === 'canvas' ? _createVNode(QRCodeCanvas, _objectSpread({
        "ref": qrCodeCanvas
      }, qrCodeProps.value), null) : _createVNode(QRCodeSVG, qrCodeProps.value, null)]));
    };
  }
});
export default withInstall(QRCode);