"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.basicProps = exports.Header = exports.Footer = exports.Content = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _injectionKey = require("./injectionKey");
var _style = _interopRequireDefault(require("./style"));
const basicProps = () => ({
  prefixCls: String,
  hasSider: {
    type: Boolean,
    default: undefined
  },
  tagName: String
});
exports.basicProps = basicProps;
function generator(_ref) {
  let {
    suffixCls,
    tagName,
    name
  } = _ref;
  return BasicComponent => {
    const Adapter = (0, _vue.defineComponent)({
      compatConfig: {
        MODE: 3
      },
      name,
      props: basicProps(),
      setup(props, _ref2) {
        let {
          slots
        } = _ref2;
        const {
          prefixCls
        } = (0, _useConfigInject.default)(suffixCls, props);
        return () => {
          const basicComponentProps = (0, _extends2.default)((0, _extends2.default)({}, props), {
            prefixCls: prefixCls.value,
            tagName
          });
          return (0, _vue.createVNode)(BasicComponent, basicComponentProps, slots);
        };
      }
    });
    return Adapter;
  };
}
const Basic = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  props: basicProps(),
  setup(props, _ref3) {
    let {
      slots
    } = _ref3;
    return () => (0, _vue.createVNode)(props.tagName, {
      class: props.prefixCls
    }, slots);
  }
});
const BasicLayout = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  inheritAttrs: false,
  props: basicProps(),
  setup(props, _ref4) {
    let {
      slots,
      attrs
    } = _ref4;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const siders = (0, _vue.ref)([]);
    const siderHookProvider = {
      addSider: id => {
        siders.value = [...siders.value, id];
      },
      removeSider: id => {
        siders.value = siders.value.filter(currentId => currentId !== id);
      }
    };
    (0, _vue.provide)(_injectionKey.SiderHookProviderKey, siderHookProvider);
    const divCls = (0, _vue.computed)(() => {
      const {
        prefixCls,
        hasSider
      } = props;
      return {
        [hashId.value]: true,
        [`${prefixCls}`]: true,
        [`${prefixCls}-has-sider`]: typeof hasSider === 'boolean' ? hasSider : siders.value.length > 0,
        [`${prefixCls}-rtl`]: direction.value === 'rtl'
      };
    });
    return () => {
      const {
        tagName
      } = props;
      return wrapSSR((0, _vue.createVNode)(tagName, (0, _extends2.default)((0, _extends2.default)({}, attrs), {
        class: [divCls.value, attrs.class]
      }), slots));
    };
  }
});
const Layout = generator({
  suffixCls: 'layout',
  tagName: 'section',
  name: 'ALayout'
})(BasicLayout);
const Header = exports.Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  name: 'ALayoutHeader'
})(Basic);
const Footer = exports.Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  name: 'ALayoutFooter'
})(Basic);
const Content = exports.Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  name: 'ALayoutContent'
})(Basic);
var _default = exports.default = Layout;