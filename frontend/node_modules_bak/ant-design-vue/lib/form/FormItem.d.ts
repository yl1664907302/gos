import type { PropType, ExtractPropTypes, ComputedRef, Ref, ComponentPublicInstance, HTMLAttributes } from 'vue';
import type { CustomSlotsType } from '../_util/type';
import type { FormLabelAlign, InternalNamePath, Rule, RuleError, RuleObject, ValidateOptions } from './interface';
declare const ValidateStatuses: ["success", "warning", "error", "validating", ""];
export type ValidateStatus = (typeof ValidateStatuses)[number];
export interface FieldExpose {
    fieldValue: Ref<any>;
    fieldId: ComputedRef<any>;
    fieldName: ComputedRef<any>;
    resetField: () => void;
    clearValidate: () => void;
    namePath: ComputedRef<InternalNamePath>;
    rules?: ComputedRef<Rule[]>;
    validateRules: (options: ValidateOptions) => Promise<void> | Promise<RuleError[]>;
}
export declare const formItemProps: () => {
    htmlFor: StringConstructor;
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    help: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    labelCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    wrapperCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    hasFeedback: {
        type: BooleanConstructor;
        default: boolean;
    };
    colon: {
        type: BooleanConstructor;
        default: any;
    };
    labelAlign: PropType<FormLabelAlign>;
    prop: {
        type: PropType<string | number | (string | number)[]>;
    };
    name: {
        type: PropType<string | number | (string | number)[]>;
    };
    rules: PropType<RuleObject | RuleObject[]>;
    autoLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    required: {
        type: BooleanConstructor;
        default: any;
    };
    validateFirst: {
        type: BooleanConstructor;
        default: any;
    };
    validateStatus: import("vue-types").VueTypeDef<string>;
    validateTrigger: {
        type: PropType<string | string[]>;
    };
    messageVariables: {
        type: PropType<Record<string, string>>;
    };
    hidden: BooleanConstructor;
    noStyle: BooleanConstructor;
    tooltip: StringConstructor;
};
export type FormItemProps = Partial<ExtractPropTypes<ReturnType<typeof formItemProps>>>;
export type FormItemExpose = {
    onFieldBlur: () => void;
    onFieldChange: () => void;
    clearValidate: () => void;
    resetField: () => void;
};
export type FormItemInstance = ComponentPublicInstance<FormItemProps, FormItemExpose>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    htmlFor: StringConstructor;
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    help: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    labelCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    wrapperCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    hasFeedback: {
        type: BooleanConstructor;
        default: boolean;
    };
    colon: {
        type: BooleanConstructor;
        default: any;
    };
    labelAlign: PropType<FormLabelAlign>;
    prop: {
        type: PropType<string | number | (string | number)[]>;
    };
    name: {
        type: PropType<string | number | (string | number)[]>;
    };
    rules: PropType<RuleObject | RuleObject[]>;
    autoLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    required: {
        type: BooleanConstructor;
        default: any;
    };
    validateFirst: {
        type: BooleanConstructor;
        default: any;
    };
    validateStatus: import("vue-types").VueTypeDef<string>;
    validateTrigger: {
        type: PropType<string | string[]>;
    };
    messageVariables: {
        type: PropType<Record<string, string>>;
    };
    hidden: BooleanConstructor;
    noStyle: BooleanConstructor;
    tooltip: StringConstructor;
}>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    htmlFor: StringConstructor;
    prefixCls: StringConstructor;
    label: import("vue-types").VueTypeValidableDef<any>;
    help: import("vue-types").VueTypeValidableDef<any>;
    extra: import("vue-types").VueTypeValidableDef<any>;
    labelCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    wrapperCol: {
        type: PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
    };
    hasFeedback: {
        type: BooleanConstructor;
        default: boolean;
    };
    colon: {
        type: BooleanConstructor;
        default: any;
    };
    labelAlign: PropType<FormLabelAlign>;
    prop: {
        type: PropType<string | number | (string | number)[]>;
    };
    name: {
        type: PropType<string | number | (string | number)[]>;
    };
    rules: PropType<RuleObject | RuleObject[]>;
    autoLink: {
        type: BooleanConstructor;
        default: boolean;
    };
    required: {
        type: BooleanConstructor;
        default: any;
    };
    validateFirst: {
        type: BooleanConstructor;
        default: any;
    };
    validateStatus: import("vue-types").VueTypeDef<string>;
    validateTrigger: {
        type: PropType<string | string[]>;
    };
    messageVariables: {
        type: PropType<Record<string, string>>;
    };
    hidden: BooleanConstructor;
    noStyle: BooleanConstructor;
    tooltip: StringConstructor;
}>> & Readonly<{}>, {
    required: boolean;
    hidden: boolean;
    hasFeedback: boolean;
    noStyle: boolean;
    colon: boolean;
    autoLink: boolean;
    validateFirst: boolean;
}, CustomSlotsType<{
    help: any;
    label: any;
    extra: any;
    default: any;
    tooltip: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
