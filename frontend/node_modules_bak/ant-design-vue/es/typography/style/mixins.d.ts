import type { CSSObject } from '../../_util/cssinjs';
import type { TypographyToken } from '.';
import type { GenerateStyle } from '../../theme/internal';
export declare const getTitleStyles: GenerateStyle<TypographyToken, CSSObject>;
export declare const getLinkStyles: GenerateStyle<TypographyToken, CSSObject>;
export declare const getResetStyles: () => CSSObject;
export declare const getEditableStyles: GenerateStyle<TypographyToken, CSSObject>;
export declare const getCopiableStyles: GenerateStyle<TypographyToken, CSSObject>;
export declare const getEllipsisStyles: () => CSSObject;
