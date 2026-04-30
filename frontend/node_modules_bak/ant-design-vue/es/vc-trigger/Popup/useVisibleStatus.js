var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
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
import { onBeforeUnmount, shallowRef, watch, onMounted } from 'vue';
import raf from '../../_util/raf';
const StatusQueue = ['measure', 'align', null, 'motion'];
export default ((visible, doMeasure) => {
  const status = shallowRef(null);
  const rafRef = shallowRef();
  const destroyRef = shallowRef(false);
  function setStatus(nextStatus) {
    if (!destroyRef.value) {
      status.value = nextStatus;
    }
  }
  function cancelRaf() {
    raf.cancel(rafRef.value);
  }
  function goNextStatus(callback) {
    cancelRaf();
    rafRef.value = raf(() => {
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
  watch(visible, () => {
    setStatus('measure');
  }, {
    immediate: true,
    flush: 'post'
  });
  onMounted(() => {
    // Go next status
    watch(status, () => {
      switch (status.value) {
        case 'measure':
          doMeasure();
          break;
        default:
      }
      if (status.value) {
        rafRef.value = raf(() => __awaiter(void 0, void 0, void 0, function* () {
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
  onBeforeUnmount(() => {
    destroyRef.value = true;
    cancelRaf();
  });
  return [status, goNextStatus];
});