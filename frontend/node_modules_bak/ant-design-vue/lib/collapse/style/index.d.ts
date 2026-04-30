import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
}
type CollapseToken = FullToken<'Collapse'> & {
    collapseContentBg: string;
    collapseHeaderBg: string;
    collapseHeaderPadding: string;
    collapsePanelBorderRadius: number;
    collapseContentPaddingHorizontal: number;
};
export declare const genBaseStyle: GenerateStyle<CollapseToken>;
declare const _default: (_prefixCls?: import("vue").Ref<string, string>) => import("../../theme/internal").UseComponentStyleResult;
export default _default;
