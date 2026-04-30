import type { UseComponentStyleResult } from '../../theme/internal';
import { Ref } from 'vue';
export interface ComponentToken {
    zIndexPopup: number;
    colorBgDefault: string;
}
declare const _default: (prefixCls: Ref<string>, injectStyle: Ref<boolean>) => UseComponentStyleResult;
export default _default;
