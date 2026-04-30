import raf from './raf';
function throttleByAnimationFrame(fn) {
  let requestId;
  const later = args => () => {
    requestId = null;
    fn(...args);
  };
  const throttled = function () {
    if (requestId == null) {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      requestId = raf(later(args));
    }
  };
  throttled.cancel = () => {
    raf.cancel(requestId);
    requestId = null;
  };
  return throttled;
}
export default throttleByAnimationFrame;