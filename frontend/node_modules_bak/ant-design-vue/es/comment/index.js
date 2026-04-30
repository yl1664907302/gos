import _objectSpread from "@babel/runtime/helpers/esm/objectSpread2";
import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import PropTypes from '../_util/vue-types';
import { flattenChildren } from '../_util/props-util';
import { withInstall } from '../_util/type';
import useConfigInject from '../config-provider/hooks/useConfigInject';
// CSSINJS
import useStyle from './style';
export const commentProps = () => ({
  actions: Array,
  /** The element to display as the comment author. */
  author: PropTypes.any,
  /** The element to display as the comment avatar - generally an antd Avatar */
  avatar: PropTypes.any,
  /** The main content of the comment */
  content: PropTypes.any,
  /** Comment prefix defaults to '.ant-comment' */
  prefixCls: String,
  /** A datetime element containing the time to be displayed */
  datetime: PropTypes.any
});
const Comment = defineComponent({
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
    } = useConfigInject('comment', props);
    // style
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const renderNested = (prefixCls, children) => {
      return _createVNode("div", {
        "class": `${prefixCls}-nested`
      }, [children]);
    };
    const getAction = actions => {
      if (!actions || !actions.length) {
        return null;
      }
      const actionList = actions.map((action, index) => _createVNode("li", {
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
      const avatarDom = _createVNode("div", {
        "class": `${pre}-avatar`
      }, [typeof avatar === 'string' ? _createVNode("img", {
        "src": avatar,
        "alt": "comment-avatar"
      }, null) : avatar]);
      const actionDom = actions ? _createVNode("ul", {
        "class": `${pre}-actions`
      }, [getAction(Array.isArray(actions) ? actions : [actions])]) : null;
      const authorContent = _createVNode("div", {
        "class": `${pre}-content-author`
      }, [author && _createVNode("span", {
        "class": `${pre}-content-author-name`
      }, [author]), datetime && _createVNode("span", {
        "class": `${pre}-content-author-time`
      }, [datetime])]);
      const contentDom = _createVNode("div", {
        "class": `${pre}-content`
      }, [authorContent, _createVNode("div", {
        "class": `${pre}-content-detail`
      }, [content]), actionDom]);
      const comment = _createVNode("div", {
        "class": `${pre}-inner`
      }, [avatarDom, contentDom]);
      const children = flattenChildren((_l = slots.default) === null || _l === void 0 ? void 0 : _l.call(slots));
      return wrapSSR(_createVNode("div", _objectSpread(_objectSpread({}, attrs), {}, {
        "class": [pre, {
          [`${pre}-rtl`]: direction.value === 'rtl'
        }, attrs.class, hashId.value]
      }), [comment, children && children.length ? renderNested(pre, children) : null]));
    };
  }
});
export default withInstall(Comment);