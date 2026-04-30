import type { Plugin } from 'vue';
import Form, { formProps } from './Form';
import FormItem, { formItemProps } from './FormItem';
import useForm from './useForm';
import FormItemRest, { useInjectFormItemContext } from './FormItemContext';
export type { Rule, RuleObject } from './interface';
export type { FormProps, FormInstance } from './Form';
export type { FormItemProps, FormItemInstance } from './FormItem';
export { FormItem, formItemProps, formProps, FormItemRest, useForm, useInjectFormItemContext };
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        layout: import("vue-types").VueTypeDef<string>;
        labelCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
            default: Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
            default: Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes;
        };
        colon: {
            type: BooleanConstructor;
            default: boolean;
        };
        labelAlign: {
            type: import("vue").PropType<import("./interface").FormLabelAlign>;
            default: import("./interface").FormLabelAlign;
        };
        labelWrap: {
            type: BooleanConstructor;
            default: boolean;
        };
        prefixCls: StringConstructor;
        requiredMark: {
            type: import("vue").PropType<"" | import("./Form").RequiredMark>;
            default: "" | import("./Form").RequiredMark;
        };
        hideRequiredMark: {
            type: BooleanConstructor;
            default: boolean;
        };
        model: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        rules: {
            type: import("vue").PropType<{
                [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
            }>;
            default: {
                [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
            };
        };
        validateMessages: {
            type: import("vue").PropType<import("./interface").ValidateMessages>;
            default: import("./interface").ValidateMessages;
        };
        validateOnRuleChange: {
            type: BooleanConstructor;
            default: boolean;
        };
        scrollToFirstError: {
            default: boolean | import("scroll-into-view-if-needed").Options<any>;
            type: import("vue").PropType<boolean | import("scroll-into-view-if-needed").Options<any>>;
        };
        onSubmit: {
            type: import("vue").PropType<(e: Event) => void>;
            default: (e: Event) => void;
        };
        name: StringConstructor;
        validateTrigger: {
            type: import("vue").PropType<string | string[]>;
            default: string | string[];
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        onValuesChange: {
            type: import("vue").PropType<(changedValues: any, values: any) => void>;
            default: (changedValues: any, values: any) => void;
        };
        onFieldsChange: {
            type: import("vue").PropType<(changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void>;
            default: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        };
        onFinish: {
            type: import("vue").PropType<(values: any) => void>;
            default: (values: any) => void;
        };
        onFinishFailed: {
            type: import("vue").PropType<(errorInfo: import("./interface").ValidateErrorEntity<any>) => void>;
            default: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
        };
        onValidate: {
            type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
            default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("../config-provider").SizeType;
        onSubmit: (e: Event) => void;
        disabled: boolean;
        validateTrigger: string | string[];
        onFinish: (values: any) => void;
        validateMessages: import("./interface").ValidateMessages;
        requiredMark: "" | import("./Form").RequiredMark;
        colon: boolean;
        labelCol: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
        labelAlign: import("./interface").FormLabelAlign;
        labelWrap: boolean;
        wrapperCol: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
        rules: {
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        };
        onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        onValuesChange: (changedValues: any, values: any) => void;
        onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        onFinishFailed: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
        hideRequiredMark: boolean;
        model: {
            [key: string]: any;
        };
        validateOnRuleChange: boolean;
        scrollToFirstError: boolean | import("scroll-into-view-if-needed").Options<any>;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        layout: import("vue-types").VueTypeDef<string>;
        labelCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
            default: Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
            default: Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes;
        };
        colon: {
            type: BooleanConstructor;
            default: boolean;
        };
        labelAlign: {
            type: import("vue").PropType<import("./interface").FormLabelAlign>;
            default: import("./interface").FormLabelAlign;
        };
        labelWrap: {
            type: BooleanConstructor;
            default: boolean;
        };
        prefixCls: StringConstructor;
        requiredMark: {
            type: import("vue").PropType<"" | import("./Form").RequiredMark>;
            default: "" | import("./Form").RequiredMark;
        };
        hideRequiredMark: {
            type: BooleanConstructor;
            default: boolean;
        };
        model: import("vue-types").VueTypeValidableDef<{
            [key: string]: any;
        }> & {
            default: () => {
                [key: string]: any;
            };
        };
        rules: {
            type: import("vue").PropType<{
                [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
            }>;
            default: {
                [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
            };
        };
        validateMessages: {
            type: import("vue").PropType<import("./interface").ValidateMessages>;
            default: import("./interface").ValidateMessages;
        };
        validateOnRuleChange: {
            type: BooleanConstructor;
            default: boolean;
        };
        scrollToFirstError: {
            default: boolean | import("scroll-into-view-if-needed").Options<any>;
            type: import("vue").PropType<boolean | import("scroll-into-view-if-needed").Options<any>>;
        };
        onSubmit: {
            type: import("vue").PropType<(e: Event) => void>;
            default: (e: Event) => void;
        };
        name: StringConstructor;
        validateTrigger: {
            type: import("vue").PropType<string | string[]>;
            default: string | string[];
        };
        size: {
            type: import("vue").PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        disabled: {
            type: BooleanConstructor;
            default: boolean;
        };
        onValuesChange: {
            type: import("vue").PropType<(changedValues: any, values: any) => void>;
            default: (changedValues: any, values: any) => void;
        };
        onFieldsChange: {
            type: import("vue").PropType<(changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void>;
            default: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        };
        onFinish: {
            type: import("vue").PropType<(values: any) => void>;
            default: (values: any) => void;
        };
        onFinishFailed: {
            type: import("vue").PropType<(errorInfo: import("./interface").ValidateErrorEntity<any>) => void>;
            default: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
        };
        onValidate: {
            type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
            default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: import("../config-provider").SizeType;
        onSubmit: (e: Event) => void;
        disabled: boolean;
        validateTrigger: string | string[];
        onFinish: (values: any) => void;
        validateMessages: import("./interface").ValidateMessages;
        requiredMark: "" | import("./Form").RequiredMark;
        colon: boolean;
        labelCol: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
        labelAlign: import("./interface").FormLabelAlign;
        labelWrap: boolean;
        wrapperCol: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
        rules: {
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        };
        onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        onValuesChange: (changedValues: any, values: any) => void;
        onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        onFinishFailed: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
        hideRequiredMark: boolean;
        model: {
            [key: string]: any;
        };
        validateOnRuleChange: boolean;
        scrollToFirstError: boolean | import("scroll-into-view-if-needed").Options<any>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    layout: import("vue-types").VueTypeDef<string>;
    labelCol: {
        type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes>;
        default: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
    };
    wrapperCol: {
        type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes>;
        default: Partial<import("vue").ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid").ColSize>;
                default: string | number | import("../grid").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & import("vue").HTMLAttributes;
    };
    colon: {
        type: BooleanConstructor;
        default: boolean;
    };
    labelAlign: {
        type: import("vue").PropType<import("./interface").FormLabelAlign>;
        default: import("./interface").FormLabelAlign;
    };
    labelWrap: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    requiredMark: {
        type: import("vue").PropType<"" | import("./Form").RequiredMark>;
        default: "" | import("./Form").RequiredMark;
    };
    hideRequiredMark: {
        type: BooleanConstructor;
        default: boolean;
    };
    model: import("vue-types").VueTypeValidableDef<{
        [key: string]: any;
    }> & {
        default: () => {
            [key: string]: any;
        };
    };
    rules: {
        type: import("vue").PropType<{
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        }>;
        default: {
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        };
    };
    validateMessages: {
        type: import("vue").PropType<import("./interface").ValidateMessages>;
        default: import("./interface").ValidateMessages;
    };
    validateOnRuleChange: {
        type: BooleanConstructor;
        default: boolean;
    };
    scrollToFirstError: {
        default: boolean | import("scroll-into-view-if-needed").Options<any>;
        type: import("vue").PropType<boolean | import("scroll-into-view-if-needed").Options<any>>;
    };
    onSubmit: {
        type: import("vue").PropType<(e: Event) => void>;
        default: (e: Event) => void;
    };
    name: StringConstructor;
    validateTrigger: {
        type: import("vue").PropType<string | string[]>;
        default: string | string[];
    };
    size: {
        type: import("vue").PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    onValuesChange: {
        type: import("vue").PropType<(changedValues: any, values: any) => void>;
        default: (changedValues: any, values: any) => void;
    };
    onFieldsChange: {
        type: import("vue").PropType<(changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void>;
        default: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
    };
    onFinish: {
        type: import("vue").PropType<(values: any) => void>;
        default: (values: any) => void;
    };
    onFinishFailed: {
        type: import("vue").PropType<(errorInfo: import("./interface").ValidateErrorEntity<any>) => void>;
        default: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
    };
    onValidate: {
        type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
        default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("../config-provider").SizeType;
    onSubmit: (e: Event) => void;
    disabled: boolean;
    validateTrigger: string | string[];
    onFinish: (values: any) => void;
    validateMessages: import("./interface").ValidateMessages;
    requiredMark: "" | import("./Form").RequiredMark;
    colon: boolean;
    labelCol: Partial<import("vue").ExtractPropTypes<{
        span: (StringConstructor | NumberConstructor)[];
        order: (StringConstructor | NumberConstructor)[];
        offset: (StringConstructor | NumberConstructor)[];
        push: (StringConstructor | NumberConstructor)[];
        pull: (StringConstructor | NumberConstructor)[];
        xs: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        sm: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        md: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        lg: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        xl: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        xxl: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        prefixCls: StringConstructor;
        flex: (StringConstructor | NumberConstructor)[];
    }>> & import("vue").HTMLAttributes;
    labelAlign: import("./interface").FormLabelAlign;
    labelWrap: boolean;
    wrapperCol: Partial<import("vue").ExtractPropTypes<{
        span: (StringConstructor | NumberConstructor)[];
        order: (StringConstructor | NumberConstructor)[];
        offset: (StringConstructor | NumberConstructor)[];
        push: (StringConstructor | NumberConstructor)[];
        pull: (StringConstructor | NumberConstructor)[];
        xs: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        sm: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        md: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        lg: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        xl: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        xxl: {
            type: import("vue").PropType<string | number | import("../grid").ColSize>;
            default: string | number | import("../grid").ColSize;
        };
        prefixCls: StringConstructor;
        flex: (StringConstructor | NumberConstructor)[];
    }>> & import("vue").HTMLAttributes;
    rules: {
        [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
    };
    onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
    onValuesChange: (changedValues: any, values: any) => void;
    onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
    onFinishFailed: (errorInfo: import("./interface").ValidateErrorEntity<any>) => void;
    hideRequiredMark: boolean;
    model: {
        [key: string]: any;
    };
    validateOnRuleChange: boolean;
    scrollToFirstError: boolean | import("scroll-into-view-if-needed").Options<any>;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    readonly Item: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
        htmlFor: StringConstructor;
        prefixCls: StringConstructor;
        label: import("vue-types").VueTypeValidableDef<any>;
        help: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        labelCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
        };
        hasFeedback: {
            type: BooleanConstructor;
            default: boolean;
        };
        colon: {
            type: BooleanConstructor;
            default: any;
        };
        labelAlign: import("vue").PropType<import("./interface").FormLabelAlign>;
        prop: {
            type: import("vue").PropType<string | number | (string | number)[]>;
        };
        name: {
            type: import("vue").PropType<string | number | (string | number)[]>;
        };
        rules: import("vue").PropType<import("./interface").RuleObject | import("./interface").RuleObject[]>;
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
            type: import("vue").PropType<string | string[]>;
        };
        messageVariables: {
            type: import("vue").PropType<Record<string, string>>;
        };
        hidden: BooleanConstructor;
        noStyle: BooleanConstructor;
        tooltip: StringConstructor;
    }>, () => any, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
        htmlFor: StringConstructor;
        prefixCls: StringConstructor;
        label: import("vue-types").VueTypeValidableDef<any>;
        help: import("vue-types").VueTypeValidableDef<any>;
        extra: import("vue-types").VueTypeValidableDef<any>;
        labelCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<import("vue").ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid").ColSize>;
                    default: string | number | import("../grid").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & import("vue").HTMLAttributes>;
        };
        hasFeedback: {
            type: BooleanConstructor;
            default: boolean;
        };
        colon: {
            type: BooleanConstructor;
            default: any;
        };
        labelAlign: import("vue").PropType<import("./interface").FormLabelAlign>;
        prop: {
            type: import("vue").PropType<string | number | (string | number)[]>;
        };
        name: {
            type: import("vue").PropType<string | number | (string | number)[]>;
        };
        rules: import("vue").PropType<import("./interface").RuleObject | import("./interface").RuleObject[]>;
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
            type: import("vue").PropType<string | string[]>;
        };
        messageVariables: {
            type: import("vue").PropType<Record<string, string>>;
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
    }, import("../_util/type").CustomSlotsType<{
        help: any;
        label: any;
        extra: any;
        default: any;
        tooltip: any;
    }>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
    readonly useForm: typeof useForm;
} & Plugin<any[]> & {
    readonly Item: typeof Form.Item;
    readonly ItemRest: typeof FormItemRest;
    readonly useForm: typeof useForm;
    readonly useInjectFormItemContext: typeof useInjectFormItemContext;
};
export default _default;
