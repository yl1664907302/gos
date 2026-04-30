"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.skeletonProps = exports.default = void 0;
var _vue = require("vue");
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _classNames = _interopRequireDefault(require("../_util/classNames"));
var _propsUtil = require("../_util/props-util");
var _Title = _interopRequireDefault(require("./Title"));
var _Paragraph = _interopRequireDefault(require("./Paragraph"));
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _Element = _interopRequireDefault(require("./Element"));
var _style = _interopRequireDefault(require("./style"));
const skeletonProps = () => ({
  active: {
    type: Boolean,
    default: undefined
  },
  loading: {
    type: Boolean,
    default: undefined
  },
  prefixCls: String,
  avatar: {
    type: [Boolean, Object],
    default: undefined
  },
  title: {
    type: [Boolean, Object],
    default: undefined
  },
  paragraph: {
    type: [Boolean, Object],
    default: undefined
  },
  round: {
    type: Boolean,
    default: undefined
  }
});
exports.skeletonProps = skeletonProps;
function getComponentProps(prop) {
  if (prop && typeof prop === 'object') {
    return prop;
  }
  return {};
}
function getAvatarBasicProps(hasTitle, hasParagraph) {
  if (hasTitle && !hasParagraph) {
    // Square avatar
    return {
      size: 'large',
      shape: 'square'
    };
  }
  return {
    size: 'large',
    shape: 'circle'
  };
}
function getTitleBasicProps(hasAvatar, hasParagraph) {
  if (!hasAvatar && hasParagraph) {
    return {
      width: '38%'
    };
  }
  if (hasAvatar && hasParagraph) {
    return {
      width: '50%'
    };
  }
  return {};
}
function getParagraphBasicProps(hasAvatar, hasTitle) {
  const basicProps = {};
  // Width
  if (!hasAvatar || !hasTitle) {
    basicProps.width = '61%';
  }
  // Rows
  if (!hasAvatar && hasTitle) {
    basicProps.rows = 3;
  } else {
    basicProps.rows = 2;
  }
  return basicProps;
}
const Skeleton = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeleton',
  props: (0, _propsUtil.initDefaultProps)(skeletonProps(), {
    avatar: false,
    title: true,
    paragraph: true
  }),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('skeleton', props);
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    return () => {
      var _a;
      const {
        loading,
        avatar,
        title,
        paragraph,
        active,
        round
      } = props;
      const pre = prefixCls.value;
      if (loading || props.loading === undefined) {
        const hasAvatar = !!avatar || avatar === '';
        const hasTitle = !!title || title === '';
        const hasParagraph = !!paragraph || paragraph === '';
        // Avatar
        let avatarNode;
        if (hasAvatar) {
          const avatarProps = (0, _extends2.default)((0, _extends2.default)({
            prefixCls: `${pre}-avatar`
          }, getAvatarBasicProps(hasTitle, hasParagraph)), getComponentProps(avatar));
          avatarNode = (0, _vue.createVNode)("div", {
            "class": `${pre}-header`
          }, [(0, _vue.createVNode)(_Element.default, avatarProps, null)]);
        }
        let contentNode;
        if (hasTitle || hasParagraph) {
          // Title
          let $title;
          if (hasTitle) {
            const titleProps = (0, _extends2.default)((0, _extends2.default)({
              prefixCls: `${pre}-title`
            }, getTitleBasicProps(hasAvatar, hasParagraph)), getComponentProps(title));
            $title = (0, _vue.createVNode)(_Title.default, titleProps, null);
          }
          // Paragraph
          let paragraphNode;
          if (hasParagraph) {
            const paragraphProps = (0, _extends2.default)((0, _extends2.default)({
              prefixCls: `${pre}-paragraph`
            }, getParagraphBasicProps(hasAvatar, hasTitle)), getComponentProps(paragraph));
            paragraphNode = (0, _vue.createVNode)(_Paragraph.default, paragraphProps, null);
          }
          contentNode = (0, _vue.createVNode)("div", {
            "class": `${pre}-content`
          }, [$title, paragraphNode]);
        }
        const cls = (0, _classNames.default)(pre, {
          [`${pre}-with-avatar`]: hasAvatar,
          [`${pre}-active`]: active,
          [`${pre}-rtl`]: direction.value === 'rtl',
          [`${pre}-round`]: round,
          [hashId.value]: true
        });
        return wrapSSR((0, _vue.createVNode)("div", {
          "class": cls
        }, [avatarNode, contentNode]));
      }
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
var _default = exports.default = Skeleton;