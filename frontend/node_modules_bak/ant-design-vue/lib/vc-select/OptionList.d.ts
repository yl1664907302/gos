import type { ScrollConfig } from '../vc-virtual-list/List';
export interface RefOptionListProps {
    onKeydown: (e?: KeyboardEvent) => void;
    onKeyup: (e?: KeyboardEvent) => void;
    scrollTo?: (index: number | ScrollConfig) => void;
}
export type OptionListProps = Record<string, never>;
/**
 * Using virtual list of option display.
 * Will fallback to dom if use customize render.
 */
declare const OptionList: import("vue").DefineComponent<{}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default OptionList;
