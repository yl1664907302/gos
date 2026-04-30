import { shallowRef, watch } from 'vue';
import { useResizeObserver } from './useResizeObserver';
import { unrefElement } from './unrefElement';
/**
 * Reactive size of an HTML element.
 *
 * @see https://vueuse.org/useElementSize
 * @param target
 * @param callback
 * @param options
 */
export function useElementSize(target) {
  let initialSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    width: 0,
    height: 0
  };
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
    box = 'content-box'
  } = options;
  const width = shallowRef(initialSize.width);
  const height = shallowRef(initialSize.height);
  useResizeObserver(target, _ref => {
    let [entry] = _ref;
    const boxSize = box === 'border-box' ? entry.borderBoxSize : box === 'content-box' ? entry.contentBoxSize : entry.devicePixelContentBoxSize;
    if (boxSize) {
      width.value = boxSize.reduce((acc, _ref2) => {
        let {
          inlineSize
        } = _ref2;
        return acc + inlineSize;
      }, 0);
      height.value = boxSize.reduce((acc, _ref3) => {
        let {
          blockSize
        } = _ref3;
        return acc + blockSize;
      }, 0);
    } else {
      // fallback
      width.value = entry.contentRect.width;
      height.value = entry.contentRect.height;
    }
  }, options);
  watch(() => unrefElement(target), ele => {
    width.value = ele ? initialSize.width : 0;
    height.value = ele ? initialSize.height : 0;
  });
  return {
    width,
    height
  };
}