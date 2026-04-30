import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent, computed } from 'vue';
import { initDefaultProps } from '../_util/props-util';
import classNames from '../_util/classNames';
import { objectType } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useMessage from '../message/useMessage';
import useModal from '../modal/useModal';
import useNotification from '../notification/useNotification';
import { useProvideAppConfigContext, useInjectAppConfigContext, useProvideAppContext, useInjectAppContext } from './context';
import useStyle from './style';
export const AppProps = () => {
  return {
    rootClassName: String,
    message: objectType(),
    notification: objectType()
  };
};
const useApp = () => {
  return useInjectAppContext();
};
const App = defineComponent({
  name: 'AApp',
  props: initDefaultProps(AppProps(), {}),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = useConfigInject('app', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const customClassName = computed(() => {
      return classNames(hashId.value, prefixCls.value, props.rootClassName);
    });
    const appConfig = useInjectAppConfigContext();
    const mergedAppConfig = computed(() => ({
      message: _extends(_extends({}, appConfig.message), props.message),
      notification: _extends(_extends({}, appConfig.notification), props.notification)
    }));
    useProvideAppConfigContext(mergedAppConfig.value);
    const [messageApi, messageContextHolder] = useMessage(mergedAppConfig.value.message);
    const [notificationApi, notificationContextHolder] = useNotification(mergedAppConfig.value.notification);
    const [ModalApi, ModalContextHolder] = useModal();
    const memoizedContextValue = computed(() => ({
      message: messageApi,
      notification: notificationApi,
      modal: ModalApi
    }));
    useProvideAppContext(memoizedContextValue.value);
    return () => {
      var _a;
      return wrapSSR(_createVNode("div", {
        "class": customClassName.value
      }, [ModalContextHolder(), messageContextHolder(), notificationContextHolder(), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
App.useApp = useApp;
App.install = function (app) {
  app.component(App.name, App);
};
export default App;