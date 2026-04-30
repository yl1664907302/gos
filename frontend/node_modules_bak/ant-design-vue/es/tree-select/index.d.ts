import type { App, ExtractPropTypes } from 'vue';
import type { SizeType } from '../config-provider';
import type { FieldNames, Key } from '../vc-tree-select/interface';
import type { BaseSelectRef } from '../vc-select';
import type { BaseOptionType, DefaultOptionType } from '../vc-tree-select/TreeSelect';
import type { CustomSlotsType } from '../_util/type';
type RawValue = string | number;
export interface LabeledValue {
    key?: string;
    value: RawValue;
    label?: any;
}
export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[];
export type RefTreeSelectProps = BaseSelectRef;
export declare function treeSelectProps<ValueType = any, OptionType extends BaseOptionType | DefaultOptionType = DefaultOptionType>(): {
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    treeLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    replaceFields: {
        type: import("vue").PropType<FieldNames>;
        default: FieldNames;
    };
    placement: {
        type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    'onUpdate:value': {
        type: import("vue").PropType<(value: any) => void>;
        default: (value: any) => void;
    };
    'onUpdate:treeExpandedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:searchValue': {
        type: import("vue").PropType<(value: string) => void>;
        default: (value: string) => void;
    };
    value: {
        type: import("vue").PropType<ValueType>;
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
    onChange: {
        type: import("vue").PropType<(value: ValueType, labelList: any[], extra: import("../vc-tree-select/TreeSelect").ChangeEventExtra) => void>;
    };
    onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
    onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
    onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
    onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
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
    defaultValue: {
        type: import("vue").PropType<ValueType>;
    };
    showAction: {
        type: import("vue").PropType<("click" | "focus")[]>;
    };
    transitionName: StringConstructor;
    onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
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
    onSearch: {
        type: import("vue").PropType<(value: string) => void>;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree-select/TreeSelect").FieldNames>;
    };
    dropdownStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
    };
    dropdownRender: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    loadData: {
        type: import("vue").PropType<(dataNode: import("../vc-tree-select/TreeSelect").LegacyDataNode) => Promise<unknown>>;
    };
    filterTreeNode: {
        type: import("vue").PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
        default: any;
    };
    treeData: {
        type: import("vue").PropType<OptionType[]>;
    };
    treeCheckable: {
        type: BooleanConstructor;
        default: any;
    };
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
    maxTagPlaceholder: {
        type: import("vue").PropType<(omittedValues: import("../vc-select/BaseSelect").DisplayValueType[]) => any>;
    };
    tokenSeparators: {
        type: import("vue").PropType<string[]>;
    };
    tagRender: {
        type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
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
    getRawInputElement: {
        type: import("vue").PropType<() => any>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    showCheckedStrategy: {
        type: import("vue").PropType<import("../vc-tree-select/utils/strategyUtil").CheckedStrategy>;
    };
    treeExpandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
    treeDefaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    treeIcon: import("vue-types").VueTypeValidableDef<any>;
    treeLoadedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onTreeLoad: {
        type: import("vue").PropType<(loadedKeys: Key[]) => void>;
    };
    treeNodeFilterProp: StringConstructor;
    treeNodeLabelProp: StringConstructor;
    treeCheckStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    treeDataSimpleMode: {
        type: import("vue").PropType<boolean | import("../vc-tree-select/TreeSelect").SimpleModeConfig>;
        default: any;
    };
    treeExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    treeDefaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onTreeExpand: {
        type: import("vue").PropType<(expandedKeys: Key[]) => void>;
    };
    dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
};
export type TreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof treeSelectProps>>>;
export declare const TreeSelectNode: import("vue").FunctionalComponent<import("../vc-tree-select/TreeNode").TreeNodeProps, {}, any, {}> & {
    isTreeSelectNode: boolean;
};
declare const _default: {
    new (...args: any[]): import("vue").CreateComponentPublicInstanceWithMixins<Readonly<ExtractPropTypes<{
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        size: {
            type: import("vue").PropType<SizeType>;
            default: SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        treeLine: {
            type: import("vue").PropType<boolean | {
                showLeafIcon: boolean;
            }>;
            default: boolean | {
                showLeafIcon: boolean;
            };
        };
        replaceFields: {
            type: import("vue").PropType<FieldNames>;
            default: FieldNames;
        };
        placement: {
            type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        'onUpdate:value': {
            type: import("vue").PropType<(value: any) => void>;
            default: (value: any) => void;
        };
        'onUpdate:treeExpandedKeys': {
            type: import("vue").PropType<(keys: Key[]) => void>;
            default: (keys: Key[]) => void;
        };
        'onUpdate:searchValue': {
            type: import("vue").PropType<(value: string) => void>;
            default: (value: string) => void;
        };
        value: {
            type: import("vue").PropType<any>;
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
        onChange: {
            type: import("vue").PropType<(value: any, labelList: any[], extra: import("../vc-tree-select/TreeSelect").ChangeEventExtra) => void>;
        };
        onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
        onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
        onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
        onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
        };
        multiple: {
            type: BooleanConstructor;
            default: any;
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
        defaultValue: {
            type: import("vue").PropType<any>;
        };
        showAction: {
            type: import("vue").PropType<("click" | "focus")[]>;
        };
        transitionName: StringConstructor;
        onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
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
        onSearch: {
            type: import("vue").PropType<(value: string) => void>;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree-select/TreeSelect").FieldNames>;
        };
        dropdownStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
        };
        dropdownRender: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        switcherIcon: import("vue-types").VueTypeValidableDef<any>;
        loadData: {
            type: import("vue").PropType<(dataNode: import("../vc-tree-select/TreeSelect").LegacyDataNode) => Promise<unknown>>;
        };
        filterTreeNode: {
            type: import("vue").PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
            default: any;
        };
        treeData: {
            type: import("vue").PropType<DefaultOptionType[]>;
        };
        treeCheckable: {
            type: BooleanConstructor;
            default: any;
        };
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
        maxTagPlaceholder: {
            type: import("vue").PropType<(omittedValues: import("../vc-select/BaseSelect").DisplayValueType[]) => any>;
        };
        tokenSeparators: {
            type: import("vue").PropType<string[]>;
        };
        tagRender: {
            type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        choiceTransitionName: StringConstructor;
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
        getRawInputElement: {
            type: import("vue").PropType<() => any>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        labelInValue: {
            type: BooleanConstructor;
            default: any;
        };
        showCheckedStrategy: {
            type: import("vue").PropType<import("../vc-tree-select/utils/strategyUtil").CheckedStrategy>;
        };
        treeExpandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
        treeDefaultExpandAll: {
            type: BooleanConstructor;
            default: any;
        };
        treeIcon: import("vue-types").VueTypeValidableDef<any>;
        treeLoadedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        onTreeLoad: {
            type: import("vue").PropType<(loadedKeys: Key[]) => void>;
        };
        treeNodeFilterProp: StringConstructor;
        treeNodeLabelProp: StringConstructor;
        treeCheckStrictly: {
            type: BooleanConstructor;
            default: any;
        };
        treeDataSimpleMode: {
            type: import("vue").PropType<boolean | import("../vc-tree-select/TreeSelect").SimpleModeConfig>;
            default: any;
        };
        treeExpandedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        treeDefaultExpandedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        onTreeExpand: {
            type: import("vue").PropType<(expandedKeys: Key[]) => void>;
        };
        dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, import("vue").PublicProps, {
        size: SizeType;
        open: boolean;
        multiple: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        status: "" | "error" | "warning";
        'onUpdate:value': (value: any) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        filterTreeNode: boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean);
        replaceFields: FieldNames;
        treeCheckable: boolean;
        showSearch: boolean;
        defaultOpen: boolean;
        showArrow: boolean;
        autoClearSearchValue: boolean;
        labelInValue: boolean;
        treeDefaultExpandAll: boolean;
        treeLine: boolean | {
            showLeafIcon: boolean;
        };
        treeCheckStrictly: boolean;
        treeDataSimpleMode: any;
        'onUpdate:treeExpandedKeys': (keys: Key[]) => void;
        'onUpdate:searchValue': (value: string) => void;
    }, true, {}, CustomSlotsType<{
        title?: any;
        titleRender?: any;
        placeholder?: any;
        maxTagPlaceholder?: any;
        treeIcon?: any;
        switcherIcon?: any;
        notFoundContent?: any;
        default?: any;
        leafIcon?: any;
        tagRender?: any;
        suffixIcon?: any;
    }>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, {}, any, import("vue").ComponentProvideOptions, {
        P: {};
        B: {};
        D: {};
        C: {};
        M: {};
        Defaults: {};
    }, Readonly<ExtractPropTypes<{
        suffixIcon: import("vue-types").VueTypeValidableDef<any>;
        size: {
            type: import("vue").PropType<SizeType>;
            default: SizeType;
        };
        bordered: {
            type: BooleanConstructor;
            default: boolean;
        };
        treeLine: {
            type: import("vue").PropType<boolean | {
                showLeafIcon: boolean;
            }>;
            default: boolean | {
                showLeafIcon: boolean;
            };
        };
        replaceFields: {
            type: import("vue").PropType<FieldNames>;
            default: FieldNames;
        };
        placement: {
            type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
            default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        };
        status: {
            type: import("vue").PropType<"" | "error" | "warning">;
            default: "" | "error" | "warning";
        };
        popupClassName: StringConstructor;
        /** @deprecated Please use `popupClassName` instead */
        dropdownClassName: StringConstructor;
        'onUpdate:value': {
            type: import("vue").PropType<(value: any) => void>;
            default: (value: any) => void;
        };
        'onUpdate:treeExpandedKeys': {
            type: import("vue").PropType<(keys: Key[]) => void>;
            default: (keys: Key[]) => void;
        };
        'onUpdate:searchValue': {
            type: import("vue").PropType<(value: string) => void>;
            default: (value: string) => void;
        };
        value: {
            type: import("vue").PropType<any>;
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
        onChange: {
            type: import("vue").PropType<(value: any, labelList: any[], extra: import("../vc-tree-select/TreeSelect").ChangeEventExtra) => void>;
        };
        onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
        onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
        onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
        onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
        open: {
            type: BooleanConstructor;
            default: any;
        };
        animation: StringConstructor;
        direction: {
            type: import("vue").PropType<"rtl" | "ltr">;
        };
        multiple: {
            type: BooleanConstructor;
            default: any;
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
        defaultValue: {
            type: import("vue").PropType<any>;
        };
        showAction: {
            type: import("vue").PropType<("click" | "focus")[]>;
        };
        transitionName: StringConstructor;
        onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
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
        onSearch: {
            type: import("vue").PropType<(value: string) => void>;
        };
        notFoundContent: import("vue-types").VueTypeValidableDef<any>;
        fieldNames: {
            type: import("vue").PropType<import("../vc-tree-select/TreeSelect").FieldNames>;
        };
        dropdownStyle: {
            type: import("vue").PropType<import("vue").CSSProperties>;
        };
        dropdownRender: {
            type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
        };
        dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
        switcherIcon: import("vue-types").VueTypeValidableDef<any>;
        loadData: {
            type: import("vue").PropType<(dataNode: import("../vc-tree-select/TreeSelect").LegacyDataNode) => Promise<unknown>>;
        };
        filterTreeNode: {
            type: import("vue").PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
            default: any;
        };
        treeData: {
            type: import("vue").PropType<DefaultOptionType[]>;
        };
        treeCheckable: {
            type: BooleanConstructor;
            default: any;
        };
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
        maxTagPlaceholder: {
            type: import("vue").PropType<(omittedValues: import("../vc-select/BaseSelect").DisplayValueType[]) => any>;
        };
        tokenSeparators: {
            type: import("vue").PropType<string[]>;
        };
        tagRender: {
            type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
        };
        choiceTransitionName: StringConstructor;
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
        getRawInputElement: {
            type: import("vue").PropType<() => any>;
        };
        showArrow: {
            type: BooleanConstructor;
            default: any;
        };
        onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
        listItemHeight: NumberConstructor;
        inputValue: StringConstructor;
        autoClearSearchValue: {
            type: BooleanConstructor;
            default: any;
        };
        labelInValue: {
            type: BooleanConstructor;
            default: any;
        };
        showCheckedStrategy: {
            type: import("vue").PropType<import("../vc-tree-select/utils/strategyUtil").CheckedStrategy>;
        };
        treeExpandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
        treeDefaultExpandAll: {
            type: BooleanConstructor;
            default: any;
        };
        treeIcon: import("vue-types").VueTypeValidableDef<any>;
        treeLoadedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        onTreeLoad: {
            type: import("vue").PropType<(loadedKeys: Key[]) => void>;
        };
        treeNodeFilterProp: StringConstructor;
        treeNodeLabelProp: StringConstructor;
        treeCheckStrictly: {
            type: BooleanConstructor;
            default: any;
        };
        treeDataSimpleMode: {
            type: import("vue").PropType<boolean | import("../vc-tree-select/TreeSelect").SimpleModeConfig>;
            default: any;
        };
        treeExpandedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        treeDefaultExpandedKeys: {
            type: import("vue").PropType<Key[]>;
        };
        onTreeExpand: {
            type: import("vue").PropType<(expandedKeys: Key[]) => void>;
        };
        dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
    }>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, {
        size: SizeType;
        open: boolean;
        multiple: boolean;
        disabled: boolean;
        autofocus: boolean;
        virtual: boolean;
        dropdownMatchSelectWidth: number | boolean;
        status: "" | "error" | "warning";
        'onUpdate:value': (value: any) => void;
        placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
        loading: boolean;
        bordered: boolean;
        allowClear: boolean;
        filterTreeNode: boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean);
        replaceFields: FieldNames;
        treeCheckable: boolean;
        showSearch: boolean;
        defaultOpen: boolean;
        showArrow: boolean;
        autoClearSearchValue: boolean;
        labelInValue: boolean;
        treeDefaultExpandAll: boolean;
        treeLine: boolean | {
            showLeafIcon: boolean;
        };
        treeCheckStrictly: boolean;
        treeDataSimpleMode: any;
        'onUpdate:treeExpandedKeys': (keys: Key[]) => void;
        'onUpdate:searchValue': (value: string) => void;
    }>;
    __isFragment?: never;
    __isTeleport?: never;
    __isSuspense?: never;
} & import("vue").ComponentOptionsBase<Readonly<ExtractPropTypes<{
    suffixIcon: import("vue-types").VueTypeValidableDef<any>;
    size: {
        type: import("vue").PropType<SizeType>;
        default: SizeType;
    };
    bordered: {
        type: BooleanConstructor;
        default: boolean;
    };
    treeLine: {
        type: import("vue").PropType<boolean | {
            showLeafIcon: boolean;
        }>;
        default: boolean | {
            showLeafIcon: boolean;
        };
    };
    replaceFields: {
        type: import("vue").PropType<FieldNames>;
        default: FieldNames;
    };
    placement: {
        type: import("vue").PropType<"bottomLeft" | "bottomRight" | "topLeft" | "topRight">;
        default: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    };
    status: {
        type: import("vue").PropType<"" | "error" | "warning">;
        default: "" | "error" | "warning";
    };
    popupClassName: StringConstructor;
    /** @deprecated Please use `popupClassName` instead */
    dropdownClassName: StringConstructor;
    'onUpdate:value': {
        type: import("vue").PropType<(value: any) => void>;
        default: (value: any) => void;
    };
    'onUpdate:treeExpandedKeys': {
        type: import("vue").PropType<(keys: Key[]) => void>;
        default: (keys: Key[]) => void;
    };
    'onUpdate:searchValue': {
        type: import("vue").PropType<(value: string) => void>;
        default: (value: string) => void;
    };
    value: {
        type: import("vue").PropType<any>;
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
    onChange: {
        type: import("vue").PropType<(value: any, labelList: any[], extra: import("../vc-tree-select/TreeSelect").ChangeEventExtra) => void>;
    };
    onKeydown: import("vue").PropType<(e: KeyboardEvent) => void>;
    onKeyup: import("vue").PropType<(e: KeyboardEvent) => void>;
    onMousedown: import("vue").PropType<(e: MouseEvent) => void>;
    onSelect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    open: {
        type: BooleanConstructor;
        default: any;
    };
    animation: StringConstructor;
    direction: {
        type: import("vue").PropType<"rtl" | "ltr">;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
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
    defaultValue: {
        type: import("vue").PropType<any>;
    };
    showAction: {
        type: import("vue").PropType<("click" | "focus")[]>;
    };
    transitionName: StringConstructor;
    onDeselect: import("vue").PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
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
    onSearch: {
        type: import("vue").PropType<(value: string) => void>;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    fieldNames: {
        type: import("vue").PropType<import("../vc-tree-select/TreeSelect").FieldNames>;
    };
    dropdownStyle: {
        type: import("vue").PropType<import("vue").CSSProperties>;
    };
    dropdownRender: {
        type: import("vue").PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: import("vue").PropType<import("../vc-trigger/interface").AlignType>;
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    loadData: {
        type: import("vue").PropType<(dataNode: import("../vc-tree-select/TreeSelect").LegacyDataNode) => Promise<unknown>>;
    };
    filterTreeNode: {
        type: import("vue").PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
        default: any;
    };
    treeData: {
        type: import("vue").PropType<DefaultOptionType[]>;
    };
    treeCheckable: {
        type: BooleanConstructor;
        default: any;
    };
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
    maxTagPlaceholder: {
        type: import("vue").PropType<(omittedValues: import("../vc-select/BaseSelect").DisplayValueType[]) => any>;
    };
    tokenSeparators: {
        type: import("vue").PropType<string[]>;
    };
    tagRender: {
        type: import("vue").PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
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
    getRawInputElement: {
        type: import("vue").PropType<() => any>;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    onPopupScroll: import("vue").PropType<(e: UIEvent) => void>;
    listItemHeight: NumberConstructor;
    inputValue: StringConstructor;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    showCheckedStrategy: {
        type: import("vue").PropType<import("../vc-tree-select/utils/strategyUtil").CheckedStrategy>;
    };
    treeExpandAction: import("vue").PropType<import("../vc-tree/props").ExpandAction>;
    treeDefaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    treeIcon: import("vue-types").VueTypeValidableDef<any>;
    treeLoadedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onTreeLoad: {
        type: import("vue").PropType<(loadedKeys: Key[]) => void>;
    };
    treeNodeFilterProp: StringConstructor;
    treeNodeLabelProp: StringConstructor;
    treeCheckStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    treeDataSimpleMode: {
        type: import("vue").PropType<boolean | import("../vc-tree-select/TreeSelect").SimpleModeConfig>;
        default: any;
    };
    treeExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    treeDefaultExpandedKeys: {
        type: import("vue").PropType<Key[]>;
    };
    onTreeExpand: {
        type: import("vue").PropType<(expandedKeys: Key[]) => void>;
    };
    dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, {
    size: SizeType;
    open: boolean;
    multiple: boolean;
    disabled: boolean;
    autofocus: boolean;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    status: "" | "error" | "warning";
    'onUpdate:value': (value: any) => void;
    placement: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    loading: boolean;
    bordered: boolean;
    allowClear: boolean;
    filterTreeNode: boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean);
    replaceFields: FieldNames;
    treeCheckable: boolean;
    showSearch: boolean;
    defaultOpen: boolean;
    showArrow: boolean;
    autoClearSearchValue: boolean;
    labelInValue: boolean;
    treeDefaultExpandAll: boolean;
    treeLine: boolean | {
        showLeafIcon: boolean;
    };
    treeCheckStrictly: boolean;
    treeDataSimpleMode: any;
    'onUpdate:treeExpandedKeys': (keys: Key[]) => void;
    'onUpdate:searchValue': (value: string) => void;
}, {}, string, CustomSlotsType<{
    title?: any;
    titleRender?: any;
    placeholder?: any;
    maxTagPlaceholder?: any;
    treeIcon?: any;
    switcherIcon?: any;
    notFoundContent?: any;
    default?: any;
    leafIcon?: any;
    tagRender?: any;
    suffixIcon?: any;
}>, import("vue").GlobalComponents, import("vue").GlobalDirectives, string, import("vue").ComponentProvideOptions> & import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps & {
    TreeNode: import("vue").FunctionalComponent<import("../vc-tree-select/TreeNode").TreeNodeProps, {}, any, {}> & {
        isTreeSelectNode: boolean;
    };
    SHOW_ALL: "SHOW_ALL";
    SHOW_PARENT: "SHOW_PARENT";
    SHOW_CHILD: "SHOW_CHILD";
    install: (app: App) => App<any>;
};
export default _default;
