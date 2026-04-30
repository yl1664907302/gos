import type { FullToken } from '../../theme/internal';
export interface FormToken extends FullToken<'Form'> {
    formItemCls: string;
    rootPrefixCls: string;
}
declare const _default: (_prefixCls?: import("vue").Ref<string, string>) => import("../../theme/internal").UseComponentStyleResult;
export default _default;
