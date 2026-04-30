import type { Plugin, ExtractPropTypes } from 'vue';
import type { BaseSelectRef } from '../vc-select';
import { Option, OptGroup } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-select/Select';
import type { OptionProps } from '../vc-select/Option';
import type { SizeType } from '../config-provider';
import type { CustomSlotsType } from '../_util/type';
type RawValue = string | number;
export type OptionType = typeof Option;
export type { OptionProps, BaseSelectRef as RefSelectProps, BaseOptionType, DefaultOptionType };
export interface LabeledValue {
    key?: string;
    value: RawValue;
    label?: any;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined;
export declare const selectProps: () => {
    value: {
        type: import("vue").PropType<SelectValue>;
        default: SelectValue;
    };
    defaultValue: {
        type: import("vue").PropType<SelectValue>;
        default: SelectValue;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    itemIcon: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    mode: {
        type: import("vue").PropType<"multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE">;
        default: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    transitionName: StringConstructor;
    choiceTransitionName: {
        type: import("vue").PropType<"">;
        default: "";
    };
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    placement: {
        type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    'onUpdate:value': {
        type: import("vue").PropType<(val: SelectValue) => void>;
        default: (val: SelectValue) => void;
    };
    children: import("vue").PropType<import("../_util/type").VueNode[]>;
    listHeight: NumberConstructor;
    onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
    onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
    tabindex: NumberConstructor;
    onClick: import("vue").PropType<(e: MouseEvent) => void>;
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onChange: import("vue").PropType<(value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => void>;
    onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
    onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
    onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
    onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    dropdownMatchSelectWidth: {
        type: import("vue").PropType<number | boolean>;
        default: any;
    };
    options: import("vue").PropType<DefaultOptionType[]>;
    showAction: {
        type: import("vue").PropType<("click" | "focus")[]>;
    };
    onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
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
    onSearch: import("vue").PropType<(value: string) => void>;
    fieldNames: import("vue").PropType<import("../vc-select/Select").FieldNames>;
    dropdownStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
    };
    dropdownRender: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    searchValue: StringConstructor;
    onInputKeyDown: import("vue").PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: import("vue").PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: import("vue").PropType<string[]>;
    };
    tagRender: {
        type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: import("vue").PropType<(option: Record<string, any>) => any>;
    };
    onClear: import("vue").PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: {
        type: import("vue").PropType<(open: boolean) => void>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterOption: {
        type: import("vue").PropType<boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>>;
        default: any;
    };
    filterSort: import("vue").PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    optionLabelProp: StringConstructor;
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
};
export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;
export declare const SelectOption: any;
export declare const SelectOptGroup: any;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        value: {
            type: import("vue").PropType<SelectValue>;
            default: SelectValue;
        };
        defaultValue: {
            type: import("vue").PropType<SelectValue>;
            default: SelectValue;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        itemIcon: import("vue-types").VueTypeValidableDef<any>;
        size: {
            type: import("vue").PropType<SizeType>;
            default: SizeType;
        };
        mode: {
            type: import("vue").PropType<"multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE">;
            default: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        transitionName: StringConstructor;
        choiceTransitionName: {
            type: import("vue").PropType<"">;
            default: "";
        };
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        placement: {
            type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        'onUpdate:value': {
            type: import("vue").PropType<(val: SelectValue) => void>;
            default: (val: SelectValue) => void;
        };
        children: import("vue").PropType<import("../_util/type").VueNode[]>;
        listHeight: NumberConstructor;
        onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
        onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
        tabindex: NumberConstructor;
        onClick: import("vue").PropType<(e: MouseEvent) => void>;
        onFocus: {
            type: import("vue").PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: import("vue").PropType<(e: FocusEvent) => void>;
        };
        onChange: import("vue").PropType<(value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => void>;
        onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
        onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
        onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
        onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        id: StringConstructor;
        autofocus: BooleanConstructor;
        getPopupContainer: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        virtual: {
            type: BooleanConstructor;
            default: any;
        };
        dropdownMatchSelectWidth: {
            type: import("vue").PropType<number | boolean>;
            default: any;
        };
        options: import("vue").PropType<DefaultOptionType[]>;
        showAction: {
            type: import("vue").PropType<("click" | "focus")[]>;
        };
        onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
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
        onSearch: import("vue").PropType<(value: string) => void>;
        fieldNames: import("vue").PropType<import("../vc-select/Select").FieldNames>;
        dropdownStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
        };
        dropdownRender: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        showSearch: {
            type: BooleanConstructor;
            default: any;
        };
        searchValue: StringConstructor;
        onInputKeyDown: import("vue").PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: import("vue").PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tokenSeparators: {
            type: import("vue").PropType<string[]>;
        };
        tagRender: {
            type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        optionLabelRender: {
            type: import("vue").PropType<(option: Record<string, any>) => any>;
        };
        onClear: import("vue").PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: {
            type: import("vue").PropType<(open: boolean) => void>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
        menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        filterOption: {
            type: import("vue").PropType<boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>>;
            default: any;
        };
        filterSort: import("vue").PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
        optionFilterProp: StringConstructor;
        optionLabelProp: StringConstructor;
        defaultActiveFirstOption: {
            type: BooleanConstructor;
            default: any;
        };
        labelInValue: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: SizeType;
        value: SelectValue;
        mode: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
        open: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        status: "" | "error" | "warning";
        defaultValue: SelectValue;
        'onUpdate:value': (val: SelectValue) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        showSearch: boolean;
        choiceTransitionName: "";
        defaultOpen: boolean;
        showArrow: boolean;
        autoClearSearchValue: boolean;
        filterOption: boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>;
        defaultActiveFirstOption: boolean;
        labelInValue: boolean;
    }, true, {}, CustomSlotsType<{
        notFoundContent: any;
        suffixIcon: any;
        itemIcon: any;
        removeIcon: any;
        clearIcon: any;
        dropdownRender: any;
        option: any;
        placeholder: any;
        tagRender: any;
        maxTagPlaceholder: any;
        optionLabel: any;
        default: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        value: {
            type: import("vue").PropType<SelectValue>;
            default: SelectValue;
        };
        defaultValue: {
            type: import("vue").PropType<SelectValue>;
            default: SelectValue;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        itemIcon: import("vue-types").VueTypeValidableDef<any>;
        size: {
            type: import("vue").PropType<SizeType>;
            default: SizeType;
        };
        mode: {
            type: import("vue").PropType<"multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE">;
            default: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        transitionName: StringConstructor;
        choiceTransitionName: {
            type: import("vue").PropType<"">;
            default: "";
        };
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        placement: {
            type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        'onUpdate:value': {
            type: import("vue").PropType<(val: SelectValue) => void>;
            default: (val: SelectValue) => void;
        };
        children: import("vue").PropType<import("../_util/type").VueNode[]>;
        listHeight: NumberConstructor;
        onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
        onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
        tabindex: NumberConstructor;
        onClick: import("vue").PropType<(e: MouseEvent) => void>;
        onFocus: {
            type: import("vue").PropType<(e: FocusEvent) => void>;
        };
        onBlur: {
            type: import("vue").PropType<(e: FocusEvent) => void>;
        };
        onChange: import("vue").PropType<(value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => void>;
        onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
        onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
        onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
        onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
        };
        disabled: {
            type: BooleanConstructor;
            default: any;
        };
        prefixCls: StringConstructor;
        id: StringConstructor;
        autofocus: BooleanConstructor;
        getPopupContainer: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        virtual: {
            type: BooleanConstructor;
            default: any;
        };
        dropdownMatchSelectWidth: {
            type: import("vue").PropType<number | boolean>;
            default: any;
        };
        options: import("vue").PropType<DefaultOptionType[]>;
        showAction: {
            type: import("vue").PropType<("click" | "focus")[]>;
        };
        onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
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
        onSearch: import("vue").PropType<(value: string) => void>;
        fieldNames: import("vue").PropType<import("../vc-select/Select").FieldNames>;
        dropdownStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
        };
        dropdownRender: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        showSearch: {
            type: BooleanConstructor;
            default: any;
        };
        searchValue: StringConstructor;
        onInputKeyDown: import("vue").PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: import("vue").PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tokenSeparators: {
            type: import("vue").PropType<string[]>;
        };
        tagRender: {
            type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        optionLabelRender: {
            type: import("vue").PropType<(option: Record<string, any>) => any>;
        };
        onClear: import("vue").PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: {
            type: import("vue").PropType<(open: boolean) => void>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
        menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        filterOption: {
            type: import("vue").PropType<boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>>;
            default: any;
        };
        filterSort: import("vue").PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
        optionFilterProp: StringConstructor;
        optionLabelProp: StringConstructor;
        defaultActiveFirstOption: {
            type: BooleanConstructor;
            default: any;
        };
        labelInValue: {
            type: BooleanConstructor;
            default: any;
        };
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: SizeType;
        value: SelectValue;
        mode: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
        open: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        status: "" | "error" | "warning";
        defaultValue: SelectValue;
        'onUpdate:value': (val: SelectValue) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        showSearch: boolean;
        choiceTransitionName: "";
        defaultOpen: boolean;
        showArrow: boolean;
        autoClearSearchValue: boolean;
        filterOption: boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>;
        defaultActiveFirstOption: boolean;
        labelInValue: boolean;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    value: {
        type: import("vue").PropType<SelectValue>;
        default: SelectValue;
    };
    defaultValue: {
        type: import("vue").PropType<SelectValue>;
        default: SelectValue;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    itemIcon: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    mode: {
        type: import("vue").PropType<"multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE">;
        default: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    transitionName: StringConstructor;
    choiceTransitionName: {
        type: import("vue").PropType<"">;
        default: "";
    };
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    placement: {
        type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    'onUpdate:value': {
        type: import("vue").PropType<(val: SelectValue) => void>;
        default: (val: SelectValue) => void;
    };
    children: import("vue").PropType<import("../_util/type").VueNode[]>;
    listHeight: NumberConstructor;
    onMouseenter: import("vue").PropType<(e: MouseEvent) => void>;
    onMouseleave: import("vue").PropType<(e: MouseEvent) => void>;
    tabindex: NumberConstructor;
    onClick: import("vue").PropType<(e: MouseEvent) => void>;
    onFocus: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onBlur: {
        type: import("vue").PropType<(e: FocusEvent) => void>;
    };
    onChange: import("vue").PropType<(value: SelectValue, option: DefaultOptionType | DefaultOptionType[]) => void>;
    onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
    onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
    onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
    onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    prefixCls: StringConstructor;
    id: StringConstructor;
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    dropdownMatchSelectWidth: {
        type: import("vue").PropType<number | boolean>;
        default: any;
    };
    options: import("vue").PropType<DefaultOptionType[]>;
    showAction: {
        type: import("vue").PropType<("click" | "focus")[]>;
    };
    onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<RawValue | LabeledValue, DefaultOptionType>>;
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
    onSearch: import("vue").PropType<(value: string) => void>;
    fieldNames: import("vue").PropType<import("../vc-select/Select").FieldNames>;
    dropdownStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
    };
    dropdownRender: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    searchValue: StringConstructor;
    onInputKeyDown: import("vue").PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: import("vue").PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: import("vue").PropType<string[]>;
    };
    tagRender: {
        type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: import("vue").PropType<(option: Record<string, any>) => any>;
    };
    onClear: import("vue").PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: {
        type: import("vue").PropType<(open: boolean) => void>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterOption: {
        type: import("vue").PropType<boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>>;
        default: any;
    };
    filterSort: import("vue").PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    optionLabelProp: StringConstructor;
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: SizeType;
    value: SelectValue;
    mode: "multiple" | "tags" | "SECRET_COMBOBOX_MODE_DO_NOT_USE";
    open: boolean;
    disabled: boolean;
    autofocus: boolean;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    status: "" | "error" | "warning";
    defaultValue: SelectValue;
    'onUpdate:value': (val: SelectValue) => void;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    loading: boolean;
    bordered: boolean;
    allowClear: boolean;
    showSearch: boolean;
    choiceTransitionName: "";
    defaultOpen: boolean;
    showArrow: boolean;
    autoClearSearchValue: boolean;
    filterOption: boolean | import("../vc-select/Select").FilterFunc<DefaultOptionType>;
    defaultActiveFirstOption: boolean;
    labelInValue: boolean;
}, {}, string, CustomSlotsType<{
    notFoundContent: any;
    suffixIcon: any;
    itemIcon: any;
    removeIcon: any;
    clearIcon: any;
    dropdownRender: any;
    option: any;
    placeholder: any;
    tagRender: any;
    maxTagPlaceholder: any;
    optionLabel: any;
    default: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & Plugin<any[]> & {
    readonly Option: typeof Option;
    readonly OptGroup: typeof OptGroup;
    readonly SECRET_COMBOBOX_MODE_DO_NOT_USE: 'SECRET_COMBOBOX_MODE_DO_NOT_USE';
};
export default _default;
