import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import { getPropsSlot } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { vNodeType } from '../_util/type';
export const cardMetaProps = () => ({
  prefixCls: String,
  title: vNodeType(),
  description: vNodeType(),
  avatar: vNodeType()
});
export default defineComponent({
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
    } = useConfigInject('card', props);
    return () => {
      const classString = {
        [`${prefixCls.value}-meta`]: true
      };
      const avatar = getPropsSlot(slots, props, 'avatar');
      const title = getPropsSlot(slots, props, 'title');
      const description = getPropsSlot(slots, props, 'description');
      const avatarDom = avatar ? _createVNode("div", {
        "class": `${prefixCls.value}-meta-avatar`
      }, [avatar]) : null;
      const titleDom = title ? _createVNode("div", {
        "class": `${prefixCls.value}-meta-title`
      }, [title]) : null;
      const descriptionDom = description ? _createVNode("div", {
        "class": `${prefixCls.value}-meta-description`
      }, [description]) : null;
      const MetaDetail = titleDom || descriptionDom ? _createVNode("div", {
        "class": `${prefixCls.value}-meta-detail`
      }, [titleDom, descriptionDom]) : null;
      return _createVNode("div", {
        "class": classString
      }, [avatarDom, MetaDetail]);
    };
  }
});