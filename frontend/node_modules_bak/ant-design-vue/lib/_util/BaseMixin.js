"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _vue = require("vue");
var _propsUtil = require("./props-util");
var _default = exports.default = {
  methods: {
    setState() {
      let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      let callback = arguments.length > 1 ? arguments[1] : undefined;
      let newState = typeof state === 'function' ? state(this.$data, this.$props) : state;
      if (this.getDerivedStateFromProps) {
        const s = this.getDerivedStateFromProps((0, _propsUtil.getOptionProps)(this), (0, _extends2.default)((0, _extends2.default)({}, this.$data), newState));
        if (s === null) {
          return;
        } else {
          newState = (0, _extends2.default)((0, _extends2.default)({}, newState), s || {});
        }
      }
      (0, _extends2.default)(this.$data, newState);
      if (this._.isMounted) {
        this.$forceUpdate();
      }
      (0, _vue.nextTick)(() => {
        callback && callback();
      });
    },
    __emit() {
      // 直接调用事件，底层组件不需要vueTool记录events
      // eslint-disable-next-line prefer-rest-params
      const args = [].slice.call(arguments, 0);
      let eventName = args[0];
      eventName = `on${eventName[0].toUpperCase()}${eventName.substring(1)}`;
      const event = this.$props[eventName] || this.$attrs[eventName];
      if (args.length && event) {
        if (Array.isArray(event)) {
          for (let i = 0, l = event.length; i < l; i++) {
            event[i](...args.slice(1));
          }
        } else {
          event(...args.slice(1));
        }
      }
    }
  }
};