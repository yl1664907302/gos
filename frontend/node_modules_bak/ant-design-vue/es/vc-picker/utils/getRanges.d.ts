import type { Components, Locale } from '../interface';
export type RangesProps = {
    prefixCls: string;
    components?: Components;
    needConfirmButton: boolean;
    onNow?: null | (() => void) | false;
    onOk?: null | (() => void) | false;
    okDisabled?: boolean;
    showNow?: boolean;
    locale: Locale;
};
export default function getRanges({ prefixCls, components, needConfirmButton, onNow, onOk, okDisabled, showNow, locale, }: RangesProps): import("vue/jsx-runtime").JSX.Element;
