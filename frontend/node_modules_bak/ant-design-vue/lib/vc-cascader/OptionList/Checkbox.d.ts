import type { MouseEventHandler } from '../../_util/EventInterface';
export interface CheckboxProps {
    prefixCls: string;
    checked?: boolean;
    halfChecked?: boolean;
    disabled?: boolean;
    onClick?: MouseEventHandler;
}
declare function Checkbox({ prefixCls, checked, halfChecked, disabled, onClick, }: CheckboxProps): import("vue/jsx-runtime").JSX.Element;
declare namespace Checkbox {
    var props: string[];
    var displayName: string;
    var inheritAttrs: boolean;
}
export default Checkbox;
