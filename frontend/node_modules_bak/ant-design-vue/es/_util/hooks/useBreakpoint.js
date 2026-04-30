import { onMounted, onUnmounted, shallowRef } from 'vue';
import useResponsiveObserve from '../../_util/responsiveObserve';
function useBreakpoint() {
  const screens = shallowRef({});
  let token = null;
  const responsiveObserve = useResponsiveObserve();
  onMounted(() => {
    token = responsiveObserve.value.subscribe(supportScreens => {
      screens.value = supportScreens;
    });
  });
  onUnmounted(() => {
    responsiveObserve.value.unsubscribe(token);
  });
  return screens;
}
export default useBreakpoint;