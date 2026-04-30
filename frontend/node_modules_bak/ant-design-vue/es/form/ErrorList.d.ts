import type { VueNode } from '../_util/type';
export interface ErrorListProps {
    errors?: VueNode[];
    /** @private Internal Usage. Do not use in your production */
    help?: VueNode;
    onErrorVisibleChanged?: (visible: boolean) => void;
}
declare const _default: import("vue").DefineComponent<{
    help?: any;
    errors?: any;
    onErrorVisibleChanged?: any;
    helpStatus?: any;
    warnings?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    help?: any;
    errors?: any;
    onErrorVisibleChanged?: any;
    helpStatus?: any;
    warnings?: any;
}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
