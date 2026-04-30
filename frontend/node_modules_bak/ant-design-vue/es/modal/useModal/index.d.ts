import type { MaybeRef, VueNode } from '../../_util/type';
import type { ModalFuncProps } from '../Modal';
import type { ModalStaticFunctions } from '../confirm';
export type ModalFuncWithRef = (props: MaybeRef<ModalFuncProps>) => {
    destroy: () => void;
    update: (configUpdate: ModalFuncProps) => void;
};
declare function useModal(): readonly [
    Omit<ModalStaticFunctions<ModalFuncWithRef>, 'warn'>,
    () => VueNode
];
export default useModal;
