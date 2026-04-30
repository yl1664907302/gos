import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode } from "vue";
import { defineComponent } from 'vue';
import classNames from '../_util/classNames';
import { initDefaultProps } from '../_util/props-util';
import Title from './Title';
import Paragraph from './Paragraph';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import Element from './Element';
import useStyle from './style';
export const skeletonProps = () => ({
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
const Skeleton = defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'ASkeleton',
  props: initDefaultProps(skeletonProps(), {
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
    } = useConfigInject('skeleton', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
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
          const avatarProps = _extends(_extends({
            prefixCls: `${pre}-avatar`
          }, getAvatarBasicProps(hasTitle, hasParagraph)), getComponentProps(avatar));
          avatarNode = _createVNode("div", {
            "class": `${pre}-header`
          }, [_createVNode(Element, avatarProps, null)]);
        }
        let contentNode;
        if (hasTitle || hasParagraph) {
          // Title
          let $title;
          if (hasTitle) {
            const titleProps = _extends(_extends({
              prefixCls: `${pre}-title`
            }, getTitleBasicProps(hasAvatar, hasParagraph)), getComponentProps(title));
            $title = _createVNode(Title, titleProps, null);
          }
          // Paragraph
          let paragraphNode;
          if (hasParagraph) {
            const paragraphProps = _extends(_extends({
              prefixCls: `${pre}-paragraph`
            }, getParagraphBasicProps(hasAvatar, hasTitle)), getComponentProps(paragraph));
            paragraphNode = _createVNode(Paragraph, paragraphProps, null);
          }
          contentNode = _createVNode("div", {
            "class": `${pre}-content`
          }, [$title, paragraphNode]);
        }
        const cls = classNames(pre, {
          [`${pre}-with-avatar`]: hasAvatar,
          [`${pre}-active`]: active,
          [`${pre}-rtl`]: direction.value === 'rtl',
          [`${pre}-round`]: round,
          [hashId.value]: true
        });
        return wrapSSR(_createVNode("div", {
          "class": cls
        }, [avatarNode, contentNode]));
      }
      return (_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots);
    };
  }
});
export default Skeleton;