import type { HeaderProps } from '../Header/Header';
export interface FixedHeaderProps<RecordType> extends HeaderProps<RecordType> {
    noData: boolean;
    maxContentScroll: boolean;
    colWidths: readonly number[];
    columCount: number;
    direction: 'ltr' | 'rtl';
    fixHeader: boolean;
    stickyTopOffset?: number;
    stickyBottomOffset?: number;
    stickyClassName?: string;
    onScroll: (info: {
        currentTarget: HTMLDivElement;
        scrollLeft?: number;
    }) => void;
}
declare const _default: import("vue").DefineComponent<FixedHeaderProps<any>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<FixedHeaderProps<any>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
export default _default;
