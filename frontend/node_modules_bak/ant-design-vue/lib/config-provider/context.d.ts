import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType, Ref } from 'vue';
import type { ValidateMessages } from '../form/interface';
import type { RequiredMark } from '../form/Form';
import type { TransformCellTextProps } from '../table/interface';
import type { Locale } from '../locale-provider';
import type { DerivativeFunc } from '../_util/cssinjs';
import type { AliasToken, SeedToken } from '../theme/internal';
import type { MapToken, OverrideToken } from '../theme/interface';
import type { VueNode } from '../_util/type';
export declare const defaultIconPrefixCls = "anticon";
type GlobalFormCOntextProps = {
    validateMessages?: Ref<ValidateMessages>;
};
export type DirectionType = 'ltr' | 'rtl' | undefined;
export declare const GlobalFormContextKey: InjectionKey<GlobalFormCOntextProps>;
export declare const useProvideGlobalForm: (state: GlobalFormCOntextProps) => void;
export declare const useInjectGlobalForm: () => GlobalFormCOntextProps;
export declare const GlobalConfigContextKey: InjectionKey<GlobalFormCOntextProps>;
export interface CSPConfig {
    nonce?: string;
}
export interface Theme {
    primaryColor?: string;
    infoColor?: string;
    successColor?: string;
    processingColor?: string;
    errorColor?: string;
    warningColor?: string;
}
export type SizeType = 'small' | 'middle' | 'large' | undefined;
export type Direction = 'ltr' | 'rtl';
export type MappingAlgorithm = DerivativeFunc<SeedToken, MapToken>;
export interface ThemeConfig {
    token?: Partial<AliasToken>;
    components?: OverrideToken;
    algorithm?: MappingAlgorithm | MappingAlgorithm[];
    hashed?: boolean;
    inherit?: boolean;
}
export declare const configProviderProps: () => {
    iconPrefixCls: StringConstructor;
    getTargetContainer: {
        type: PropType<() => HTMLElement | Window>;
    };
    getPopupContainer: {
        type: PropType<(triggerNode?: HTMLElement) => HTMLElement>;
    };
    prefixCls: StringConstructor;
    getPrefixCls: {
        type: PropType<(suffixCls?: string, customizePrefixCls?: string) => string>;
    };
    renderEmpty: {
        type: PropType<typeof import("./renderEmpty").default>;
    };
    transformCellText: {
        type: PropType<(tableProps: TransformCellTextProps) => any>;
    };
    csp: {
        type: PropType<CSPConfig>;
        default: CSPConfig;
    };
    input: {
        type: PropType<{
            autocomplete?: string;
        }>;
        default: {
            autocomplete?: string;
        };
    };
    autoInsertSpaceInButton: {
        type: BooleanConstructor;
        default: any;
    };
    locale: {
        type: PropType<Locale>;
        default: Locale;
    };
    pageHeader: {
        type: PropType<{
            ghost?: boolean;
        }>;
        default: {
            ghost?: boolean;
        };
    };
    componentSize: {
        type: PropType<SizeType>;
    };
    componentDisabled: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: PropType<"rtl" | "ltr">;
        default: string;
    };
    space: {
        type: PropType<{
            size?: SizeType | number;
        }>;
        default: {
            size?: SizeType | number;
        };
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    dropdownMatchSelectWidth: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: boolean;
    };
    form: {
        type: PropType<{
            validateMessages?: ValidateMessages;
            requiredMark?: RequiredMark;
            colon?: boolean;
        }>;
        default: {
            validateMessages?: ValidateMessages;
            requiredMark?: RequiredMark;
            colon?: boolean;
        };
    };
    pagination: {
        type: PropType<{
            showSizeChanger?: boolean;
        }>;
        default: {
            showSizeChanger?: boolean;
        };
    };
    theme: {
        type: PropType<ThemeConfig>;
        default: ThemeConfig;
    };
    select: {
        type: PropType<{
            showSearch?: boolean;
        }>;
        default: {
            showSearch?: boolean;
        };
    };
    wave: {
        type: PropType<{
            disabled?: boolean;
        }>;
        default: {
            disabled?: boolean;
        };
    };
};
export type ConfigProviderProps = Partial<ExtractPropTypes<ReturnType<typeof configProviderProps>>>;
export interface ConfigProviderInnerProps {
    csp?: ComputedRef<CSPConfig>;
    autoInsertSpaceInButton?: ComputedRef<boolean>;
    locale?: ComputedRef<Locale>;
    direction?: ComputedRef<'ltr' | 'rtl'>;
    space?: ComputedRef<{
        size?: number | SizeType;
    }>;
    virtual?: ComputedRef<boolean>;
    dropdownMatchSelectWidth?: ComputedRef<number | boolean>;
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    iconPrefixCls: ComputedRef<string>;
    theme?: ComputedRef<ThemeConfig>;
    renderEmpty?: (name?: string) => VueNode;
    getTargetContainer?: ComputedRef<() => HTMLElement | Window>;
    getPopupContainer?: ComputedRef<(triggerNode?: HTMLElement) => HTMLElement>;
    pageHeader?: ComputedRef<{
        ghost?: boolean;
    }>;
    input?: ComputedRef<{
        autocomplete?: string;
    }>;
    pagination?: ComputedRef<{
        showSizeChanger?: boolean;
    }>;
    form?: ComputedRef<{
        validateMessages?: ValidateMessages;
        requiredMark?: RequiredMark;
        colon?: boolean;
    }>;
    select?: ComputedRef<{
        showSearch?: boolean;
    }>;
    componentSize?: ComputedRef<SizeType>;
    componentDisabled?: ComputedRef<boolean>;
    transformCellText?: ComputedRef<(tableProps: TransformCellTextProps) => any>;
    wave?: ComputedRef<{
        disabled?: boolean;
    }>;
    flex?: ComputedRef<{
        vertical?: boolean;
    }>;
}
export declare const configProviderKey: InjectionKey<ConfigProviderInnerProps>;
export declare const defaultConfigProvider: ConfigProviderInnerProps;
export declare const useConfigContextInject: () => ConfigProviderInnerProps;
export declare const useConfigContextProvider: (props: ConfigProviderInnerProps) => void;
export {};
