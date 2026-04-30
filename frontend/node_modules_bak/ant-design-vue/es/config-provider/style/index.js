import _extends from "@babel/runtime/helpers/esm/extends";
import { useStyleRegister } from '../../_util/cssinjs';
import { resetIcon } from '../../style';
import { useToken } from '../../theme/internal';
import { computed } from 'vue';
const useStyle = iconPrefixCls => {
  const [theme, token] = useToken();
  // Generate style for icons
  return useStyleRegister(computed(() => ({
    theme: theme.value,
    token: token.value,
    hashId: '',
    path: ['ant-design-icons', iconPrefixCls.value]
  })), () => [{
    [`.${iconPrefixCls.value}`]: _extends(_extends({}, resetIcon()), {
      [`.${iconPrefixCls.value} .${iconPrefixCls.value}-icon`]: {
        display: 'block'
      }
    })
  }]);
};
export default useStyle;