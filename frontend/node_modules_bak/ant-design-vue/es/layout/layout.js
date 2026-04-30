import _extends from "@babel/runtime/helpers/esm/extends";
import { createVNode as _createVNode, resolveDirective as _resolveDirective } from "vue";
import { computed, createVNode, defineComponent, provide, ref } from 'vue';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { SiderHookProviderKey } from './injectionKey';
import useStyle from './style';
export const basicProps = () => ({
  prefixCls: String,
  hasSider: {
    type: Boolean,
    default: undefined
  },
  tagName: String
});
function generator(_ref) {
  let {
    suffixCls,
    tagName,
    name
  } = _ref;
  return BasicComponent => {
    const Adapter = defineComponent({
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
        } = useConfigInject(suffixCls, props);
        return () => {
          const basicComponentProps = _extends(_extends({}, props), {
            prefixCls: prefixCls.value,
            tagName
          });
          return _createVNode(BasicComponent, basicComponentProps, slots);
        };
      }
    });
    return Adapter;
  };
}
const Basic = defineComponent({
  compatConfig: {
    MODE: 3
  },
  props: basicProps(),
  setup(props, _ref3) {
    let {
      slots
    } = _ref3;
    return () => createVNode(props.tagName, {
      class: props.prefixCls
    }, slots);
  }
});
const BasicLayout = defineComponent({
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
    } = useConfigInject('', props);
    const [wrapSSR, hashId] = useStyle(prefixCls);
    const siders = ref([]);
    const siderHookProvider = {
      addSider: id => {
        siders.value = [...siders.value, id];
      },
      removeSider: id => {
        siders.value = siders.value.filter(currentId => currentId !== id);
      }
    };
    provide(SiderHookProviderKey, siderHookProvider);
    const divCls = computed(() => {
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
      return wrapSSR(createVNode(tagName, _extends(_extends({}, attrs), {
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
const Header = generator({
  suffixCls: 'layout-header',
  tagName: 'header',
  name: 'ALayoutHeader'
})(Basic);
const Footer = generator({
  suffixCls: 'layout-footer',
  tagName: 'footer',
  name: 'ALayoutFooter'
})(Basic);
const Content = generator({
  suffixCls: 'layout-content',
  tagName: 'main',
  name: 'ALayoutContent'
})(Basic);
export { Header, Footer, Content };
export default Layout;