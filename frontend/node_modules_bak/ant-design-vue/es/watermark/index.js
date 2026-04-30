import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { computed, defineComponent, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import { getStyleStr, getPixelRatio, rotateWatermark, reRendering } from './utils';
import { arrayType, objectType, someType, withInstall } from '../_util/type';
import { useMutationObserver } from '../_util/hooks/_vueuse/useMutationObserver';
import { initDefaultProps } from '../_util/props-util';
import { useToken } from '../theme/internal';
/**
 * Base size of the canvas, 1 for parallel layout and 2 for alternate layout
 * Only alternate layout is currently supported
 */
const BaseSize = 2;
const FontGap = 3;
export const watermarkProps = () => ({
  zIndex: Number,
  rotate: Number,
  width: Number,
  height: Number,
  image: String,
  content: someType([String, Array]),
  font: objectType(),
  rootClassName: String,
  gap: arrayType(),
  offset: arrayType()
});
const Watermark = defineComponent({
  name: 'AWatermark',
  inheritAttrs: false,
  props: initDefaultProps(watermarkProps(), {
    zIndex: 9,
    rotate: -22,
    font: {},
    gap: [100, 100]
  }),
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const [, token] = useToken();
    const containerRef = shallowRef();
    const watermarkRef = shallowRef();
    const stopObservation = shallowRef(false);
    const gapX = computed(() => {
      var _a, _b;
      return (_b = (_a = props.gap) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : 100;
    });
    const gapY = computed(() => {
      var _a, _b;
      return (_b = (_a = props.gap) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : 100;
    });
    const gapXCenter = computed(() => gapX.value / 2);
    const gapYCenter = computed(() => gapY.value / 2);
    const offsetLeft = computed(() => {
      var _a, _b;
      return (_b = (_a = props.offset) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : gapXCenter.value;
    });
    const offsetTop = computed(() => {
      var _a, _b;
      return (_b = (_a = props.offset) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : gapYCenter.value;
    });
    const fontSize = computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) === null || _a === void 0 ? void 0 : _a.fontSize) !== null && _b !== void 0 ? _b : token.value.fontSizeLG;
    });
    const fontWeight = computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) === null || _a === void 0 ? void 0 : _a.fontWeight) !== null && _b !== void 0 ? _b : 'normal';
    });
    const fontStyle = computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) === null || _a === void 0 ? void 0 : _a.fontStyle) !== null && _b !== void 0 ? _b : 'normal';
    });
    const fontFamily = computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) === null || _a === void 0 ? void 0 : _a.fontFamily) !== null && _b !== void 0 ? _b : 'sans-serif';
    });
    const color = computed(() => {
      var _a, _b;
      return (_b = (_a = props.font) === null || _a === void 0 ? void 0 : _a.color) !== null && _b !== void 0 ? _b : token.value.colorFill;
    });
    const markStyle = computed(() => {
      var _a;
      const markStyle = {
        zIndex: (_a = props.zIndex) !== null && _a !== void 0 ? _a : 9,
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        backgroundRepeat: 'repeat'
      };
      /** Calculate the style of the offset */
      let positionLeft = offsetLeft.value - gapXCenter.value;
      let positionTop = offsetTop.value - gapYCenter.value;
      if (positionLeft > 0) {
        markStyle.left = `${positionLeft}px`;
        markStyle.width = `calc(100% - ${positionLeft}px)`;
        positionLeft = 0;
      }
      if (positionTop > 0) {
        markStyle.top = `${positionTop}px`;
        markStyle.height = `calc(100% - ${positionTop}px)`;
        positionTop = 0;
      }
      markStyle.backgroundPosition = `${positionLeft}px ${positionTop}px`;
      return markStyle;
    });
    const destroyWatermark = () => {
      if (watermarkRef.value) {
        watermarkRef.value.remove();
        watermarkRef.value = undefined;
      }
    };
    const appendWatermark = (base64Url, markWidth) => {
      var _a;
      if (containerRef.value && watermarkRef.value) {
        stopObservation.value = true;
        watermarkRef.value.setAttribute('style', getStyleStr(_extends(_extends({}, markStyle.value), {
          backgroundImage: `url('${base64Url}')`,
          backgroundSize: `${(gapX.value + markWidth) * BaseSize}px`
        })));
        (_a = containerRef.value) === null || _a === void 0 ? void 0 : _a.append(watermarkRef.value);
        // Delayed execution
        setTimeout(() => {
          stopObservation.value = false;
        });
      }
    };
    /**
     * Get the width and height of the watermark. The default values are as follows
     * Image: [120, 64]; Content: It's calculated by content;
     */
    const getMarkSize = ctx => {
      let defaultWidth = 120;
      let defaultHeight = 64;
      const content = props.content;
      const image = props.image;
      const width = props.width;
      const height = props.height;
      if (!image && ctx.measureText) {
        ctx.font = `${Number(fontSize.value)}px ${fontFamily.value}`;
        const contents = Array.isArray(content) ? content : [content];
        const widths = contents.map(item => ctx.measureText(item).width);
        defaultWidth = Math.ceil(Math.max(...widths));
        defaultHeight = Number(fontSize.value) * contents.length + (contents.length - 1) * FontGap;
      }
      return [width !== null && width !== void 0 ? width : defaultWidth, height !== null && height !== void 0 ? height : defaultHeight];
    };
    const fillTexts = (ctx, drawX, drawY, drawWidth, drawHeight) => {
      const ratio = getPixelRatio();
      const content = props.content;
      const mergedFontSize = Number(fontSize.value) * ratio;
      ctx.font = `${fontStyle.value} normal ${fontWeight.value} ${mergedFontSize}px/${drawHeight}px ${fontFamily.value}`;
      ctx.fillStyle = color.value;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.translate(drawWidth / 2, 0);
      const contents = Array.isArray(content) ? content : [content];
      contents === null || contents === void 0 ? void 0 : contents.forEach((item, index) => {
        ctx.fillText(item !== null && item !== void 0 ? item : '', drawX, drawY + index * (mergedFontSize + FontGap * ratio));
      });
    };
    const renderWatermark = () => {
      var _a;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = props.image;
      const rotate = (_a = props.rotate) !== null && _a !== void 0 ? _a : -22;
      if (ctx) {
        if (!watermarkRef.value) {
          watermarkRef.value = document.createElement('div');
        }
        const ratio = getPixelRatio();
        const [markWidth, markHeight] = getMarkSize(ctx);
        const canvasWidth = (gapX.value + markWidth) * ratio;
        const canvasHeight = (gapY.value + markHeight) * ratio;
        canvas.setAttribute('width', `${canvasWidth * BaseSize}px`);
        canvas.setAttribute('height', `${canvasHeight * BaseSize}px`);
        const drawX = gapX.value * ratio / 2;
        const drawY = gapY.value * ratio / 2;
        const drawWidth = markWidth * ratio;
        const drawHeight = markHeight * ratio;
        const rotateX = (drawWidth + gapX.value * ratio) / 2;
        const rotateY = (drawHeight + gapY.value * ratio) / 2;
        /** Alternate drawing parameters */
        const alternateDrawX = drawX + canvasWidth;
        const alternateDrawY = drawY + canvasHeight;
        const alternateRotateX = rotateX + canvasWidth;
        const alternateRotateY = rotateY + canvasHeight;
        ctx.save();
        rotateWatermark(ctx, rotateX, rotateY, rotate);
        if (image) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            /** Draw interleaved pictures after rotation */
            ctx.restore();
            rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
            ctx.drawImage(img, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
            appendWatermark(canvas.toDataURL(), markWidth);
          };
          img.crossOrigin = 'anonymous';
          img.referrerPolicy = 'no-referrer';
          img.src = image;
        } else {
          fillTexts(ctx, drawX, drawY, drawWidth, drawHeight);
          /** Fill the interleaved text after rotation */
          ctx.restore();
          rotateWatermark(ctx, alternateRotateX, alternateRotateY, rotate);
          fillTexts(ctx, alternateDrawX, alternateDrawY, drawWidth, drawHeight);
          appendWatermark(canvas.toDataURL(), markWidth);
        }
      }
    };
    onMounted(() => {
      renderWatermark();
    });
    watch(() => [props, token.value.colorFill, token.value.fontSizeLG], () => {
      renderWatermark();
    }, {
      deep: true,
      flush: 'post'
    });
    onBeforeUnmount(() => {
      destroyWatermark();
    });
    const onMutate = mutations => {
      if (stopObservation.value) {
        return;
      }
      mutations.forEach(mutation => {
        if (reRendering(mutation, watermarkRef.value)) {
          destroyWatermark();
          renderWatermark();
        }
      });
    };
    useMutationObserver(containerRef, onMutate, {
      attributes: true,
      subtree: true,
      childList: true,
      attributeFilter: ['style', 'class']
    });
    return () => {
      var _a;
      return _createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "ref": containerRef,
        "class": [attrs.class, props.rootClassName],
        "style": [{
          position: 'relative'
        }, attrs.style]
      }), [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]);
    };
  }
});
export default withInstall(Watermark);