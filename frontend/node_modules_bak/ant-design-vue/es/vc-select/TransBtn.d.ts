import type { FunctionalComponent } from 'vue';
import type { RenderNode } from './BaseSelect';
export interface TransBtnProps {
    class: string;
    customizeIcon: RenderNode;
    customizeIconProps?: any;
    onMousedown?: (payload: MouseEvent) => void;
    onClick?: (payload: MouseEvent) => void;
}
export interface TransBtnType extends FunctionalComponent<TransBtnProps> {
    displayName: string;
}
declare const TransBtn: TransBtnType;
export default TransBtn;
