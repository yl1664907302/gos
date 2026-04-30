import type { Ref } from 'vue';
import type { Callbacks, RuleError, ValidateMessages } from './interface';
import type { ValidateStatus } from './FormItem';
interface DebounceSettings {
    leading?: boolean;
    wait?: number;
    trailing?: boolean;
}
export interface Props {
    [key: string]: any;
}
export interface validateOptions {
    validateFirst?: boolean;
    validateMessages?: ValidateMessages;
    trigger?: 'change' | 'blur' | string | string[];
}
type namesType = string | string[];
export interface ValidateInfo {
    autoLink?: boolean;
    required?: boolean;
    validateStatus?: ValidateStatus;
    help?: any;
}
export interface validateInfos {
    [key: string]: ValidateInfo;
}
declare function useForm(modelRef: Props | Ref<Props>, rulesRef?: Props | Ref<Props>, options?: {
    immediate?: boolean;
    deep?: boolean;
    validateOnRuleChange?: boolean;
    debounce?: DebounceSettings;
    onValidate?: Callbacks['onValidate'];
}): {
    modelRef: Props | Ref<Props>;
    rulesRef: Props | Ref<Props>;
    initialModel: Props;
    validateInfos: validateInfos;
    resetFields: (newValues?: Props) => void;
    validate: <T = any>(names?: namesType, option?: validateOptions) => Promise<T>;
    /** This is an internal usage. Do not use in your prod */
    validateField: (name: string, value: any, rules: Record<string, unknown>[], option?: validateOptions) => Promise<RuleError[]>;
    mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
    clearValidate: (names?: namesType) => void;
};
export default useForm;
