import type { ShowSearchType, FieldNames, BaseOptionType, DefaultOptionType } from '../vc-cascader';
import { SHOW_CHILD, SHOW_PARENT } from '../vc-cascader';
import type { VueNode } from '../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
import type { ValueType } from '../vc-cascader/Cascader';
export type { BaseOptionType, DefaultOptionType, ShowSearchType };
export type FieldNamesType = FieldNames;
export type FilledFieldNamesType = Required<FieldNamesType>;
export interface CascaderOptionType extends DefaultOptionType {
    isLeaf?: boolean;
    loading?: boolean;
    children?: CascaderOptionType[];
    [key: string]: any;
}
export declare function cascaderProps<DataNodeType extends CascaderOptionType = CascaderOptionType>(): {
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    size: PropType<SizeType>;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    placement: {
        type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
    };
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    status: PropType<"" | "error" | "warning">;
    options: PropType<DataNodeType[]>;
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    'onUpdate:value': PropType<(value: ValueType) => void>;
    value: {
        type: PropType<ValueType>;
    };
    children: PropType<VueNode[]>;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    tabindex: NumberConstructor;
    onClick: PropType<(e: MouseEvent) => void>;
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onChange: PropType<(value: ValueType, selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    defaultValue: {
        type: PropType<ValueType>;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    onPopupVisibleChange: PropType<(open: boolean) => void>;
    popupStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    popupPlacement: PropType<import("../vc-select/BaseSelect").Placement>;
    popupVisible: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    expandIcon: import("vue-types").VueTypeValidableDef<any>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    onSearch: PropType<(value: string) => void>;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: {
        type: PropType<FieldNames>;
        default: FieldNames;
    };
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    loadData: PropType<(selectOptions: DefaultOptionType[]) => void>;
    showSearch: {
        type: PropType<boolean | ShowSearchType<DefaultOptionType>>;
        default: boolean | ShowSearchType<DefaultOptionType>;
    };
    searchValue: StringConstructor;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: PropType<(open: boolean) => void>;
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
    changeOnSelect: {
        type: BooleanConstructor;
        default: any;
    };
    displayRender: PropType<(opt: {
        labels: string[];
        selectedOptions?: DefaultOptionType[];
    }) => any>;
    showCheckedStrategy: {
        type: PropType<import("../vc-cascader/Cascader").ShowCheckedStrategy>;
        default: string;
    };
    expandTrigger: PropType<"click" | "hover">;
    dropdownPrefixCls: StringConstructor;
    dropdownMenuColumnStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    loadingIcon: import("vue-types").VueTypeValidableDef<any>;
};
export type CascaderProps = Partial<ExtractPropTypes<ReturnType<typeof cascaderProps>>>;
export interface CascaderRef {
    focus: () => void;
    blur: () => void;
}
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        multiple: {
            type: BooleanConstructor;
            default: any;
        };
        size: PropType<SizeType>;
        bordered: {
            type: BooleanConstructor;
            default: any;
        };
        placement: {
            type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        };
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        status: PropType<"" | "error" | "warning">;
        options: PropType<CascaderOptionType[]>;
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        'onUpdate:value': PropType<(value: ValueType) => void>;
        value: {
            type: PropType<ValueType>;
        };
        children: PropType<VueNode[]>;
        onMouseenter: PropType<(e: MouseEvent) => void>;
        onMouseleave: PropType<(e: MouseEvent) => void>;
        tabindex: NumberConstructor;
        onClick: PropType<(e: MouseEvent) => void>;
        onFocus: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onChange: PropType<(value: ValueType, selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => void>;
        onKeydown: PropType<(e: KeyboardEvent) => void>;
        onKeyup: PropType<(e: KeyboardEvent) => void>;
        onMousedown: PropType<(e: MouseEvent) => void>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: PropType<"rtl" | "ltr">;
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        id: StringConstructor;
        autofocus: BooleanConstructor;
        getPopupContainer: {
            type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        dropdownMatchSelectWidth: {
            type: PropType<number | boolean>;
            default: any;
        };
        defaultValue: {
            type: PropType<ValueType>;
        };
        showAction: {
            type: PropType<("click" | "focus")[]>;
        };
        onPopupVisibleChange: PropType<(open: boolean) => void>;
        popupStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        popupPlacement: PropType<import("../vc-select/BaseSelect").Placement>;
        popupVisible: {
            type: BooleanConstructor;
            default: any;
        };
        transitionName: StringConstructor;
        expandIcon: import("vue-types").VueTypeValidableDef<any>;
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        clearIcon: import("vue-types").VueTypeValidableDef<any>;
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        onSearch: PropType<(value: string) => void>;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: {
            type: PropType<FieldNames>;
            default: FieldNames;
        };
        dropdownStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        dropdownRender: {
            type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
        loadData: PropType<(selectOptions: DefaultOptionType[]) => void>;
        showSearch: {
            type: PropType<boolean | ShowSearchType<DefaultOptionType>>;
            default: boolean | ShowSearchType<DefaultOptionType>;
        };
        searchValue: StringConstructor;
        onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tagRender: {
            type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        choiceTransitionName: StringConstructor;
        optionLabelRender: {
            type: PropType<(option: Record<string, any>) => any>;
        };
        onClear: PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: PropType<(open: boolean) => void>;
        getInputElement: {
            type: PropType<() => any>;
        };
        getRawInputElement: {
            type: PropType<() => any>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        inputIcon: import("vue-types").VueTypeValidableDef<any>;
        onPopupScroll: PropType<(e: UIEvent) => void>;
        changeOnSelect: {
            type: BooleanConstructor;
            default: any;
        };
        displayRender: PropType<(opt: {
            labels: string[];
            selectedOptions?: DefaultOptionType[];
        }) => any>;
        showCheckedStrategy: {
            type: PropType<import("../vc-cascader/Cascader").ShowCheckedStrategy>;
            default: string;
        };
        expandTrigger: PropType<"click" | "hover">;
        dropdownPrefixCls: StringConstructor;
        dropdownMenuColumnStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        loadingIcon: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        open: boolean;
        multiple: boolean;
        disabled: boolean;
        autofocus: boolean;
        dropdownMatchSelectWidth: number | boolean;
        popupStyle: import("vue").CSSProperties;
        popupVisible: boolean;
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        fieldNames: FieldNames;
        dropdownStyle: import("vue").CSSProperties;
        showSearch: boolean | ShowSearchType<DefaultOptionType>;
        defaultOpen: boolean;
        showArrow: boolean;
        changeOnSelect: boolean;
        showCheckedStrategy: import("../vc-cascader/Cascader").ShowCheckedStrategy;
        dropdownMenuColumnStyle: import("vue").CSSProperties;
    }, true, {}, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        multiple: {
            type: BooleanConstructor;
            default: any;
        };
        size: PropType<SizeType>;
        bordered: {
            type: BooleanConstructor;
            default: any;
        };
        placement: {
            type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        };
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        status: PropType<"" | "error" | "warning">;
        options: PropType<CascaderOptionType[]>;
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        'onUpdate:value': PropType<(value: ValueType) => void>;
        value: {
            type: PropType<ValueType>;
        };
        children: PropType<VueNode[]>;
        onMouseenter: PropType<(e: MouseEvent) => void>;
        onMouseleave: PropType<(e: MouseEvent) => void>;
        tabindex: NumberConstructor;
        onClick: PropType<(e: MouseEvent) => void>;
        onFocus: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: PropType<(e: FocusEvent) => void>;
        };
        onChange: PropType<(value: ValueType, selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => void>;
        onKeydown: PropType<(e: KeyboardEvent) => void>;
        onKeyup: PropType<(e: KeyboardEvent) => void>;
        onMousedown: PropType<(e: MouseEvent) => void>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: PropType<"rtl" | "ltr">;
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        id: StringConstructor;
        autofocus: BooleanConstructor;
        getPopupContainer: {
            type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        dropdownMatchSelectWidth: {
            type: PropType<number | boolean>;
            default: any;
        };
        defaultValue: {
            type: PropType<ValueType>;
        };
        showAction: {
            type: PropType<("click" | "focus")[]>;
        };
        onPopupVisibleChange: PropType<(open: boolean) => void>;
        popupStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        popupPlacement: PropType<import("../vc-select/BaseSelect").Placement>;
        popupVisible: {
            type: BooleanConstructor;
            default: any;
        };
        transitionName: StringConstructor;
        expandIcon: import("vue-types").VueTypeValidableDef<any>;
        loading: {
            type: BooleanConstructor;
            default: any;
        };
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        clearIcon: import("vue-types").VueTypeValidableDef<any>;
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        onSearch: PropType<(value: string) => void>;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: {
            type: PropType<FieldNames>;
            default: FieldNames;
        };
        dropdownStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        dropdownRender: {
            type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
        loadData: PropType<(selectOptions: DefaultOptionType[]) => void>;
        showSearch: {
            type: PropType<boolean | ShowSearchType<DefaultOptionType>>;
            default: boolean | ShowSearchType<DefaultOptionType>;
        };
        searchValue: StringConstructor;
        onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tagRender: {
            type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        choiceTransitionName: StringConstructor;
        optionLabelRender: {
            type: PropType<(option: Record<string, any>) => any>;
        };
        onClear: PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: PropType<(open: boolean) => void>;
        getInputElement: {
            type: PropType<() => any>;
        };
        getRawInputElement: {
            type: PropType<() => any>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        inputIcon: import("vue-types").VueTypeValidableDef<any>;
        onPopupScroll: PropType<(e: UIEvent) => void>;
        changeOnSelect: {
            type: BooleanConstructor;
            default: any;
        };
        displayRender: PropType<(opt: {
            labels: string[];
            selectedOptions?: DefaultOptionType[];
        }) => any>;
        showCheckedStrategy: {
            type: PropType<import("../vc-cascader/Cascader").ShowCheckedStrategy>;
            default: string;
        };
        expandTrigger: PropType<"click" | "hover">;
        dropdownPrefixCls: StringConstructor;
        dropdownMenuColumnStyle: {
            type: PropType<import("vue").CSSProperties>;
            default: import("vue").CSSProperties;
        };
        loadingIcon: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => VueNode, {}, {}, {}, {
        open: boolean;
        multiple: boolean;
        disabled: boolean;
        autofocus: boolean;
        dropdownMatchSelectWidth: number | boolean;
        popupStyle: import("vue").CSSProperties;
        popupVisible: boolean;
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        fieldNames: FieldNames;
        dropdownStyle: import("vue").CSSProperties;
        showSearch: boolean | ShowSearchType<DefaultOptionType>;
        defaultOpen: boolean;
        showArrow: boolean;
        changeOnSelect: boolean;
        showCheckedStrategy: import("../vc-cascader/Cascader").ShowCheckedStrategy;
        dropdownMenuColumnStyle: import("vue").CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    size: PropType<SizeType>;
    bordered: {
        type: BooleanConstructor;
        default: any;
    };
    placement: {
        type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
    };
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    status: PropType<"" | "error" | "warning">;
    options: PropType<CascaderOptionType[]>;
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    'onUpdate:value': PropType<(value: ValueType) => void>;
    value: {
        type: PropType<ValueType>;
    };
    children: PropType<VueNode[]>;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    tabindex: NumberConstructor;
    onClick: PropType<(e: MouseEvent) => void>;
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onChange: PropType<(value: ValueType, selectOptions: DefaultOptionType[] | DefaultOptionType[][]) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    defaultValue: {
        type: PropType<ValueType>;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    onPopupVisibleChange: PropType<(open: boolean) => void>;
    popupStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    popupPlacement: PropType<import("../vc-select/BaseSelect").Placement>;
    popupVisible: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    expandIcon: import("vue-types").VueTypeValidableDef<any>;
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    onSearch: PropType<(value: string) => void>;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: {
        type: PropType<FieldNames>;
        default: FieldNames;
    };
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    loadData: PropType<(selectOptions: DefaultOptionType[]) => void>;
    showSearch: {
        type: PropType<boolean | ShowSearchType<DefaultOptionType>>;
        default: boolean | ShowSearchType<DefaultOptionType>;
    };
    searchValue: StringConstructor;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: PropType<(open: boolean) => void>;
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
    changeOnSelect: {
        type: BooleanConstructor;
        default: any;
    };
    displayRender: PropType<(opt: {
        labels: string[];
        selectedOptions?: DefaultOptionType[];
    }) => any>;
    showCheckedStrategy: {
        type: PropType<import("../vc-cascader/Cascader").ShowCheckedStrategy>;
        default: string;
    };
    expandTrigger: PropType<"click" | "hover">;
    dropdownPrefixCls: StringConstructor;
    dropdownMenuColumnStyle: {
        type: PropType<import("vue").CSSProperties>;
        default: import("vue").CSSProperties;
    };
    loadingIcon: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    open: boolean;
    multiple: boolean;
    disabled: boolean;
    autofocus: boolean;
    dropdownMatchSelectWidth: number | boolean;
    popupStyle: import("vue").CSSProperties;
    popupVisible: boolean;
    loading: boolean;
    bordered: boolean;
    allowClear: boolean;
    fieldNames: FieldNames;
    dropdownStyle: import("vue").CSSProperties;
    showSearch: boolean | ShowSearchType<DefaultOptionType>;
    defaultOpen: boolean;
    showArrow: boolean;
    changeOnSelect: boolean;
    showCheckedStrategy: import("../vc-cascader/Cascader").ShowCheckedStrategy;
    dropdownMenuColumnStyle: import("vue").CSSProperties;
}, {}, string, {}, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    SHOW_PARENT: typeof SHOW_PARENT;
    SHOW_CHILD: typeof SHOW_CHILD;
} & import("vue").Plugin<any[]>;
export default _default;
