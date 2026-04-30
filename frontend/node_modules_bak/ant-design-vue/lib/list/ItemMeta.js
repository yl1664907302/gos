"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.listItemMetaProps = exports.default = void 0;
var _vue = require("vue");
var _useConfigInject = _interopRequireDefault(require("../config-provider/hooks/useConfigInject"));
var _vueTypes = _interopRequireDefault(require("../_util/vue-types"));
const listItemMetaProps = () => ({
  avatar: _vueTypes.default.any,
  description: _vueTypes.default.any,
  prefixCls: String,
  title: _vueTypes.default.any
});
exports.listItemMetaProps = listItemMetaProps;
var _default = exports.default = (0, _vue.defineComponent)({
  compatConfig: {
    MODE: 3
  },
  name: 'AListItemMeta',
  props: listItemMetaProps(),
  displayName: 'AListItemMeta',
  __ANT_LIST_ITEM_META: true,
  slots: Object,
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls
    } = (0, _useConfigInject.default)('list', props);
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const classString = `${prefixCls.value}-item-meta`;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const description = (_c = props.description) !== null && _c !== void 0 ? _c : (_d = slots.description) === null || _d === void 0 ? void 0 : _d.call(slots);
      const avatar = (_e = props.avatar) !== null && _e !== void 0 ? _e : (_f = slots.avatar) === null || _f === void 0 ? void 0 : _f.call(slots);
      const content = (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-meta-content`
      }, [title && (0, _vue.createVNode)("h4", {
        "class": `${prefixCls.value}-item-meta-title`
      }, [title]), description && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-meta-description`
      }, [description])]);
      return (0, _vue.createVNode)("div", {
        "class": classString
      }, [avatar && (0, _vue.createVNode)("div", {
        "class": `${prefixCls.value}-item-meta-avatar`
      }, [avatar]), (title || description) && content]);
    };
  }
});