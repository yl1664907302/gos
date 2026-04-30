import getRequestAnimationFrame, { cancelRequestAnimationFrame as caf } from './getRequestAnimationFrame';
const raf = getRequestAnimationFrame();
export const cancelAnimationTimeout = frame => caf(frame.id);
export const requestAnimationTimeout = function (callback) {
  let delay = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  const start = Date.now();
  function timeout() {
    if (Date.now() - start >= delay) {
      callback.call();
    } else {
      frame.id = raf(timeout);
    }
  }
  const frame = {
    id: raf(timeout)
  };
  return frame;
};