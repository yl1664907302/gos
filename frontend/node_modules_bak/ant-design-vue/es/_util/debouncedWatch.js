import _extends from "@babel/runtime/helpers/esm/extends";
// copy from https://github.dev/vueuse/vueuse
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { unref, watch } from 'vue';
const bypassFilter = invoke => {
  return invoke();
};
/**
 * Create an EventFilter that debounce the events
 *
 * @param ms
 */
export function debounceFilter(ms) {
  let timer;
  const filter = invoke => {
    const duration = unref(ms);
    if (timer) clearTimeout(timer);
    if (duration <= 0) return invoke();
    timer = setTimeout(invoke, duration);
  };
  return filter;
}
/**
 * @internal
 */
function createFilterWrapper(filter, fn) {
  function wrapper() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    filter(() => fn.apply(this, args), {
      fn,
      thisArg: this,
      args
    });
  }
  return wrapper;
}
// implementation
export function watchWithFilter(source, cb) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
      eventFilter = bypassFilter
    } = options,
    watchOptions = __rest(options, ["eventFilter"]);
  return watch(source, createFilterWrapper(eventFilter, cb), watchOptions);
}
// implementation
export default function debouncedWatch(source, cb) {
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const {
      debounce = 0
    } = options,
    watchOptions = __rest(options, ["debounce"]);
  return watchWithFilter(source, cb, _extends(_extends({}, watchOptions), {
    eventFilter: debounceFilter(debounce)
  }));
}