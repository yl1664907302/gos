import type { ComputedRef } from 'vue';
import type { ValidateStatus } from './FormItem';
export type FormItemContext = {
    id: ComputedRef<string>;
    onFieldBlur: () => void;
    onFieldChange: () => void;
    clearValidate: () => void;
};
export declare const useProvideFormItemContext: (props: FormItemContext, useValidation?: ComputedRef<boolean>) => void;
export declare const useInjectFormItemContext: () => FormItemContext;
declare const _default: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
export interface FormItemStatusContextProps {
    isFormItemInput?: boolean;
    status?: ValidateStatus;
    hasFeedback?: boolean;
    feedbackIcon?: any;
}
export declare const FormItemInputContext: {
    useProvide: (props: FormItemStatusContextProps, newProps?: FormItemStatusContextProps) => {
        isFormItemInput?: boolean;
        status?: ValidateStatus;
        hasFeedback?: boolean;
        feedbackIcon?: any;
    };
    useInject: () => FormItemStatusContextProps;
};
export declare const NoFormStatus: import("vue").DefineComponent<{}, () => import("vue").VNode<import("vue").RendererNode, import("vue").RendererElement, {
    [key: string]: any;
}>[], {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<{}> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
