import type { SizeType } from '../context';
declare const _default: (name: string, props: Record<any, any>) => {
    configProvider: import("../context").ConfigProviderInnerProps;
    prefixCls: import("vue").ComputedRef<string>;
    direction: import("vue").ComputedRef<any>;
    size: import("vue").ComputedRef<"small" | "large" | "middle">;
    getTargetContainer: import("vue").ComputedRef<any>;
    getPopupContainer: import("vue").ComputedRef<any>;
    space: import("vue").ComputedRef<{
        size?: number | SizeType;
    }>;
    pageHeader: import("vue").ComputedRef<{
        ghost?: boolean;
    }>;
    form: import("vue").ComputedRef<{
        validateMessages?: import("../../form/interface").ValidateMessages;
        requiredMark?: import("../../form/Form").RequiredMark;
        colon?: boolean;
    }>;
    autoInsertSpaceInButton: import("vue").ComputedRef<boolean>;
    renderEmpty: (name?: string) => import("../../_util/type").VueNode;
    virtual: import("vue").ComputedRef<boolean>;
    dropdownMatchSelectWidth: import("vue").ComputedRef<number | boolean>;
    rootPrefixCls: import("vue").ComputedRef<string>;
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => string;
    autocomplete: import("vue").ComputedRef<any>;
    csp: import("vue").ComputedRef<any>;
    iconPrefixCls: import("vue").ComputedRef<any>;
    disabled: import("vue").ComputedRef<boolean>;
    select: import("vue").ComputedRef<{
        showSearch?: boolean;
    }>;
    wave: import("vue").ComputedRef<{
        disabled?: boolean;
    }>;
};
export default _default;
