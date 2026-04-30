"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _classNames = _interopRequireDefault(require("../../_util/classNames"));
var _KeyCode = _interopRequireDefault(require("../../_util/KeyCode"));
var _omit = _interopRequireDefault(require("../../_util/omit"));
var _IDrawerPropTypes = require("./IDrawerPropTypes");
var _utils = require("./utils");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const currentDrawer = {};
const DrawerChild = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: (0, _IDrawerPropTypes.drawerChildProps)(),
  emits: ['close', 'handleClick', 'change'],
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const contentWrapper = (0, _vue.shallowRef)();
    const dom = (0, _vue.shallowRef)();
    const maskDom = (0, _vue.shallowRef)();
    const handlerDom = (0, _vue.shallowRef)();
    const contentDom = (0, _vue.shallowRef)();
    let levelDom = [];
    const drawerId = `drawer_id_${Number((Date.now() + Math.random()).toString().replace('.', Math.round(Math.random() * 9).toString())).toString(16)}`;
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        var _a;
        const {
          open,
          getContainer,
          showMask,
          autofocus
        } = props;
        const container = getContainer === null || getContainer === void 0 ? void 0 : getContainer();
        getLevelDom(props);
        if (open) {
          if (container && container.parentNode === document.body) {
            currentDrawer[drawerId] = open;
          }
          (0, _vue.nextTick)(() => {
            if (autofocus) {
              domFocus();
            }
          });
          if (showMask) {
            (_a = props.scrollLocker) === null || _a === void 0 ? void 0 : _a.lock();
          }
        }
      });
    });
    (0, _vue.watch)(() => props.level, () => {
      getLevelDom(props);
    }, {
      flush: 'post'
    });
    (0, _vue.watch)(() => props.open, () => {
      const {
        open,
        getContainer,
        scrollLocker,
        showMask,
        autofocus
      } = props;
      const container = getContainer === null || getContainer === void 0 ? void 0 : getContainer();
      if (container && container.parentNode === document.body) {
        currentDrawer[drawerId] = !!open;
      }
      if (open) {
        if (autofocus) {
          domFocus();
        }
        if (showMask) {
          scrollLocker === null || scrollLocker === void 0 ? void 0 : scrollLocker.lock();
        }
      } else {
        scrollLocker === null || scrollLocker === void 0 ? void 0 : scrollLocker.unLock();
      }
    }, {
      flush: 'post'
    });
    (0, _vue.onUnmounted)(() => {
      var _a;
      const {
        open
      } = props;
      delete currentDrawer[drawerId];
      if (open) {
        document.body.style.touchAction = '';
      }
      (_a = props.scrollLocker) === null || _a === void 0 ? void 0 : _a.unLock();
    });
    (0, _vue.watch)(() => props.placement, val => {
      if (val) {
        // test 的 bug, 有动画过场，删除 dom
        contentDom.value = null;
      }
    });
    const domFocus = () => {
      var _a, _b;
      (_b = (_a = dom.value) === null || _a === void 0 ? void 0 : _a.focus) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    const onClose = e => {
      emit('close', e);
    };
    const onKeyDown = e => {
      if (e.keyCode === _KeyCode.default.ESC) {
        e.stopPropagation();
        onClose(e);
      }
    };
    const onAfterVisibleChange = () => {
      const {
        open,
        afterVisibleChange
      } = props;
      if (afterVisibleChange) {
        afterVisibleChange(!!open);
      }
    };
    const getLevelDom = _ref2 => {
      let {
        level,
        getContainer
      } = _ref2;
      if (_utils.windowIsUndefined) {
        return;
      }
      const container = getContainer === null || getContainer === void 0 ? void 0 : getContainer();
      const parent = container ? container.parentNode : null;
      levelDom = [];
      if (level === 'all') {
        const children = parent ? Array.prototype.slice.call(parent.children) : [];
        children.forEach(child => {
          if (child.nodeName !== 'SCRIPT' && child.nodeName !== 'STYLE' && child.nodeName !== 'LINK' && child !== container) {
            levelDom.push(child);
          }
        });
      } else if (level) {
        (0, _utils.dataToArray)(level).forEach(key => {
          document.querySelectorAll(key).forEach(item => {
            levelDom.push(item);
          });
        });
      }
    };
    const onHandleClick = e => {
      emit('handleClick', e);
    };
    const canOpen = (0, _vue.shallowRef)(false);
    (0, _vue.watch)(dom, () => {
      (0, _vue.nextTick)(() => {
        canOpen.value = true;
      });
    });
    return () => {
      var _a, _b;
      const {
          width,
          height,
          open: $open,
          prefixCls,
          placement,
          level,
          levelMove,
          ease,
          duration,
          getContainer,
          onChange,
          afterVisibleChange,
          showMask,
          maskClosable,
          maskStyle,
          keyboard,
          getOpenCount,
          scrollLocker,
          contentWrapperStyle,
          style,
          class: className,
          rootClassName,
          rootStyle,
          maskMotion,
          motion,
          inline
        } = props,
        otherProps = __rest(props, ["width", "height", "open", "prefixCls", "placement", "level", "levelMove", "ease", "duration", "getContainer", "onChange", "afterVisibleChange", "showMask", "maskClosable", "maskStyle", "keyboard", "getOpenCount", "scrollLocker", "contentWrapperStyle", "style", "class", "rootClassName", "rootStyle", "maskMotion", "motion", "inline"]);
      // 首次渲染都将是关闭状态。
      const open = $open && canOpen.value;
      const wrapperClassName = (0, _classNames.default)(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        [`${prefixCls}-inline`]: inline,
        'no-mask': !showMask,
        [rootClassName]: true
      });
      const motionProps = typeof motion === 'function' ? motion(placement) : motion;
      return (0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, (0, _omit.default)(otherProps, ['autofocus'])), {}, {
        "tabindex": -1,
        "class": wrapperClassName,
        "style": rootStyle,
        "ref": dom,
        "onKeydown": open && keyboard ? onKeyDown : undefined
      }), [(0, _vue.createVNode)(_vue.Transition, maskMotion, {
        default: () => [showMask && (0, _vue.withDirectives)((0, _vue.createVNode)("div", {
          "class": `${prefixCls}-mask`,
          "onClick": maskClosable ? onClose : undefined,
          "style": maskStyle,
          "ref": maskDom
        }, null), [[_vue.vShow, open]])]
      }), (0, _vue.createVNode)(_vue.Transition, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, motionProps), {}, {
        "onAfterEnter": onAfterVisibleChange,
        "onAfterLeave": onAfterVisibleChange
      }), {
        default: () => [(0, _vue.withDirectives)((0, _vue.createVNode)("div", {
          "class": `${prefixCls}-content-wrapper`,
          "style": [contentWrapperStyle],
          "ref": contentWrapper
        }, [(0, _vue.createVNode)("div", {
          "class": [`${prefixCls}-content`, className],
          "style": style,
          "ref": contentDom
        }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), slots.handler ? (0, _vue.createVNode)("div", {
          "onClick": onHandleClick,
          "ref": handlerDom
        }, [(_b = slots.handler) === null || _b === void 0 ? void 0 : _b.call(slots)]) : null]), [[_vue.vShow, open]])]
      })]);
    };
  }
});
var _default = exports.default = DrawerChild;