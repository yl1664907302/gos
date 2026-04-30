import isVisible from '../../vc-util/Dom/isVisible';
import KeyCode from '../../_util/KeyCode';
import raf from '../../_util/raf';
const scrollIds = new Map();
/** Trigger when element is visible in view */
export function waitElementReady(element, callback) {
  let id;
  function tryOrNextFrame() {
    if (isVisible(element)) {
      callback();
    } else {
      id = raf(() => {
        tryOrNextFrame();
      });
    }
  }
  tryOrNextFrame();
  return () => {
    raf.cancel(id);
  };
}
/* eslint-disable no-param-reassign */
export function scrollTo(element, to, duration) {
  if (scrollIds.get(element)) {
    raf.cancel(scrollIds.get(element));
  }
  // jump to target if duration zero
  if (duration <= 0) {
    scrollIds.set(element, raf(() => {
      element.scrollTop = to;
    }));
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = difference / duration * 10;
  scrollIds.set(element, raf(() => {
    element.scrollTop += perTick;
    if (element.scrollTop !== to) {
      scrollTo(element, to, duration - 10);
    }
  }));
}
export function createKeydownHandler(event, _ref) {
  let {
    onLeftRight,
    onCtrlLeftRight,
    onUpDown,
    onPageUpDown,
    onEnter
  } = _ref;
  const {
    which,
    ctrlKey,
    metaKey
  } = event;
  switch (which) {
    case KeyCode.LEFT:
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(-1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(-1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.RIGHT:
      if (ctrlKey || metaKey) {
        if (onCtrlLeftRight) {
          onCtrlLeftRight(1);
          return true;
        }
      } else if (onLeftRight) {
        onLeftRight(1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.UP:
      if (onUpDown) {
        onUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.DOWN:
      if (onUpDown) {
        onUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.PAGE_UP:
      if (onPageUpDown) {
        onPageUpDown(-1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.PAGE_DOWN:
      if (onPageUpDown) {
        onPageUpDown(1);
        return true;
      }
      /* istanbul ignore next */
      break;
    case KeyCode.ENTER:
      if (onEnter) {
        onEnter();
        return true;
      }
      /* istanbul ignore next */
      break;
  }
  return false;
}
// ===================== Format =====================
export function getDefaultFormat(format, picker, showTime, use12Hours) {
  let mergedFormat = format;
  if (!mergedFormat) {
    switch (picker) {
      case 'time':
        mergedFormat = use12Hours ? 'hh:mm:ss a' : 'HH:mm:ss';
        break;
      case 'week':
        mergedFormat = 'gggg-wo';
        break;
      case 'month':
        mergedFormat = 'YYYY-MM';
        break;
      case 'quarter':
        mergedFormat = 'YYYY-[Q]Q';
        break;
      case 'year':
        mergedFormat = 'YYYY';
        break;
      default:
        mergedFormat = showTime ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    }
  }
  return mergedFormat;
}
export function getInputSize(picker, format, generateConfig) {
  const defaultSize = picker === 'time' ? 8 : 10;
  const length = typeof format === 'function' ? format(generateConfig.getNow()).length : format.length;
  return Math.max(defaultSize, length) + 2;
}
let globalClickFunc = null;
const clickCallbacks = new Set();
export function addGlobalMousedownEvent(callback) {
  if (!globalClickFunc && typeof window !== 'undefined' && window.addEventListener) {
    globalClickFunc = e => {
      // Clone a new list to avoid repeat trigger events
      [...clickCallbacks].forEach(queueFunc => {
        queueFunc(e);
      });
    };
    window.addEventListener('mousedown', globalClickFunc);
  }
  clickCallbacks.add(callback);
  return () => {
    clickCallbacks.delete(callback);
    if (clickCallbacks.size === 0) {
      window.removeEventListener('mousedown', globalClickFunc);
      globalClickFunc = null;
    }
  };
}
export function getTargetFromEvent(e) {
  var _a;
  const target = e.target;
  // get target if in shadow dom
  if (e.composed && target.shadowRoot) {
    return ((_a = e.composedPath) === null || _a === void 0 ? void 0 : _a.call(e)[0]) || target;
  }
  return target;
}
// ====================== Mode ======================
const getYearNextMode = next => {
  if (next === 'month' || next === 'date') {
    return 'year';
  }
  return next;
};
const getMonthNextMode = next => {
  if (next === 'date') {
    return 'month';
  }
  return next;
};
const getQuarterNextMode = next => {
  if (next === 'month' || next === 'date') {
    return 'quarter';
  }
  return next;
};
const getWeekNextMode = next => {
  if (next === 'date') {
    return 'week';
  }
  return next;
};
export const PickerModeMap = {
  year: getYearNextMode,
  month: getMonthNextMode,
  quarter: getQuarterNextMode,
  week: getWeekNextMode,
  time: null,
  date: null
};
export function elementsContains(elements, target) {
  if (process.env.NODE_ENV === 'test') {
    return false;
  }
  return elements.some(ele => ele && ele.contains(target));
}