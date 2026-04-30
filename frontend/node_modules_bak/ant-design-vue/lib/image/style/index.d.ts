import { CSSObject } from '../../_util/cssinjs';
import type { FullToken, GenerateStyle } from '../../theme/internal';
export interface ComponentToken {
    zIndexPopup: number;
    previewOperationSize: number;
    previewOperationColor: string;
    previewOperationColorDisabled: string;
}
export interface ImageToken extends FullToken<'Image'> {
    previewCls: string;
    modalMaskBg: string;
    imagePreviewSwitchSize: number;
}
export type PositionType = 'static' | 'relative' | 'fixed' | 'absolute' | 'sticky' | undefined;
export declare const genBoxStyle: (position?: PositionType) => CSSObject;
export declare const genImageMaskStyle: (token: ImageToken) => CSSObject;
export declare const genPreviewOperationsStyle: (token: ImageToken) => CSSObject;
export declare const genPreviewSwitchStyle: (token: ImageToken) => CSSObject;
export declare const genImagePreviewStyle: GenerateStyle<ImageToken>;
declare const _default: (_prefixCls?: import("vue").Ref<string, string>) => import("../../theme/internal").UseComponentStyleResult;
export default _default;
