import type { MaybeRef, Plugin } from 'vue';
import defaultRenderEmpty from './renderEmpty';
import type { Locale } from '../locale-provider';
import type { ValidateMessages } from '../form/interface';
import type { ConfigProviderProps, Theme } from './context';
import { defaultIconPrefixCls } from './context';
export type { ConfigProviderProps, Theme, SizeType, Direction, CSPConfig, DirectionType, } from './context';
export declare const defaultPrefixCls = "ant";
export { defaultIconPrefixCls };
declare function getGlobalIconPrefixCls(): string;
export declare const globalConfigForApi: ConfigProviderProps & {
    getRootPrefixCls?: (rootPrefixCls?: string, customizePrefixCls?: string) => string;
};
export declare const configConsumerProps: string[];
type GlobalConfigProviderProps = {
    prefixCls?: MaybeRef<ConfigProviderProps['prefixCls']>;
    iconPrefixCls?: MaybeRef<ConfigProviderProps['iconPrefixCls']>;
    getPopupContainer?: ConfigProviderProps['getPopupContainer'];
};
declare const setGlobalConfig: (params: GlobalConfigProviderProps & {
    theme?: Theme;
}) => void;
export declare const globalConfig: () => {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    getIconPrefixCls: typeof getGlobalIconPrefixCls;
    getRootPrefixCls: () => string;
};
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<import("vue").ExtractPropTypes<{
        iconPrefixCls: StringConstructor;
        getTargetContainer: {
            type: import("vue").PropType<() => Window | HTMLElement>;
        };
        getPopupContainer: {
            type: import("vue").PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        };
        prefixCls: StringConstructor;
        getPrefixCls: {
            type: import("vue").PropType<(suffixCls?: string, customizePrefixCls?: string) => string>;
        };
        renderEmpty: {
            type: import("vue").PropType<typeof defaultRenderEmpty>;
        };
        transformCellText: {
            type: import("vue").PropType<(tableProps: import("../table/interface").TransformCellTextProps) => any>;
        };
        csp: {
            type: import("vue").PropType<import("./context").CSPConfig>;
            default: import("./context").CSPConfig;
        };
        input: {
            type: import("vue").PropType<{
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
            type: import("vue").PropType<Locale>;
            default: Locale;
        };
        pageHeader: {
            type: import("vue").PropType<{
                ghost?: boolean;
            }>;
            default: {
                ghost?: boolean;
            };
        };
        componentSize: {
            type: import("vue").PropType<import("./context").SizeType>;
        };
        componentDisabled: {
            type: BooleanConstructor;
            default: any;
        };
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
            default: string;
        };
        space: {
            type: import("vue").PropType<{
                size?: number | import("./context").SizeType;
            }>;
            default: {
                size?: number | import("./context").SizeType;
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
            type: import("vue").PropType<{
                validateMessages?: ValidateMessages;
                requiredMark?: import("../form/Form").RequiredMark;
                colon?: boolean;
            }>;
            default: {
                validateMessages?: ValidateMessages;
                requiredMark?: import("../form/Form").RequiredMark;
                colon?: boolean;
            };
        };
        pagination: {
            type: import("vue").PropType<{
                showSizeChanger?: boolean;
            }>;
            default: {
                showSizeChanger?: boolean;
            };
        };
        theme: {
            type: import("vue").PropType<import("./context").ThemeConfig>;
            default: import("./context").ThemeConfig;
        };
        select: {
            type: import("vue").PropType<{
                showSearch?: boolean;
            }>;
            default: {
                showSearch?: boolean;
            };
        };
        wave: {
            type: import("vue").PropType<{
                disabled?: boolean;
            }>;
            default: {
                disabled?: boolean;
            };
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        input: {
            autocomplete?: string;
        };
        select: {
            showSearch?: boolean;
        };
        form: {
            validateMessages?: ValidateMessages;
            requiredMark?: import("../form/Form").RequiredMark;
            colon?: boolean;
        };
        csp: import("./context").CSPConfig;
        direction: "rtl" | "ltr";
        space: {
            size?: number | import("./context").SizeType;
        };
        theme: import("./context").ThemeConfig;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        wave: {
            disabled?: boolean;
        };
        locale: Locale;
        pagination: {
            showSizeChanger?: boolean;
        };
        autoInsertSpaceInButton: boolean;
        pageHeader: {
            ghost?: boolean;
        };
        componentDisabled: boolean;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<import("vue").ExtractPropTypes<{
        iconPrefixCls: StringConstructor;
        getTargetContainer: {
            type: import("vue").PropType<() => Window | HTMLElement>;
        };
        getPopupContainer: {
            type: import("vue").PropType<(triggerNode?: HTMLElement) => HTMLElement>;
        };
        prefixCls: StringConstructor;
        getPrefixCls: {
            type: import("vue").PropType<(suffixCls?: string, customizePrefixCls?: string) => string>;
        };
        renderEmpty: {
            type: import("vue").PropType<typeof defaultRenderEmpty>;
        };
        transformCellText: {
            type: import("vue").PropType<(tableProps: import("../table/interface").TransformCellTextProps) => any>;
        };
        csp: {
            type: import("vue").PropType<import("./context").CSPConfig>;
            default: import("./context").CSPConfig;
        };
        input: {
            type: import("vue").PropType<{
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
            type: import("vue").PropType<Locale>;
            default: Locale;
        };
        pageHeader: {
            type: import("vue").PropType<{
                ghost?: boolean;
            }>;
            default: {
                ghost?: boolean;
            };
        };
        componentSize: {
            type: import("vue").PropType<import("./context").SizeType>;
        };
        componentDisabled: {
            type: BooleanConstructor;
            default: any;
        };
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
            default: string;
        };
        space: {
            type: import("vue").PropType<{
                size?: number | import("./context").SizeType;
            }>;
            default: {
                size?: number | import("./context").SizeType;
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
            type: import("vue").PropType<{
                validateMessages?: ValidateMessages;
                requiredMark?: import("../form/Form").RequiredMark;
                colon?: boolean;
            }>;
            default: {
                validateMessages?: ValidateMessages;
                requiredMark?: import("../form/Form").RequiredMark;
                colon?: boolean;
            };
        };
        pagination: {
            type: import("vue").PropType<{
                showSizeChanger?: boolean;
            }>;
            default: {
                showSizeChanger?: boolean;
            };
        };
        theme: {
            type: import("vue").PropType<import("./context").ThemeConfig>;
            default: import("./context").ThemeConfig;
        };
        select: {
            type: import("vue").PropType<{
                showSearch?: boolean;
            }>;
            default: {
                showSearch?: boolean;
            };
        };
        wave: {
            type: import("vue").PropType<{
                disabled?: boolean;
            }>;
            default: {
                disabled?: boolean;
            };
        };
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        input: {
            autocomplete?: string;
        };
        select: {
            showSearch?: boolean;
        };
        form: {
            validateMessages?: ValidateMessages;
            requiredMark?: import("../form/Form").RequiredMark;
            colon?: boolean;
        };
        csp: import("./context").CSPConfig;
        direction: "rtl" | "ltr";
        space: {
            size?: number | import("./context").SizeType;
        };
        theme: import("./context").ThemeConfig;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        wave: {
            disabled?: boolean;
        };
        locale: Locale;
        pagination: {
            showSizeChanger?: boolean;
        };
        autoInsertSpaceInButton: boolean;
        pageHeader: {
            ghost?: boolean;
        };
        componentDisabled: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<import("vue").ExtractPropTypes<{
    iconPrefixCls: StringConstructor;
    getTargetContainer: {
        type: import("vue").PropType<() => Window | HTMLElement>;
    };
    getPopupContainer: {
        type: import("vue").PropType<(triggerNode?: HTMLElement) => HTMLElement>;
    };
    prefixCls: StringConstructor;
    getPrefixCls: {
        type: import("vue").PropType<(suffixCls?: string, customizePrefixCls?: string) => string>;
    };
    renderEmpty: {
        type: import("vue").PropType<typeof defaultRenderEmpty>;
    };
    transformCellText: {
        type: import("vue").PropType<(tableProps: import("../table/interface").TransformCellTextProps) => any>;
    };
    csp: {
        type: import("vue").PropType<import("./context").CSPConfig>;
        default: import("./context").CSPConfig;
    };
    input: {
        type: import("vue").PropType<{
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
        type: import("vue").PropType<Locale>;
        default: Locale;
    };
    pageHeader: {
        type: import("vue").PropType<{
            ghost?: boolean;
        }>;
        default: {
            ghost?: boolean;
        };
    };
    componentSize: {
        type: import("vue").PropType<import("./context").SizeType>;
    };
    componentDisabled: {
        type: BooleanConstructor;
        default: any;
    };
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
        default: string;
    };
    space: {
        type: import("vue").PropType<{
            size?: number | import("./context").SizeType;
        }>;
        default: {
            size?: number | import("./context").SizeType;
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
        type: import("vue").PropType<{
            validateMessages?: ValidateMessages;
            requiredMark?: import("../form/Form").RequiredMark;
            colon?: boolean;
        }>;
        default: {
            validateMessages?: ValidateMessages;
            requiredMark?: import("../form/Form").RequiredMark;
            colon?: boolean;
        };
    };
    pagination: {
        type: import("vue").PropType<{
            showSizeChanger?: boolean;
        }>;
        default: {
            showSizeChanger?: boolean;
        };
    };
    theme: {
        type: import("vue").PropType<import("./context").ThemeConfig>;
        default: import("./context").ThemeConfig;
    };
    select: {
        type: import("vue").PropType<{
            showSearch?: boolean;
        }>;
        default: {
            showSearch?: boolean;
        };
    };
    wave: {
        type: import("vue").PropType<{
            disabled?: boolean;
        }>;
        default: {
            disabled?: boolean;
        };
    };
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    input: {
        autocomplete?: string;
    };
    select: {
        showSearch?: boolean;
    };
    form: {
        validateMessages?: ValidateMessages;
        requiredMark?: import("../form/Form").RequiredMark;
        colon?: boolean;
    };
    csp: import("./context").CSPConfig;
    direction: "rtl" | "ltr";
    space: {
        size?: number | import("./context").SizeType;
    };
    theme: import("./context").ThemeConfig;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    wave: {
        disabled?: boolean;
    };
    locale: Locale;
    pagination: {
        showSizeChanger?: boolean;
    };
    autoInsertSpaceInButton: boolean;
    pageHeader: {
        ghost?: boolean;
    };
    componentDisabled: boolean;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly config: typeof setGlobalConfig;
};
export default _default;
