import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { defineComponent, nextTick, onBeforeUnmount, onMounted, onUpdated, reactive, ref, computed } from 'vue';
import scrollIntoView from 'scroll-into-view-if-needed';
import classNames from '../_util/classNames';
import addEventListener from '../vc-util/Dom/addEventListener';
import Affix from '../affix';
import scrollTo from '../_util/scrollTo';
import getScroll from '../_util/getScroll';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import useProvideAnchor from './context';
import useStyle from './style';
import AnchorLink from './AnchorLink';
import PropTypes from '../_util/vue-types';
import devWarning from '../vc-util/devWarning';
import { arrayType } from '../_util/type';
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
export const anchorProps = () => ({
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
  items: arrayType(),
  direction: PropTypes.oneOf(['vertical', 'horizontal']).def('vertical'),
  onChange: Function,
  onClick: Function
});
export default defineComponent({
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
    } = useConfigInject('anchor', props);
    const anchorDirection = computed(() => {
      var _a;
      return (_a = props.direction) !== null && _a !== void 0 ? _a : 'vertical';
    });
    if (process.env.NODE_ENV !== 'production') {
      devWarning(props.items && typeof slots.default !== 'function', 'Anchor', '`Anchor children` is deprecated. Please use `items` instead.');
    }
    if (process.env.NODE_ENV !== 'production') {
      devWarning(!(anchorDirection.value === 'horizontal' && ((_a = props.items) === null || _a === void 0 ? void 0 : _a.some(n => 'children' in n))), 'Anchor', '`Anchor items#children` is not supported when `Anchor` direction is horizontal.');
    }
    const spanLinkNode = ref(null);
    const anchorRef = ref();
    const state = reactive({
      links: [],
      scrollContainer: null,
      scrollEvent: null,
      animating: false
    });
    const activeLink = ref(null);
    const getContainer = computed(() => {
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
      const scrollTop = getScroll(container, true);
      const eleOffsetTop = getOffsetTop(targetElement, container);
      let y = scrollTop + eleOffsetTop;
      y -= targetOffset !== undefined ? targetOffset : offsetTop || 0;
      state.animating = true;
      scrollTo(y, {
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
          scrollIntoView(linkNode, {
            scrollMode: 'if-needed',
            block: 'nearest'
          });
        }
      }
    };
    useProvideAnchor({
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
    onMounted(() => {
      nextTick(() => {
        const container = getContainer.value();
        state.scrollContainer = container;
        state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
        handleScroll();
      });
    });
    onBeforeUnmount(() => {
      if (state.scrollEvent) {
        state.scrollEvent.remove();
      }
    });
    onUpdated(() => {
      if (state.scrollEvent) {
        const currentContainer = getContainer.value();
        if (state.scrollContainer !== currentContainer) {
          state.scrollContainer = currentContainer;
          state.scrollEvent.remove();
          state.scrollEvent = addEventListener(state.scrollContainer, 'scroll', handleScroll);
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
      return _createVNode(AnchorLink, {
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
    const [wrapSSR, hashId] = useStyle(prefixCls);
    return () => {
      var _a;
      const {
        offsetTop,
        affix,
        showInkInFixed
      } = props;
      const pre = prefixCls.value;
      const inkClass = classNames(`${pre}-ink`, {
        [`${pre}-ink-visible`]: activeLink.value
      });
      const wrapperClass = classNames(hashId.value, props.wrapperClass, `${pre}-wrapper`, {
        [`${pre}-wrapper-horizontal`]: anchorDirection.value === 'horizontal',
        [`${pre}-rtl`]: direction.value === 'rtl'
      });
      const anchorClass = classNames(pre, {
        [`${pre}-fixed`]: !affix && !showInkInFixed
      });
      const wrapperStyle = _extends({
        maxHeight: offsetTop ? `calc(100vh - ${offsetTop}px)` : '100vh'
      }, props.wrapperStyle);
      const anchorContent = _createVNode("div", {
        "class": wrapperClass,
        "style": wrapperStyle,
        "ref": anchorRef
      }, [_createVNode("div", {
        "class": anchorClass
      }, [_createVNode("span", {
        "class": inkClass,
        "ref": spanLinkNode
      }, null), Array.isArray(props.items) ? createNestedLink(props.items) : (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots)])]);
      return wrapSSR(!affix ? anchorContent : _createVNode(Affix, _objectSpread(_objectSpread({}, attrs), {}, {
        "offsetTop": offsetTop,
        "target": getContainer.value
      }), {
        default: () => [anchorContent]
      }));
    };
  }
});