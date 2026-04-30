import type { App, ExtractPropTypes, CSSProperties, PropType } from 'vue';
import type { CustomSlotsType } from '../_util/type';
export declare const autoCompleteProps: () => {
    dataSource: PropType<string[] | {
        value: any;
        text: any;
    }[]>;
    dropdownMenuStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    dropdownMatchSelectWidth: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: boolean;
    };
    prefixCls: StringConstructor;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    choiceTransitionName: {
        type: StringConstructor;
        default: string;
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    backfill: {
        type: BooleanConstructor;
        default: any;
    };
    filterOption: {
        type: (FunctionConstructor | BooleanConstructor)[];
        default: boolean;
    };
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: boolean;
    };
    status: PropType<"" | "error" | "warning">;
    size: {
        type: PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    value: {
        type: PropType<import("../select").SelectValue>;
        default: import("../select").SelectValue;
    };
    children: PropType<import("../_util/type").VueNode[]>;
    listHeight: NumberConstructor;
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
    onChange: PropType<(value: import("../select").SelectValue, option: import("../select").DefaultOptionType | import("../select").DefaultOptionType[]) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    onSelect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
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
    id: StringConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    defaultValue: {
        type: PropType<import("../select").SelectValue>;
        default: import("../select").SelectValue;
    };
    'onUpdate:value': {
        type: PropType<(val: import("../select").SelectValue) => void>;
        default: (val: import("../select").SelectValue) => void;
    };
    options: PropType<import("../select").DefaultOptionType[]>;
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    popupClassName: StringConstructor;
    placement: {
        type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    itemIcon: import("vue-types").VueTypeValidableDef<any>;
    onDeselect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    onSearch: PropType<(value: string) => void>;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: PropType<import("../vc-select/Select").FieldNames>;
    dropdownStyle: {
        type: PropType<CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    searchValue: StringConstructor;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: PropType<(e: UIEvent) => void>;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterSort: PropType<(optionA: import("../select").DefaultOptionType, optionB: import("../select").DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
};
export type AutoCompleteProps = Partial<ExtractPropTypes<ReturnType<typeof autoCompleteProps>>>;
export declare const AutoCompleteOption: import("./Option").OptionFC;
export declare const AutoCompleteOptGroup: import("./OptGroup").OptionGroupFC;
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        dataSource: PropType<string[] | {
            value: any;
            text: any;
        }[]>;
        dropdownMenuStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        dropdownMatchSelectWidth: {
            type: (BooleanConstructor | NumberConstructor)[];
            default: boolean;
        };
        prefixCls: StringConstructor;
        showSearch: {
            type: BooleanConstructor;
            default: any;
        };
        transitionName: StringConstructor;
        choiceTransitionName: {
            type: StringConstructor;
            default: string;
        };
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        backfill: {
            type: BooleanConstructor;
            default: any;
        };
        filterOption: {
            type: (FunctionConstructor | BooleanConstructor)[];
            default: boolean;
        };
        defaultActiveFirstOption: {
            type: BooleanConstructor;
            default: boolean;
        };
        status: PropType<"" | "error" | "warning">;
        size: {
            type: PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        value: {
            type: PropType<import("../select").SelectValue>;
            default: import("../select").SelectValue;
        };
        children: PropType<import("../_util/type").VueNode[]>;
        listHeight: NumberConstructor;
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
        onChange: PropType<(value: import("../select").SelectValue, option: import("../select").DefaultOptionType | import("../select").DefaultOptionType[]) => void>;
        onKeydown: PropType<(e: KeyboardEvent) => void>;
        onKeyup: PropType<(e: KeyboardEvent) => void>;
        onMousedown: PropType<(e: MouseEvent) => void>;
        onSelect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
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
        id: StringConstructor;
        getPopupContainer: {
            type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        virtual: {
            type: BooleanConstructor;
            default: any;
        };
        defaultValue: {
            type: PropType<import("../select").SelectValue>;
            default: import("../select").SelectValue;
        };
        'onUpdate:value': {
            type: PropType<(val: import("../select").SelectValue) => void>;
            default: (val: import("../select").SelectValue) => void;
        };
        options: PropType<import("../select").DefaultOptionType[]>;
        showAction: {
            type: PropType<("click" | "focus")[]>;
        };
        popupClassName: StringConstructor;
        placement: {
            type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        itemIcon: import("vue-types").VueTypeValidableDef<any>;
        onDeselect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        clearIcon: import("vue-types").VueTypeValidableDef<any>;
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        onSearch: PropType<(value: string) => void>;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: PropType<import("../vc-select/Select").FieldNames>;
        dropdownStyle: {
            type: PropType<CSSProperties>;
        };
        dropdownClassName: StringConstructor;
        dropdownRender: {
            type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
        searchValue: StringConstructor;
        onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tokenSeparators: {
            type: PropType<string[]>;
        };
        tagRender: {
            type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        optionLabelRender: {
            type: PropType<(option: Record<string, any>) => any>;
        };
        onClear: PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: {
            type: PropType<(open: boolean) => void>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: PropType<(e: UIEvent) => void>;
        menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        filterSort: PropType<(optionA: import("../select").DefaultOptionType, optionB: import("../select").DefaultOptionType) => number>;
        optionFilterProp: StringConstructor;
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: import("../config-provider").SizeType;
        value: import("../select").SelectValue;
        open: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        defaultValue: import("../select").SelectValue;
        'onUpdate:value': (val: import("../select").SelectValue) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        bordered: boolean;
        allowClear: boolean;
        showSearch: boolean;
        choiceTransitionName: string;
        defaultOpen: boolean;
        showArrow: boolean;
        backfill: boolean;
        autoClearSearchValue: boolean;
        filterOption: boolean | Function;
        defaultActiveFirstOption: boolean;
        dropdownMenuStyle: CSSProperties;
    }, true, {}, CustomSlotsType<{
        option: any;
        options: any;
        default: any;
        notFoundContent: any;
        dataSource: any;
        clearIcon: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        dataSource: PropType<string[] | {
            value: any;
            text: any;
        }[]>;
        dropdownMenuStyle: {
            type: PropType<CSSProperties>;
            default: CSSProperties;
        };
        dropdownMatchSelectWidth: {
            type: (BooleanConstructor | NumberConstructor)[];
            default: boolean;
        };
        prefixCls: StringConstructor;
        showSearch: {
            type: BooleanConstructor;
            default: any;
        };
        transitionName: StringConstructor;
        choiceTransitionName: {
            type: StringConstructor;
            default: string;
        };
        autofocus: {
            type: BooleanConstructor;
            default: any;
        };
        backfill: {
            type: BooleanConstructor;
            default: any;
        };
        filterOption: {
            type: (FunctionConstructor | BooleanConstructor)[];
            default: boolean;
        };
        defaultActiveFirstOption: {
            type: BooleanConstructor;
            default: boolean;
        };
        status: PropType<"" | "error" | "warning">;
        size: {
            type: PropType<import("../config-provider").SizeType>;
            default: import("../config-provider").SizeType;
        };
        value: {
            type: PropType<import("../select").SelectValue>;
            default: import("../select").SelectValue;
        };
        children: PropType<import("../_util/type").VueNode[]>;
        listHeight: NumberConstructor;
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
        onChange: PropType<(value: import("../select").SelectValue, option: import("../select").DefaultOptionType | import("../select").DefaultOptionType[]) => void>;
        onKeydown: PropType<(e: KeyboardEvent) => void>;
        onKeyup: PropType<(e: KeyboardEvent) => void>;
        onMousedown: PropType<(e: MouseEvent) => void>;
        onSelect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
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
        id: StringConstructor;
        getPopupContainer: {
            type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
        };
        virtual: {
            type: BooleanConstructor;
            default: any;
        };
        defaultValue: {
            type: PropType<import("../select").SelectValue>;
            default: import("../select").SelectValue;
        };
        'onUpdate:value': {
            type: PropType<(val: import("../select").SelectValue) => void>;
            default: (val: import("../select").SelectValue) => void;
        };
        options: PropType<import("../select").DefaultOptionType[]>;
        showAction: {
            type: PropType<("click" | "focus")[]>;
        };
        popupClassName: StringConstructor;
        placement: {
            type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        itemIcon: import("vue-types").VueTypeValidableDef<any>;
        onDeselect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
        placeholder: import("vue-types").VueTypeValidableDef<any>;
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        clearIcon: import("vue-types").VueTypeValidableDef<any>;
        allowClear: {
            type: BooleanConstructor;
            default: any;
        };
        onSearch: PropType<(value: string) => void>;
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: PropType<import("../vc-select/Select").FieldNames>;
        dropdownStyle: {
            type: PropType<CSSProperties>;
        };
        dropdownClassName: StringConstructor;
        dropdownRender: {
            type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
        searchValue: StringConstructor;
        onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
        removeIcon: import("vue-types").VueTypeValidableDef<any>;
        maxTagCount: {
            type: PropType<number | "responsive">;
        };
        maxTagTextLength: NumberConstructor;
        maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
        tokenSeparators: {
            type: PropType<string[]>;
        };
        tagRender: {
            type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        optionLabelRender: {
            type: PropType<(option: Record<string, any>) => any>;
        };
        onClear: PropType<() => void>;
        defaultOpen: {
            type: BooleanConstructor;
            default: any;
        };
        onDropdownVisibleChange: {
            type: PropType<(open: boolean) => void>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: PropType<(e: UIEvent) => void>;
        menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        filterSort: PropType<(optionA: import("../select").DefaultOptionType, optionB: import("../select").DefaultOptionType) => number>;
        optionFilterProp: StringConstructor;
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, {
        size: import("../config-provider").SizeType;
        value: import("../select").SelectValue;
        open: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        defaultValue: import("../select").SelectValue;
        'onUpdate:value': (val: import("../select").SelectValue) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        bordered: boolean;
        allowClear: boolean;
        showSearch: boolean;
        choiceTransitionName: string;
        defaultOpen: boolean;
        showArrow: boolean;
        backfill: boolean;
        autoClearSearchValue: boolean;
        filterOption: boolean | Function;
        defaultActiveFirstOption: boolean;
        dropdownMenuStyle: CSSProperties;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    dataSource: PropType<string[] | {
        value: any;
        text: any;
    }[]>;
    dropdownMenuStyle: {
        type: PropType<CSSProperties>;
        default: CSSProperties;
    };
    dropdownMatchSelectWidth: {
        type: (BooleanConstructor | NumberConstructor)[];
        default: boolean;
    };
    prefixCls: StringConstructor;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    choiceTransitionName: {
        type: StringConstructor;
        default: string;
    };
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    backfill: {
        type: BooleanConstructor;
        default: any;
    };
    filterOption: {
        type: (FunctionConstructor | BooleanConstructor)[];
        default: boolean;
    };
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: boolean;
    };
    status: PropType<"" | "error" | "warning">;
    size: {
        type: PropType<import("../config-provider").SizeType>;
        default: import("../config-provider").SizeType;
    };
    value: {
        type: PropType<import("../select").SelectValue>;
        default: import("../select").SelectValue;
    };
    children: PropType<import("../_util/type").VueNode[]>;
    listHeight: NumberConstructor;
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
    onChange: PropType<(value: import("../select").SelectValue, option: import("../select").DefaultOptionType | import("../select").DefaultOptionType[]) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    onSelect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
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
    id: StringConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    defaultValue: {
        type: PropType<import("../select").SelectValue>;
        default: import("../select").SelectValue;
    };
    'onUpdate:value': {
        type: PropType<(val: import("../select").SelectValue) => void>;
        default: (val: import("../select").SelectValue) => void;
    };
    options: PropType<import("../select").DefaultOptionType[]>;
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    popupClassName: StringConstructor;
    placement: {
        type: PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    itemIcon: import("vue-types").VueTypeValidableDef<any>;
    onDeselect: PropType<import("../vc-select/Select").SelectHandler<(string | number) | import("../select").LabeledValue, import("../select").DefaultOptionType>>;
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    onSearch: PropType<(value: string) => void>;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: PropType<import("../vc-select/Select").FieldNames>;
    dropdownStyle: {
        type: PropType<CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    searchValue: StringConstructor;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: PropType<(e: UIEvent) => void>;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterSort: PropType<(optionA: import("../select").DefaultOptionType, optionB: import("../select").DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: import("../config-provider").SizeType;
    value: import("../select").SelectValue;
    open: boolean;
    disabled: boolean;
    autofocus: boolean;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    defaultValue: import("../select").SelectValue;
    'onUpdate:value': (val: import("../select").SelectValue) => void;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    bordered: boolean;
    allowClear: boolean;
    showSearch: boolean;
    choiceTransitionName: string;
    defaultOpen: boolean;
    showArrow: boolean;
    backfill: boolean;
    autoClearSearchValue: boolean;
    filterOption: boolean | Function;
    defaultActiveFirstOption: boolean;
    dropdownMenuStyle: CSSProperties;
}, {}, string, CustomSlotsType<{
    option: any;
    options: any;
    default: any;
    notFoundContent: any;
    dataSource: any;
    clearIcon: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    Option: import("./Option").OptionFC;
    OptGroup: import("./OptGroup").OptionGroupFC;
    install(app: App): App<any>;
};
export default _default;
