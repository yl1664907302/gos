"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.AppProps = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _propsUtil = require("../_util/props-util");
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _useMessage = _interopRequireDefault(require("../message/useMessage"));
var _useModal = _interopRequireDefault(require("../modal/useModal"));
var _useNotification = _interopRequireDefault(require("../notification/useNotification"));
var _context = require("./context");
var _style = _interopRequireDefault(require("./style"));
const AppProps = () => {
  return {
    rootClassName: String,
    message: (0, _type.objectType)(),
    notification: (0, _type.objectType)()
  };
};
exports.AppProps = AppProps;
const useApp = () => {
  return (0, _context.useInjectAppContext)();
};
const App = (0, _vue.defineComponent)({
  name: 'AApp',
  props: (0, _propsUtil.initDefaultProps)(AppProps(), {}),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('app', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const customClassName = (0, _vue.computed)(() => {
      return (0, _classNames.default)(hashId.value, prefixCls.value, props.rootClassName);
    });
    const appConfig = (0, _context.useInjectAppConfigContext)();
    const mergedAppConfig = (0, _vue.computed)(() => ({
      message: (0, _extends2.default)((0, _extends2.default)({}, appConfig.message), props.message),
      notification: (0, _extends2.default)((0, _extends2.default)({}, appConfig.notification), props.notification)
    }));
    (0, _context.useProvideAppConfigContext)(mergedAppConfig.value);
    const [messageApi, messageContextHolder] = (0, _useMessage.default)(mergedAppConfig.value.message);
    const [notificationApi, notificationContextHolder] = (0, _useNotification.default)(mergedAppConfig.value.notification);
    const [ModalApi, ModalContextHolder] = (0, _useModal.default)();
    const memoizedContextValue = (0, _vue.computed)(() => ({
      message: messageApi,
      notification: notificationApi,
      modal: ModalApi
    }));
    (0, _context.useProvideAppContext)(memoizedContextValue.value);
    return () => {
      var _a;
      return wrapSSR((0, _vue.createVNode)("div", {
        "class": customClassName.value
      }, [ModalContextHolder(), messageContextHolder(), notificationContextHolder(), (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]));
    };
  }
});
App.useApp = useApp;
App.install = function (app) {
  app.component(App.name, App);
};
var _default = exports.default = App;