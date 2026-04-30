"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _vue = require("vue");
var _useState = _interopRequireDefault(require("../hooks/useState"));
var _type = require("../type");
var _util = require("./util");
var _raf = _interopRequireDefault(require("../raf"));
function validateNum(value) {
  return Number.isNaN(value) ? 0 : value;
}
const WaveEffect = (0, _vue.defineComponent)({
  props: {
    target: (0, _type.objectType)(),
    className: String
  },
  setup(props) {
    const divRef = (0, _vue.shallowRef)(null);
    const [color, setWaveColor] = (0, _useState.default)(null);
    const [borderRadius, setBorderRadius] = (0, _useState.default)([]);
    const [left, setLeft] = (0, _useState.default)(0);
    const [top, setTop] = (0, _useState.default)(0);
    const [width, setWidth] = (0, _useState.default)(0);
    const [height, setHeight] = (0, _useState.default)(0);
    const [enabled, setEnabled] = (0, _useState.default)(false);
    function syncPos() {
      const {
        target
      } = props;
      const nodeStyle = getComputedStyle(target);
      // Get wave color from target
      setWaveColor((0, _util.getTargetWaveColor)(target));
      const isStatic = nodeStyle.position === 'static';
      // Rect
      const {
        borderLeftWidth,
        borderTopWidth
      } = nodeStyle;
      setLeft(isStatic ? target.offsetLeft : validateNum(-parseFloat(borderLeftWidth)));
      setTop(isStatic ? target.offsetTop : validateNum(-parseFloat(borderTopWidth)));
      setWidth(target.offsetWidth);
      setHeight(target.offsetHeight);
      // Get border radius
      const {
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius
      } = nodeStyle;
      setBorderRadius([borderTopLeftRadius, borderTopRightRadius, borderBottomRightRadius, borderBottomLeftRadius].map(radius => validateNum(parseFloat(radius))));
    }
    // Add resize observer to follow size
    let resizeObserver;
    let rafId;
    let timeoutId;
    const clear = () => {
      clearTimeout(timeoutId);
      _raf.default.cancel(rafId);
      resizeObserver === null || resizeObserver === void 0 ? void 0 : resizeObserver.disconnect();
    };
    const removeDom = () => {
      var _a;
      const holder = (_a = divRef.value) === null || _a === void 0 ? void 0 : _a.parentElement;
      if (holder) {
        (0, _vue.render)(null, holder);
        if (holder.parentElement) {
          holder.parentElement.removeChild(holder);
        }
      }
    };
    (0, _vue.onMounted)(() => {
      clear();
      timeoutId = setTimeout(() => {
        removeDom();
      }, 5000);
      const {
        target
      } = props;
      if (target) {
        // We need delay to check position here
        // since UI may change after click
        rafId = (0, _raf.default)(() => {
          syncPos();
          setEnabled(true);
        });
        if (typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(syncPos);
          resizeObserver.observe(target);
        }
      }
    });
    (0, _vue.onBeforeUnmount)(() => {
      clear();
    });
    const onTransitionend = e => {
      if (e.propertyName === 'opacity') {
        removeDom();
      }
    };
    return () => {
      if (!enabled.value) {
        return null;
      }
      const waveStyle = {
        left: `${left.value}px`,
        top: `${top.value}px`,
        width: `${width.value}px`,
        height: `${height.value}px`,
        borderRadius: borderRadius.value.map(radius => `${radius}px`).join(' ')
      };
      if (color) {
        waveStyle['--wave-color'] = color.value;
      }
      return (0, _vue.createVNode)(_vue.Transition, {
        "appear": true,
        "name": "wave-motion",
        "appearFromClass": "wave-motion-appear",
        "appearActiveClass": "wave-motion-appear",
        "appearToClass": "wave-motion-appear wave-motion-appear-active"
      }, {
        default: () => [(0, _vue.createVNode)("div", {
          "ref": divRef,
          "class": props.className,
          "style": waveStyle,
          "onTransitionend": onTransitionend
        }, null)]
      });
    };
  }
});
function showWaveEffect(node, className) {
  // Create holder
  const holder = document.createElement('div');
  holder.style.position = 'absolute';
  holder.style.left = `0px`;
  holder.style.top = `0px`;
  node === null || node === void 0 ? void 0 : node.insertBefore(holder, node === null || node === void 0 ? void 0 : node.firstChild);
  (0, _vue.render)((0, _vue.createVNode)(WaveEffect, {
    "target": node,
    "className": className
  }, null), holder);
  return () => {
    (0, _vue.render)(null, holder);
    if (holder.parentElement) {
      holder.parentElement.removeChild(holder);
    }
  };
}
var _default = exports.default = showWaveEffect;