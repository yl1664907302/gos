import type { ModalFuncProps } from './Modal';
type ConfigUpdate = ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps);
export type ModalStaticFunctions<T = ModalFunc> = Record<NonNullable<ModalFuncProps['type']>, T>;
export type ModalFunc = (props: ModalFuncProps) => {
    destroy: () => void;
    update: (configUpdate: ConfigUpdate) => void;
};
declare const confirm: (config: ModalFuncProps) => {
    destroy: (this: any, ...args: any[]) => void;
    update: (configUpdate: ConfigUpdate) => void;
};
export default confirm;
export declare function withWarn(props: ModalFuncProps): ModalFuncProps;
export declare function withInfo(props: ModalFuncProps): ModalFuncProps;
export declare function withSuccess(props: ModalFuncProps): ModalFuncProps;
export declare function withError(props: ModalFuncProps): ModalFuncProps;
export declare function withConfirm(props: ModalFuncProps): ModalFuncProps;
