import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
}
interface CheckboxToken extends FullToken<'Checkbox'> {
    checkboxCls: string;
    checkboxSize: number;
}
export declare const genCheckboxStyle: GenerateStyle<CheckboxToken>;
export declare function getStyle(prefixCls: string, token: FullToken<'Checkbox'>): import("../../_util/cssinjs").CSSInterpolation[];
declare const _default: (_prefixCls?: import("vue").Ref<string, string>) => import("../../theme/internal").UseComponentStyleResult;
export default _default;
