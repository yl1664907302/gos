"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.anchorProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _scrollIntoViewIfNeeded = _interopRequireDefault(require("scroll-into-view-if-needed"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _addEventListener = _interopRequireDefault(require("../vc-util/Dom/addEventListener"));
var _affix = _interopRequireDefault(require("../affix"));
var _scrollTo = _interopRequireDefault(require("../_util/scrollTo"));
var _getScroll = _interopRequireDefault(require("../_util/getScroll"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _context = _interopRequireDefault(require("./context"));
var _style = _interopRequireDefault(require("./style"));
var _AnchorLink = _interopRequireDefault(require("./AnchorLink"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _devWarning = _interopRequireDefault(require("../vc-util/devWarning"));
var _type = require("../_util/type");
function getDefaultContainer() {
  return window;
}
function getOffsetTop(element, container) {
  if (!element.getClientRects().length) {
    return 0;
  }
  const rect = element.getBoundingClientRect();
  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement;
      return rect.top - container.clientTop;
    }
    return rect.top - container.getBoundingClientRect().top;
  }
  return rect.top;
}
const sharpMatcherRegx = /#([\S ]+)$/;
const anchorProps = () => ({
  prefixCls: String,
  offsetTop: Number,
  bounds: Number,
  affix: {
    type: Boolean,
    default: true
  },
  showInkInFixed: {
    type: Boolean,
    default: false
  },
  getContainer: Function,
  wrapperClass: String,
  wrapperStyle: {
    type: Object,
    default: undefined
  },
  getCurrentAnchor: Function,
  targetOffset: Number,
  items: (0, _type.arrayType)(),
  direction: _vueTypes.default.oneOf(['vertical', 'horizontal']).def('vertical'),
  onChange: Function,
  onClick: Function
});
exports.anchorProps = anchorProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AAnchor',
  inheritAttrs: false,
  props: anchorProps(),
  setup(props, _ref) {
    let {
      emit,
      attrs,
      slots,
      expose
    } = _ref;
    var _a;
    const {
      prefixCls,
      getTargetContainer,
      direction
    } = (0, _useConfigInject.default)('anchor', props);
    const anchorDirection = (0, _vue.computed)(() => {
      var _a;
      return (_a = props.direction) !== null && _a !== void 0 ? _a : 'vertical';
    });
    if (process.env.NODE_ENV !== 'production') {
      (0, _devWarning.default)(props.items && typeof slots.default !== 'function', 'Anchor', '`Anchor children` is deprecated. Please use `items` instead.');
    }
    if (process.env.NODE_ENV !== 'production') {
      (0, _devWarning.default)(!(anchorDirection.value === 'horizontal' && ((_a = props.items) === null || _a === void 0 ? void 0 : _a.some(n => 'children' in n))), 'Anchor', '`Anchor items#children` is not supported when `Anchor` direction is horizontal.');
    }
    const spanLinkNode = (0, _vue.ref)(null);
    const anchorRef = (0, _vue.ref)();
    const state = (0, _vue.reactive)({
      links: [],
      scrollContainer: null,
      scrollEvent: null,
      animating: false
    });
    const activeLink = (0, _vue.ref)(null);
    const getContainer = (0, _vue.computed)(() => {
      const {
        getContainer
      } = props;
      return getContainer || (getTargetContainer === null || getTargetContainer === void 0 ? void 0 : getTargetContainer.value) || getDefaultContainer;
    });
    // func...
    const getCurrentAnchor = function () {
      let offsetTop = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      let bounds = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
      const linkSections = [];
      const container = getContainer.value();
      state.links.forEach(link => {
        const sharpLinkMatch = sharpMatcherRegx.exec(link.toString());
        if (!sharpLinkMatch) {
          return;
        }
        const target = document.getElementById(sharpLinkMatch[1]);
        if (target) {
          const top = getOffsetTop(target, container);
          if (top < offsetTop + bounds) {
            linkSections.push({
              link,
              top
            });
          }
        }
      });
      if (linkSections.length) {
        const maxSection = linkSections.reduce((prev, curr) => curr.top > prev.top ? curr : prev);
        return maxSection.link;
      }
      return '';
    };
    const setCurrentActiveLink = link => {
      const {
        getCurrentAnchor
      } = props;
      if (activeLink.value === link) {
        return;
      }
      activeLink.value = typeof getCurrentAnchor === 'function' ? getCurrentAnchor(link) : link;
      emit('change', link);
    };
    const handleScrollTo = link => {
      const {
        offsetTop,
        targetOffset
      } = props;
      setCurrentActiveLink(link);
      const sharpLinkMatch = sharpMatcherRegx.exec(link);
      if (!sharpLinkMatch) {
        return;
      }
      const targetElement = document.getElementById(sharpLinkMatch[1]);
      if (!targetElement) {
        return;
      }
      const container = getContainer.value();
      const scrollTop = (0, _getScroll.default)(container, true);
      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      state.animating = true;
      (0, _scrollTo.default)(y, {
        callback: () => {
          state.animating = false;
        },
        getContainer: getContainer.value
      });
    };
    expose({
      scrollTo: handleScrollTo
    });
    const handleScroll = () => {
      if (state.animating) {
        return;
      }
      const {
        offsetTop,
        bounds,
        targetOffset
      } = props;
      const currentActiveLink = getCurrentAnchor(targetOffset !== undefined ? targetOffset : offsetTop || 0, bounds);
      setCurrentActiveLink(currentActiveLink);
    };
    const updateInk = () => {
      const linkNode = anchorRef.value.querySelector(`.${prefixCls.value}-link-title-active`);
      if (linkNode && spanLinkNode.value) {
        const horizontalAnchor = anchorDirection.value === 'horizontal';
        spanLinkNode.value.style.top = horizontalAnchor ? '' : `${linkNode.offsetTop + linkNode.clientHeight / 2}px`;
        spanLinkNode.value.style.height = horizontalAnchor ? '' : `${linkNode.clientHeight}px`;
        spanLinkNode.value.style.left = horizontalAnchor ? `${linkNode.offsetLeft}px` : '';
        spanLinkNode.value.style.width = horizontalAnchor ? `${linkNode.clientWidth}px` : '';
        if (horizontalAnchor) {
          (0, _scrollIntoViewIfNeeded.default)(linkNode, {
            scrollMode: 'if-needed',
            block: 'nearest'
          });
        }
      }
    };
    (0, _context.default)({
      registerLink: link => {
        if (!state.links.includes(link)) {
          state.links.push(link);
        }
      },
      unregisterLink: link => {
        const index = state.links.indexOf(link);
        if (index !== -1) {
          state.links.splice(index, 1);
        }
      },
      activeLink,
      scrollTo: handleScrollTo,
      handleClick: (e, info) => {
        emit('click', e, info);
      },
      direction: anchorDirection
    });
    (0, _vue.onMounted)(() => {
      (0, _vue.nextTick)(() => {
        const container = getContainer.value();
        state.scrollContainer = container;
        state.scrollEvent = (0, _addEventListener.default)(state.scrollContainer, 'scroll', handleScroll);
        handleScroll();
      });
    });
    (0, _vue.onBeforeUnmount)(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });
    (0, _vue.onUpdated)(() => {
      if (state.scrollEvent) {
        const currentContainer = getContainer.value();
        if (state.scrollContainer !== currentContainer) {
          state.scrollContainer = currentContainer;
          state.scrollEvent.remove();
          state.scrollEvent = (0, _addEventListener.default)(state.scrollContainer, 'scroll', handleScroll);
          handleScroll();
        }
      }
      updateInk();
    });
    const createNestedLink = options => Array.isArray(options) ? options.map(option => {
      const {
        children,
        key,
        href,
        target,
        class: cls,
        style,
        title
      } = option;
      return (0, _vue.createVNode)(_AnchorLink.default, {
        "key": key,
        "href": href,
        "target": target,
        "class": cls,
        "style": style,
        "title": title,
        "customTitleProps": option
      }, {
        default: () => [anchorDirection.value === 'vertical' ? createNestedLink(children) : null],
        customTitle: slots.customTitle
      });
    }) : null;
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a;
      const {
        offsetTop,
        affix,
        showInkInFixed
      } = props;
      const pre = prefixCls.value;
      const inkClass = (0, _classNames.default)(`${pre}-ink`, {
        [`${pre}-ink-visible`]: activeLink.value
      });
      const wrapperClass = (0, _classNames.default)(hashId.value, props.wrapperClass, `${pre}-wrapper`, {
        [`${pre}-wrapper-horizontal`]: anchorDirection.value === 'horizontal',
        [`${pre}-rtl`]: direction.value === 'rtl'
      });
      const anchorClass = (0, _classNames.default)(pre, {
        [`${pre}-fixed`]: !affix && !showInkInFixed
      });
      const wrapperStyle = (0, _extends2.default)({
        maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh'
      }, props.wrapperStyle);
      const anchorContent = (0, _vue.createVNode)("div", {
        "class": wrapperClass,
        "style": wrapperStyle,
        "ref": anchorRef
      }, [(0, _vue.createVNode)("div", {
        "class": anchorClass
      }, [(0, _vue.createVNode)("span", {
        "class": inkClass,
        "ref": spanLinkNode
      }, null), Array.isArray(props.items) ? createNestedLink(props.items) : (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
      return wrapSSR(!affix ? anchorContent : (0, _vue.createVNode)(_affix.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "offsetTop": offsetTop,
        "target": getContainer.value
      }), {
        default: () => [anchorContent]
      }));
    };
  }
});