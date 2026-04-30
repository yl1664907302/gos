import type { ColProps } from '../grid/Col';
import type { FormLabelAlign } from './interface';
import type { RequiredMark } from './Form';
import type { VueNode } from '../_util/type';
import type { FunctionalComponent, HTMLAttributes } from 'vue';
export interface FormItemLabelProps {
    colon?: boolean;
    htmlFor?: string;
    label?: VueNode;
    labelAlign?: FormLabelAlign;
    labelCol?: ColProps & HTMLAttributes;
    requiredMark?: RequiredMark;
    required?: boolean;
    prefixCls: string;
    onClick: Function;
    tooltip: string;
}
declare const FormItemLabel: FunctionalComponent<FormItemLabelProps>;
export default FormItemLabel;
