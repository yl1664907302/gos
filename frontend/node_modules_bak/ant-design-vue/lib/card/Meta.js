"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.cardMetaProps = void 0;
var _vue = require("vue");
var _propsUtil = require("../_util/props-util");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _type = require("../_util/type");
const cardMetaProps = () => ({
  prefixCls: String,
  title: (0, _type.vNodeType)(),
  description: (0, _type.vNodeType)(),
  avatar: (0, _type.vNodeType)()
});
exports.cardMetaProps = cardMetaProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'ACardMeta',
  props: cardMetaProps(),
  slots: Object,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('card', props);
    return () => {
      const classString = {
        [`${prefixCls.value}-meta`]: true
      };
      const avatar = (0, _propsUtil.getPropsSlot)(slots, props, 'avatar');
      const title = (0, _propsUtil.getPropsSlot)(slots, props, 'title');
      const description = (0, _propsUtil.getPropsSlot)(slots, props, 'description');
      const avatarDom = avatar ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-meta-avatar`
      }, [avatar]) : null;
      const titleDom = title ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-meta-title`
      }, [title]) : null;
      const descriptionDom = description ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-meta-description`
      }, [description]) : null;
      const MetaDetail = titleDom || descriptionDom ? (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-meta-detail`
      }, [titleDom, descriptionDom]) : null;
      return (0, _vue.createVNode)("div", {
        "class": classString
      }, [avatarDom, MetaDetail]);
    };
  }
});