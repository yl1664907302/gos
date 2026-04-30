"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getScrollBarSize = _interopRequireDefault(require("../../_util/getScrollBarSize"));
var _setStyle = _interopRequireDefault(require("../../_util/setStyle"));
let locks = [];
const scrollingEffectClassName = 'ant-scrolling-effect';
const scrollingEffectClassNameReg = new RegExp(`${scrollingEffectClassName}`, 'g');
let uuid = 0;
// https://github.com/ant-design/ant-design/issues/19340
// https://github.com/ant-design/ant-design/issues/19332
const cacheStyle = new Map();
class ScrollLocker {
  constructor(options) {
    this.getContainer = () => {
      var _a;
      return (_a = this.options) === null || _a === void 0 ? void 0 : _a.container;
    };
    // if options change...
    this.reLock = options => {
      const findLock = locks.find(_ref => {
        let {
          target
        } = _ref;
        return target === this.lockTarget;
      });
      if (findLock) {
        this.unLock();
      }
      this.options = options;
      if (findLock) {
        findLock.options = options;
        this.lock();
      }
    };
    this.lock = () => {
      var _a;
      // If lockTarget exist return
      if (locks.some(_ref2 => {
        let {
          target
        } = _ref2;
        return target === this.lockTarget;
      })) {
        return;
      }
      // If same container effect, return
      if (locks.some(_ref3 => {
        let {
          options
        } = _ref3;
        var _a;
        return (options === null || options === void 0 ? void 0 : options.container) === ((_a = this.options) === null || _a === void 0 ? void 0 : _a.container);
      })) {
        locks = [...locks, {
          target: this.lockTarget,
          options: this.options
        }];
        return;
      }
      let scrollBarSize = 0;
      const container = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.container) || document.body;
      if (container === document.body && window.innerWidth - document.documentElement.clientWidth > 0 || container.scrollHeight > container.clientHeight) {
        scrollBarSize = (0, _getScrollBarSize.default)();
      }
      const containerClassName = container.className;
      if (locks.filter(_ref4 => {
        let {
          options
        } = _ref4;
        var _a;
        return (options === null || options === void 0 ? void 0 : options.container) === ((_a = this.options) === null || _a === void 0 ? void 0 : _a.container);
      }).length === 0) {
        cacheStyle.set(container, (0, _setStyle.default)({
          width: scrollBarSize !== 0 ? `calc(100% - ${scrollBarSize}px)` : undefined,
          overflow: 'hidden',
          overflowX: 'hidden',
          overflowY: 'hidden'
        }, {
          element: container
        }));
      }
      // https://github.com/ant-design/ant-design/issues/19729
      if (!scrollingEffectClassNameReg.test(containerClassName)) {
        const addClassName = `${containerClassName} ${scrollingEffectClassName}`;
        container.className = addClassName.trim();
      }
      locks = [...locks, {
        target: this.lockTarget,
        options: this.options
      }];
    };
    this.unLock = () => {
      var _a;
      const findLock = locks.find(_ref5 => {
        let {
          target
        } = _ref5;
        return target === this.lockTarget;
      });
      locks = locks.filter(_ref6 => {
        let {
          target
        } = _ref6;
        return target !== this.lockTarget;
      });
      if (!findLock || locks.some(_ref7 => {
        let {
          options
        } = _ref7;
        var _a;
        return (options === null || options === void 0 ? void 0 : options.container) === ((_a = findLock.options) === null || _a === void 0 ? void 0 : _a.container);
      })) {
        return;
      }
      // Remove Effect
      const container = ((_a = this.options) === null || _a === void 0 ? void 0 : _a.container) || document.body;
      const containerClassName = container.className;
      if (!scrollingEffectClassNameReg.test(containerClassName)) return;
      (0, _setStyle.default)(cacheStyle.get(container), {
        element: container
      });
      cacheStyle.delete(container);
      container.className = container.className.replace(scrollingEffectClassNameReg, '').trim();
    };
    // eslint-disable-next-line no-plusplus
    this.lockTarget = uuid++;
    this.options = options;
  }
}
exports.default = ScrollLocker;