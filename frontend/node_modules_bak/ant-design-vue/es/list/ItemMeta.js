import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import PropTypes from '../_util/vue-types';
export const listItemMetaProps = () => ({
  avatar: PropTypes.any,
  description: PropTypes.any,
  prefixCls: String,
  title: PropTypes.any
});
export default defineComponent({
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
    } = useConfigInject('list', props);
    return () => {
      var _a, _b, _c, _d, _e, _f;
      const classString = `${prefixCls.value}-item-meta`;
      const title = (_a = props.title) !== null && _a !== void 0 ? _a : (_b = slots.title) === null || _b === void 0 ? void 0 : _b.call(slots);
      const description = (_c = props.description) !== null && _c !== void 0 ? _c : (_d = slots.description) === null || _d === void 0 ? void 0 : _d.call(slots);
      const avatar = (_e = props.avatar) !== null && _e !== void 0 ? _e : (_f = slots.avatar) === null || _f === void 0 ? void 0 : _f.call(slots);
      const content = _createVNode("div", {
        "class": `${prefixCls.value}-item-meta-content`
      }, [title && _createVNode("h4", {
        "class": `${prefixCls.value}-item-meta-title`
      }, [title]), description && _createVNode("div", {
        "class": `${prefixCls.value}-item-meta-description`
      }, [description])]);
      return _createVNode("div", {
        "class": classString
      }, [avatar && _createVNode("div", {
        "class": `${prefixCls.value}-item-meta-avatar`
      }, [avatar]), (title || description) && content]);
    };
  }
});