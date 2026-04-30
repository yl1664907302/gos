"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.commentProps = void 0;
var _vue = require("vue");
var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread2"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
var _propsUtil = require("../_util/props-util");
var _type = require("../_util/type");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _style = _interopRequireDefault(require("./style"));
// CSSINJS

const commentProps = () => ({
  actions: Array,
  /** The element to display as the comment author. */
  author: _vueTypes.default.any,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: _vueTypes.default.any,
  /** The main content of the comment */
  content: _vueTypes.default.any,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: String,
  /** A datetime element containing the time to be displayed */
  datetime: _vueTypes.default.any
});
exports.commentProps = commentProps;
const Comment = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AComment',
  inheritAttrs: false,
  props: commentProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots,
      attrs
    } = _ref;
    const {
      prefixCls,
      direction
    } = (0, _useConfigInject.default)('comment', props);
    // style
    const [wrapSSR, hashId] = (0, _style.default)(prefixCls);
    const renderNested = (prefixCls, children) => {
      return (0, _vue.createVNode)("div", {
        "class": `${prefixCls}-nested`
      }, [children]);
    };
    const getAction = actions => {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => (0, _vue.createVNode)("li", {
        "key": `action-${index}`
      }, [action]));
      return actionList;
    };
    return () => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
      const pre = prefixCls.value;
      const actions = (_a = props.actions) !== null && _a !== void 0 ? _a : (_b = slots.actions) === null || _b === void 0 ? void 0 : _b.call(slots);
      const author = (_c = props.author) !== null && _c !== void 0 ? _c : (_d = slots.author) === null || _d === void 0 ? void 0 : _d.call(slots);
      const avatar = (_e = props.avatar) !== null && _e !== void 0 ? _e : (_f = slots.avatar) === null || _f === void 0 ? void 0 : _f.call(slots);
      const content = (_g = props.content) !== null && _g !== void 0 ? _g : (_h = slots.content) === null || _h === void 0 ? void 0 : _h.call(slots);
      const datetime = (_j = props.datetime) !== null && _j !== void 0 ? _j : (_k = slots.datetime) === null || _k === void 0 ? void 0 : _k.call(slots);
      const avatarDom = (0, _vue.createVNode)("div", {
        "class": `${pre}-avatar`
      }, [typeof avatar === 'string' ? (0, _vue.createVNode)("img", {
        "src": avatar,
        "alt": "comment-avatar"
      }, null) : avatar]);
      const actionDom = actions ? (0, _vue.createVNode)("ul", {
        "class": `${pre}-actions`
      }, [getAction(Array.isArray(actions) ? actions : [actions])]) : null;
      const authorContent = (0, _vue.createVNode)("div", {
        "class": `${pre}-content-author`
      }, [author && (0, _vue.createVNode)("span", {
        "class": `${pre}-content-author-name`
      }, [author]), datetime && (0, _vue.createVNode)("span", {
        "class": `${pre}-content-author-time`
      }, [datetime])]);
      const contentDom = (0, _vue.createVNode)("div", {
        "class": `${pre}-content`
      }, [authorContent, (0, _vue.createVNode)("div", {
        "class": `${pre}-content-detail`
      }, [content]), actionDom]);
      const comment = (0, _vue.createVNode)("div", {
        "class": `${pre}-inner`
      }, [avatarDom, contentDom]);
      const children = (0, _propsUtil.flattenChildren)((_l = slots.default) === null || _l === void 0 ? void 0 : _l.call(slots));
      return wrapSSR((0, _vue.createVNode)("div", (0, _objectSpread2.default)((0, _objectSpread2.default)({}, attrs), {}, {
        "class": [pre, {
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [comment, children && children.length ? renderNested(pre, children) : null]));
    };
  }
});
var _default = exports.default = (0, _type.withInstall)(Comment);