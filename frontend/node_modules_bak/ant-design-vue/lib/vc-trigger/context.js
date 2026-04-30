"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useProvidePortal = exports.useInjectPortal = void 0;
var _vue = require("vue");
const PortalContextKey = Symbol('PortalContextKey');
const useProvidePortal = function (instance) {
  let config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    inTriggerContext: true
  };
  (0, _vue.provide)(PortalContextKey, {
    inTriggerContext: config.inTriggerContext,
    shouldRender: (0, _vue.computed)(() => {
      const {
        sPopupVisible,
        popupRef,
        forceRender,
        autoDestroy
      } = instance || {};
      // if (popPortal) return true;
      let shouldRender = false;
      if (sPopupVisible || popupRef || forceRender) {
        shouldRender = true;
      }
      if (!sPopupVisible && autoDestroy) {
        shouldRender = false;
      }
      return shouldRender;
    })
  });
};
exports.useProvidePortal = useProvidePortal;
const useInjectPortal = () => {
  useProvidePortal({}, {
    inTriggerContext: false
  });
  const portalContext = (0, _vue.inject)(PortalContextKey, {
    shouldRender: (0, _vue.computed)(() => false),
    inTriggerContext: false
  });
  return {
    shouldRender: (0, _vue.computed)(() => portalContext.shouldRender.value || portalContext.inTriggerContext === false)
  };
};
exports.useInjectPortal = useInjectPortal;