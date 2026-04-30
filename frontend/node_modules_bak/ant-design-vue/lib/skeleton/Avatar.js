"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.avatarProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _initDefaultProps = _interopRequireDefault(require("../_util/props-util/initDefaultProps"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _Element = _interopRequireWildcard(require("./Element"));
var _style = _interopRequireDefault(require("./style"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const avatarProps = () => {
  return (0, _extends2.default)((0, _extends2.default)({}, (0, _Element.skeletonElementProps)()), {
    shape: String
  });
};
exports.avatarProps = avatarProps;
const SkeletonAvatar = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeletonAvatar',
  props: (0, _initDefaultProps.default)(avatarProps(), {
    size: 'default',
    shape: 'circle'
  }),
  setup(props) {
    const {
      prefixCls
    } = (0, _useConfigInject.default)('skeleton', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const cls = (0, _vue.computed)(() => (0, _classNames.default)(prefixCls.value, `${prefixCls.value}-element`, {
      [`${prefixCls.value}-active`]: props.active
    }, hashId.value));
    return () => {
      return wrapSSR((0, _vue.createVNode)("div", {
        "class": cls.value
      }, [(0, _vue.createVNode)(_Element.default, (0, _objectSpread2.default)((0, _objectSpread2.default)({}, props), {}, {
        "prefixCls": `${prefixCls.value}-avatar`
      }), null)]));
    };
  }
});
var _default = exports.default = SkeletonAvatar;