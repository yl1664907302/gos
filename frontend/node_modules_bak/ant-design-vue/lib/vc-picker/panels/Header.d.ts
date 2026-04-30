import type { VueNode } from '../../_util/type';
export type HeaderProps = {
    prefixCls: string;
    prevIcon?: VueNode;
    nextIcon?: VueNode;
    superPrevIcon?: VueNode;
    superNextIcon?: VueNode;
    /** Last one step */
    onPrev?: () => void;
    /** Next one step */
    onNext?: () => void;
    /** Last multiple steps */
    onSuperPrev?: () => void;
    /** Next multiple steps */
    onSuperNext?: () => void;
    children?: VueNode;
};
declare function Header(_props: HeaderProps, { slots }: {
    slots: any;
}): import("vue/jsx-runtime").JSX.Element;
declare namespace Header {
    var displayName: string;
    var inheritAttrs: boolean;
}
export default Header;
