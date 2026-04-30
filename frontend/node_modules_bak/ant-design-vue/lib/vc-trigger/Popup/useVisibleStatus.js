"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _raf = _interopRequireDefault(require("../../_util/raf"));
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const StatusQueue = ['measure', 'align', null, 'motion'];
var _default = (visible, doMeasure) => {
  const status = (0, _vue.shallowRef)(null);
  const rafRef = (0, _vue.shallowRef)();
  const destroyRef = (0, _vue.shallowRef)(false);
  function setStatus(nextStatus) {
    if (!destroyRef.value) {
      status.value = nextStatus;
    }
  }
  function cancelRaf() {
    _raf.default.cancel(rafRef.value);
  }
  function goNextStatus(callback) {
    cancelRaf();
    rafRef.value = (0, _raf.default)(() => {
      // Only align should be manually trigger
      let newStatus = status.value;
      switch (status.value) {
        case 'align':
          newStatus = 'motion';
          break;
        case 'motion':
          newStatus = 'stable';
          break;
        default:
      }
      setStatus(newStatus);
      callback === null || callback === void 0 ? void 0 : callback();
    });
  }
  (0, _vue.watch)(visible, () => {
    setStatus('measure');
  }, {
    immediate: true,
    flush: 'post'
  });
  (0, _vue.onMounted)(() => {
    // Go next status
    (0, _vue.watch)(status, () => {
      switch (status.value) {
        case 'measure':
          doMeasure();
          break;
        default:
      }
      if (status.value) {
        rafRef.value = (0, _raf.default)(() => __awaiter(void 0, void 0, void 0, function* () {
          const index = StatusQueue.indexOf(status.value);
          const nextStatus = StatusQueue[index + 1];
          if (nextStatus && index !== -1) {
            setStatus(nextStatus);
          }
        }));
      }
    }, {
      immediate: true,
      flush: 'post'
    });
  });
  (0, _vue.onBeforeUnmount)(() => {
    destroyRef.value = true;
    cancelRaf();
  });
  return [status, goNextStatus];
};
exports.default = _default;