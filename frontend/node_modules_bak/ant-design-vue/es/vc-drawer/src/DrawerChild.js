import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { withDirectives as _withDirectives, createVNode as _createVNode, vShow as _vShow } from "vue";
var __rest = this && this.__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
import { Transition, defineComponent, onMounted, onUnmounted, nextTick, watch, shallowRef } from 'vue';
import classnames from '../../_util/classNames';
import KeyCode from '../../_util/KeyCode';
import omit from '../../_util/omit';
import { drawerChildProps } from './IDrawerPropTypes';
import { dataToArray, windowIsUndefined } from './utils';
const currentDrawer = {};
const DrawerChild = defineComponent({
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: drawerChildProps(),
  emits: ['close', 'handleClick', 'change'],
  setup(props, _ref) {
    let {
      emit,
      slots
    } = _ref;
    const contentWrapper = shallowRef();
    const dom = shallowRef();
    const maskDom = shallowRef();
    const handlerDom = shallowRef();
    const contentDom = shallowRef();
    let levelDom = [];
    const drawerId = `drawer_id_${Number((Date.now() + Math.random()).toString().replace('.', Math.round(Math.random() * 9).toString())).toString(16)}`;
    onMounted(() => {
      nextTick(() => {
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
          nextTick(() => {
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
    watch(() => props.level, () => {
      getLevelDom(props);
    }, {
      flush: 'post'
    });
    watch(() => props.open, () => {
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
    onUnmounted(() => {
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
    watch(() => props.placement, val => {
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
      if (e.keyCode === KeyCode.ESC) {
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
      if (windowIsUndefined) {
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
        dataToArray(level).forEach(key => {
          document.querySelectorAll(key).forEach(item => {
            levelDom.push(item);
          });
        });
      }
    };
    const onHandleClick = e => {
      emit('handleClick', e);
    };
    const canOpen = shallowRef(false);
    watch(dom, () => {
      nextTick(() => {
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
      const wrapperClassName = classnames(prefixCls, {
        [`${prefixCls}-${placement}`]: true,
        [`${prefixCls}-open`]: open,
        [`${prefixCls}-inline`]: inline,
        'no-mask': !showMask,
        [rootClassName]: true
      });
      const motionProps = typeof motion === 'function' ? motion(placement) : motion;
      return _createVNode("div", _objectSpread(_objectSpread({}, omit(otherProps, ['autofocus'])), {}, {
        "tabindex": -1,
        "class": wrapperClassName,
        "style": rootStyle,
        "ref": dom,
        "onKeydown": open && keyboard ? onKeyDown : undefined
      }), [_createVNode(Transition, maskMotion, {
        default: () => [showMask && _withDirectives(_createVNode("div", {
          "class": `${prefixCls}-mask`,
          "onClick": maskClosable ? onClose : undefined,
          "style": maskStyle,
          "ref": maskDom
        }, null), [[_vShow, open]])]
      }), _createVNode(Transition, _objectSpread(_objectSpread({}, motionProps), {}, {
        "onAfterEnter": onAfterVisibleChange,
        "onAfterLeave": onAfterVisibleChange
      }), {
        default: () => [_withDirectives(_createVNode("div", {
          "class": `${prefixCls}-content-wrapper`,
          "style": [contentWrapperStyle],
          "ref": contentWrapper
        }, [_createVNode("div", {
          "class": [`${prefixCls}-content`, className],
          "style": style,
          "ref": contentDom
        }, [(_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)]), slots.handler ? _createVNode("div", {
          "onClick": onHandleClick,
          "ref": handlerDom
        }, [(_b = slots.handler) === null || _b === void 0 ? void 0 : _b.call(slots)]) : null]), [[_vShow, open]])]
      })]);
    };
  }
});
export default DrawerChild;