import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent, onBeforeUnmount, onMounted, onUpdated, ref } from 'vue';
import omit from '../_util/omit';
import initDefaultProps from '../_util/props-util/initDefaultProps';
import { someType } from '../_util/type';
import Statistic, { statisticProps } from './Statistic';
import { formatCountdown as formatCD } from './utils';
const REFRESH_INTERVAL = 1000 / 30;
function getTime(value) {
  return new Date(value).getTime();
}
export const countdownProps = () => {
  return _extends(_extends({}, statisticProps()), {
    value: someType([Number, String, Object]),
    format: String,
    onFinish: Function,
    onChange: Function
  });
};
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AStatisticCountdown',
  props: initDefaultProps(countdownProps(), {
    format: 'HH:mm:ss'
  }),
  // emits: ['finish', 'change'],
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const countdownId = ref();
    const statistic = ref();
    const syncTimer = () => {
      const {
        value
      } = props;
      const timestamp = getTime(value);
      if (timestamp >= Date.now()) {
        startTimer();
      } else {
        stopTimer();
      }
    };
    const startTimer = () => {
      if (countdownId.value) return;
      const timestamp = getTime(props.value);
      countdownId.value = setInterval(() => {
        statistic.value.$forceUpdate();
        if (timestamp > Date.now()) {
          emit('change', timestamp - Date.now());
        }
        syncTimer();
      }, REFRESH_INTERVAL);
    };
    const stopTimer = () => {
      const {
        value
      } = props;
      if (countdownId.value) {
        clearInterval(countdownId.value);
        countdownId.value = undefined;
        const timestamp = getTime(value);
        if (timestamp < Date.now()) {
          emit('finish');
        }
      }
    };
    const formatCountdown = _ref2 => {
      let {
        value,
        config
      } = _ref2;
      const {
        format
      } = props;
      return formatCD(value, _extends(_extends({}, config), {
        format
      }));
    };
    const valueRenderHtml = node => node;
    onMounted(() => {
      syncTimer();
    });
    onUpdated(() => {
      syncTimer();
    });
    onBeforeUnmount(() => {
      stopTimer();
    });
    return () => {
      const value = props.value;
      return _createVNode(Statistic, _objectSpread({
        "ref": statistic
      }, _extends(_extends({}, omit(props, ['onFinish', 'onChange'])), {
        value,
        valueRender: valueRenderHtml,
        formatter: formatCountdown
      })), slots);
    };
  }
});