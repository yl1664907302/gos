import type { ColProps } from '../grid/Col';
import type { ValidateStatus } from './FormItem';
import type { CustomSlotsType, VueNode } from '../_util/type';
export interface FormItemInputMiscProps {
    prefixCls: string;
    errors: VueNode[];
    hasFeedback?: boolean;
    validateStatus?: ValidateStatus;
}
export interface FormItemInputProps {
    wrapperCol?: ColProps;
    help?: VueNode;
    extra?: VueNode;
    status?: ValidateStatus;
}
declare const FormItemInput: import("vue").DefineComponent<{
    marginBottom?: any;
    help?: any;
    errors?: any;
    prefixCls?: any;
    status?: any;
    hasFeedback?: any;
    onErrorVisibleChanged?: any;
    onDomErrorVisibleChange?: any;
    wrapperCol?: any;
    extra?: any;
}, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{
    marginBottom?: any;
    help?: any;
    errors?: any;
    prefixCls?: any;
    status?: any;
    hasFeedback?: any;
    onErrorVisibleChanged?: any;
    onDomErrorVisibleChange?: any;
    wrapperCol?: any;
    extra?: any;
}> & Readonly<{}>, {}, CustomSlotsType<{
    help: any;
    errors: any;
    extra: any;
    default: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default FormItemInput;
