import { createVNode as _createVNode } from "vue";
import { computed, defineComponent, reactive } from 'vue';
import { flattenChildren } from '../_util/props-util';
import useConfigInject from '../config-provider/hooks/useConfigInject';
import { useToken } from '../theme/internal';
import devWarning from '../vc-util/devWarning';
import createContext from '../_util/createContext';
export const buttonGroupProps = () => ({
  prefixCls: String,
  size: {
    type: String
  }
});
export const GroupSizeContext = createContext();
export default defineComponent({
  compatConfig: {
    MODE: 3
  },
  name: 'AButtonGroup',
  props: buttonGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      prefixCls,
      direction
    } = useConfigInject('btn-group', props);
    const [,, hashId] = useToken();
    GroupSizeContext.useProvide(reactive({
      size: computed(() => props.size)
    }));
    const classes = computed(() => {
      const {
        size
      } = props;
      let sizeCls = '';
      switch (size) {
        case 'large':
          sizeCls = 'lg';
          break;
        case 'small':
          sizeCls = 'sm';
          break;
        case 'middle':
        case undefined:
          break;
        default:
          // eslint-disable-next-line no-console
          devWarning(!size, 'Button.Group', 'Invalid prop `size`.');
      }
      return {
        [`${prefixCls.value}`]: true,
        [`${prefixCls.value}-${sizeCls}`]: sizeCls,
        [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        [hashId.value]: true
      };
    });
    return () => {
      var _a;
      return _createVNode("div", {
        "class": classes.value
      }, [flattenChildren((_a = slots.default) === null || _a === void 0 ? void 0 : _a.call(slots))]);
    };
  }
});