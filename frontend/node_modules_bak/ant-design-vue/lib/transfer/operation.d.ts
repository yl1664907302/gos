import type { CSSProperties, FunctionalComponent } from 'vue';
import type { Direction } from '../config-provider';
export interface TransferOperationProps {
    class?: string;
    leftArrowText?: string;
    rightArrowText?: string;
    moveToLeft?: (e: MouseEvent) => void;
    moveToRight?: (e: MouseEvent) => void;
    leftActive?: boolean;
    rightActive?: boolean;
    style?: CSSProperties | string;
    disabled?: boolean;
    direction?: Direction;
    oneWay?: boolean;
}
declare const Operation: FunctionalComponent<TransferOperationProps>;
export default Operation;
