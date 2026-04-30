import type { CSSProperties } from 'vue';
import type { MapToken } from './maps';
export interface AliasToken extends MapToken {
    colorFillContentHover: string;
    colorFillAlter: string;
    colorFillContent: string;
    colorBgContainerDisabled: string;
    colorBgTextHover: string;
    colorBgTextActive: string;
    colorBorderBg: string;
    /**
     * @nameZH 分割线颜色
     * @desc 用于作为分割线的颜色，此颜色和 colorBorderSecondary 的颜色一致，但是用的是透明色。
     */
    colorSplit: string;
    colorTextPlaceholder: string;
    colorTextDisabled: string;
    colorTextHeading: string;
    colorTextLabel: string;
    colorTextDescription: string;
    colorTextLightSolid: string;
    /** Weak action. Such as `allowClear` or Alert close button */
    colorIcon: string;
    /** Weak action hover color. Such as `allowClear` or Alert close button */
    colorIconHover: string;
    colorLink: string;
    colorLinkHover: string;
    colorLinkActive: string;
    colorHighlight: string;
    controlOutline: string;
    colorWarningOutline: string;
    colorErrorOutline: string;
    /** Operation icon in Select, Cascader, etc. icon fontSize. Normal is same as fontSizeSM */
    fontSizeIcon: number;
    /** For heading like h1, h2, h3 or option selected item */
    fontWeightStrong: number;
    controlOutlineWidth: number;
    controlItemBgHover: string;
    controlItemBgActive: string;
    controlItemBgActiveHover: string;
    controlInteractiveSize: number;
    controlItemBgActiveDisabled: string;
    paddingXXS: number;
    paddingXS: number;
    paddingSM: number;
    padding: number;
    paddingMD: number;
    paddingLG: number;
    paddingXL: number;
    paddingContentHorizontalLG: number;
    paddingContentHorizontal: number;
    paddingContentHorizontalSM: number;
    paddingContentVerticalLG: number;
    paddingContentVertical: number;
    paddingContentVerticalSM: number;
    marginXXS: number;
    marginXS: number;
    marginSM: number;
    margin: number;
    marginMD: number;
    marginLG: number;
    marginXL: number;
    marginXXL: number;
    opacityLoading: number;
    boxShadow: string;
    boxShadowSecondary: string;
    boxShadowTertiary: string;
    linkDecoration: CSSProperties['textDecoration'];
    linkHoverDecoration: CSSProperties['textDecoration'];
    linkFocusDecoration: CSSProperties['textDecoration'];
    controlPaddingHorizontal: number;
    controlPaddingHorizontalSM: number;
    screenXS: number;
    screenXSMin: number;
    screenXSMax: number;
    screenSM: number;
    screenSMMin: number;
    screenSMMax: number;
    screenMD: number;
    screenMDMin: number;
    screenMDMax: number;
    screenLG: number;
    screenLGMin: number;
    screenLGMax: number;
    screenXL: number;
    screenXLMin: number;
    screenXLMax: number;
    screenXXL: number;
    screenXXLMin: number;
    screenXXLMax: number;
    screenXXXL: number;
    screenXXXLMin: number;
    /** Used for DefaultButton, Switch which has default outline */
    controlTmpOutline: string;
}
