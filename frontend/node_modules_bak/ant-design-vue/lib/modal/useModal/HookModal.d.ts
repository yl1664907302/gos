import type { ModalFuncProps } from '../Modal';
export interface HookModalProps {
    afterClose: () => void;
    config: ModalFuncProps;
    destroyAction: (...args: any[]) => void;
    open: boolean;
}
export interface HookModalRef {
    destroy: () => void;
    update: (config: ModalFuncProps) => void;
}
declare const _default: import("vue").DefineComponent<{
    afterClose: () => void;
    config: ModalFuncProps;
    destroyAction: (...args: any[]) => void;
    open: boolean;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    afterClose: () => void;
    config: ModalFuncProps;
    destroyAction: (...args: any[]) => void;
    open: boolean;
}> & Readonly<{}>, {
    open: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
