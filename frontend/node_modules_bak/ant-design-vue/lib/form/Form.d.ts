import type { ExtractPropTypes, HTMLAttributes, ComponentPublicInstance } from 'vue';
import FormItem from './FormItem';
import type { Options } from 'scroll-into-view-if-needed';
import type { InternalNamePath, NamePath, ValidateErrorEntity, ValidateOptions, ValidateMessages, FormLabelAlign } from './interface';
import type { SizeType } from '../config-provider';
import useForm from './useForm';
export type RequiredMark = boolean | 'optional';
export type FormLayout = 'horizontal' | 'inline' | 'vertical';
export declare const formProps: () => {
    layout: import("vue-types").VueTypeDef<string>;
    labelCol: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
        default: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
    };
    wrapperCol: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
        default: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
    };
    colon: {
        type: BooleanConstructor;
        default: boolean;
    };
    labelAlign: {
        type: import("vue").PropType<FormLabelAlign>;
        default: FormLabelAlign;
    };
    labelWrap: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    requiredMark: {
        type: import("vue").PropType<"" | RequiredMark>;
        default: "" | RequiredMark;
    };
    /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
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
        type: import("vue").PropType<ValidateMessages>;
        default: ValidateMessages;
    };
    validateOnRuleChange: {
        type: BooleanConstructor;
        default: boolean;
    };
    scrollToFirstError: {
        default: boolean | Options<any>;
        type: import("vue").PropType<boolean | Options<any>>;
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
        type: import("vue").PropType<SizeType>;
        default: SizeType;
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
        type: import("vue").PropType<(errorInfo: ValidateErrorEntity<any>) => void>;
        default: (errorInfo: ValidateErrorEntity<any>) => void;
    };
    onValidate: {
        type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
        default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
    };
};
export type FormProps = Partial<ExtractPropTypes<ReturnType<typeof formProps>>>;
export type FormExpose = {
    resetFields: (name?: NamePath) => void;
    clearValidate: (name?: NamePath) => void;
    validateFields: (nameList?: NamePath[] | string, options?: ValidateOptions) => Promise<{
        [key: string]: any;
    }>;
    getFieldsValue: (nameList?: InternalNamePath[] | true) => {
        [key: string]: any;
    };
    validate: (nameList?: NamePath[] | string, options?: ValidateOptions) => Promise<{
        [key: string]: any;
    }>;
    scrollToField: (name: NamePath, options?: {}) => void;
};
export type FormInstance = ComponentPublicInstance<FormProps, FormExpose>;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        layout: import("vue-types").VueTypeDef<string>;
        labelCol: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes>;
            default: Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes>;
            default: Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes;
        };
        colon: {
            type: BooleanConstructor;
            default: boolean;
        };
        labelAlign: {
            type: import("vue").PropType<FormLabelAlign>;
            default: FormLabelAlign;
        };
        labelWrap: {
            type: BooleanConstructor;
            default: boolean;
        };
        prefixCls: StringConstructor;
        requiredMark: {
            type: import("vue").PropType<"" | RequiredMark>;
            default: "" | RequiredMark;
        };
        /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
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
            type: import("vue").PropType<ValidateMessages>;
            default: ValidateMessages;
        };
        validateOnRuleChange: {
            type: BooleanConstructor;
            default: boolean;
        };
        scrollToFirstError: {
            default: boolean | Options<any>;
            type: import("vue").PropType<boolean | Options<any>>;
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
            type: import("vue").PropType<SizeType>;
            default: SizeType;
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
            type: import("vue").PropType<(errorInfo: ValidateErrorEntity<any>) => void>;
            default: (errorInfo: ValidateErrorEntity<any>) => void;
        };
        onValidate: {
            type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
            default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: SizeType;
        onSubmit: (e: Event) => void;
        disabled: boolean;
        validateTrigger: string | string[];
        onFinish: (values: any) => void;
        validateMessages: ValidateMessages;
        requiredMark: "" | RequiredMark;
        colon: boolean;
        labelCol: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
        labelAlign: FormLabelAlign;
        labelWrap: boolean;
        wrapperCol: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
        rules: {
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        };
        onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        onValuesChange: (changedValues: any, values: any) => void;
        onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        onFinishFailed: (errorInfo: ValidateErrorEntity<any>) => void;
        hideRequiredMark: boolean;
        model: {
            [key: string]: any;
        };
        validateOnRuleChange: boolean;
        scrollToFirstError: boolean | Options<any>;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        layout: import("vue-types").VueTypeDef<string>;
        labelCol: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes>;
            default: Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes;
        };
        wrapperCol: {
            type: import("vue").PropType<Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes>;
            default: Partial<ExtractPropTypes<{
                span: (StringConstructor | NumberConstructor)[];
                order: (StringConstructor | NumberConstructor)[];
                offset: (StringConstructor | NumberConstructor)[];
                push: (StringConstructor | NumberConstructor)[];
                pull: (StringConstructor | NumberConstructor)[];
                xs: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                sm: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                md: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                lg: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                xxl: {
                    type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                    default: string | number | import("../grid/Col").ColSize;
                };
                prefixCls: StringConstructor;
                flex: (StringConstructor | NumberConstructor)[];
            }>> & HTMLAttributes;
        };
        colon: {
            type: BooleanConstructor;
            default: boolean;
        };
        labelAlign: {
            type: import("vue").PropType<FormLabelAlign>;
            default: FormLabelAlign;
        };
        labelWrap: {
            type: BooleanConstructor;
            default: boolean;
        };
        prefixCls: StringConstructor;
        requiredMark: {
            type: import("vue").PropType<"" | RequiredMark>;
            default: "" | RequiredMark;
        };
        /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
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
            type: import("vue").PropType<ValidateMessages>;
            default: ValidateMessages;
        };
        validateOnRuleChange: {
            type: BooleanConstructor;
            default: boolean;
        };
        scrollToFirstError: {
            default: boolean | Options<any>;
            type: import("vue").PropType<boolean | Options<any>>;
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
            type: import("vue").PropType<SizeType>;
            default: SizeType;
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
            type: import("vue").PropType<(errorInfo: ValidateErrorEntity<any>) => void>;
            default: (errorInfo: ValidateErrorEntity<any>) => void;
        };
        onValidate: {
            type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
            default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: SizeType;
        onSubmit: (e: Event) => void;
        disabled: boolean;
        validateTrigger: string | string[];
        onFinish: (values: any) => void;
        validateMessages: ValidateMessages;
        requiredMark: "" | RequiredMark;
        colon: boolean;
        labelCol: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
        labelAlign: FormLabelAlign;
        labelWrap: boolean;
        wrapperCol: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
        rules: {
            [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
        };
        onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
        onValuesChange: (changedValues: any, values: any) => void;
        onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
        onFinishFailed: (errorInfo: ValidateErrorEntity<any>) => void;
        hideRequiredMark: boolean;
        model: {
            [key: string]: any;
        };
        validateOnRuleChange: boolean;
        scrollToFirstError: boolean | Options<any>;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    layout: import("vue-types").VueTypeDef<string>;
    labelCol: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
        default: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
    };
    wrapperCol: {
        type: import("vue").PropType<Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes>;
        default: Partial<ExtractPropTypes<{
            span: (StringConstructor | NumberConstructor)[];
            order: (StringConstructor | NumberConstructor)[];
            offset: (StringConstructor | NumberConstructor)[];
            push: (StringConstructor | NumberConstructor)[];
            pull: (StringConstructor | NumberConstructor)[];
            xs: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            sm: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            md: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            lg: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            xxl: {
                type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
                default: string | number | import("../grid/Col").ColSize;
            };
            prefixCls: StringConstructor;
            flex: (StringConstructor | NumberConstructor)[];
        }>> & HTMLAttributes;
    };
    colon: {
        type: BooleanConstructor;
        default: boolean;
    };
    labelAlign: {
        type: import("vue").PropType<FormLabelAlign>;
        default: FormLabelAlign;
    };
    labelWrap: {
        type: BooleanConstructor;
        default: boolean;
    };
    prefixCls: StringConstructor;
    requiredMark: {
        type: import("vue").PropType<"" | RequiredMark>;
        default: "" | RequiredMark;
    };
    /** @deprecated Will warning in future branch. Pls use `requiredMark` instead. */
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
        type: import("vue").PropType<ValidateMessages>;
        default: ValidateMessages;
    };
    validateOnRuleChange: {
        type: BooleanConstructor;
        default: boolean;
    };
    scrollToFirstError: {
        default: boolean | Options<any>;
        type: import("vue").PropType<boolean | Options<any>>;
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
        type: import("vue").PropType<SizeType>;
        default: SizeType;
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
        type: import("vue").PropType<(errorInfo: ValidateErrorEntity<any>) => void>;
        default: (errorInfo: ValidateErrorEntity<any>) => void;
    };
    onValidate: {
        type: import("vue").PropType<(name: string | number | string[] | number[], status: boolean, errors: string[]) => void>;
        default: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: SizeType;
    onSubmit: (e: Event) => void;
    disabled: boolean;
    validateTrigger: string | string[];
    onFinish: (values: any) => void;
    validateMessages: ValidateMessages;
    requiredMark: "" | RequiredMark;
    colon: boolean;
    labelCol: Partial<ExtractPropTypes<{
        span: (StringConstructor | NumberConstructor)[];
        order: (StringConstructor | NumberConstructor)[];
        offset: (StringConstructor | NumberConstructor)[];
        push: (StringConstructor | NumberConstructor)[];
        pull: (StringConstructor | NumberConstructor)[];
        xs: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        sm: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        md: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        lg: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        xl: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        xxl: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        prefixCls: StringConstructor;
        flex: (StringConstructor | NumberConstructor)[];
    }>> & HTMLAttributes;
    labelAlign: FormLabelAlign;
    labelWrap: boolean;
    wrapperCol: Partial<ExtractPropTypes<{
        span: (StringConstructor | NumberConstructor)[];
        order: (StringConstructor | NumberConstructor)[];
        offset: (StringConstructor | NumberConstructor)[];
        push: (StringConstructor | NumberConstructor)[];
        pull: (StringConstructor | NumberConstructor)[];
        xs: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        sm: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        md: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        lg: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        xl: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        xxl: {
            type: import("vue").PropType<string | number | import("../grid/Col").ColSize>;
            default: string | number | import("../grid/Col").ColSize;
        };
        prefixCls: StringConstructor;
        flex: (StringConstructor | NumberConstructor)[];
    }>> & HTMLAttributes;
    rules: {
        [k: string]: import("./interface").RuleObject | import("./interface").RuleObject[];
    };
    onValidate: (name: string | number | string[] | number[], status: boolean, errors: string[]) => void;
    onValuesChange: (changedValues: any, values: any) => void;
    onFieldsChange: (changedFields: import("./interface").FieldData[], allFields: import("./interface").FieldData[]) => void;
    onFinishFailed: (errorInfo: ValidateErrorEntity<any>) => void;
    hideRequiredMark: boolean;
    model: {
        [key: string]: any;
    };
    validateOnRuleChange: boolean;
    scrollToFirstError: boolean | Options<any>;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    readonly Item: typeof FormItem;
    readonly useForm: typeof useForm;
};
export default _default;
