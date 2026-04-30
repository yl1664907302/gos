import type { CheckedStrategy } from './utils/strategyUtil';
import type { Key } from './interface';
import type { DisplayValueType } from '../vc-select/BaseSelect';
import type { ExtractPropTypes, PropType } from 'vue';
import type { VueNode } from '../_util/type';
import type { ExpandAction } from '../vc-tree/props';
export type OnInternalSelect = (value: RawValueType, info: {
    selected: boolean;
}) => void;
export type RawValueType = string | number;
export interface LabeledValueType {
    key?: Key;
    value?: RawValueType;
    label?: any;
    /** Only works on `treeCheckStrictly` */
    halfChecked?: boolean;
}
export type SelectSource = 'option' | 'selection' | 'input' | 'clear';
export type DraftValueType = RawValueType | LabeledValueType | (RawValueType | LabeledValueType)[];
/** @deprecated This is only used for legacy compatible. Not works on new code. */
export interface LegacyCheckedNode {
    pos: string;
    node: any;
    children?: LegacyCheckedNode[];
}
export interface ChangeEventExtra {
    /** @deprecated Please save prev value by control logic instead */
    preValue: LabeledValueType[];
    triggerValue: RawValueType;
    /** @deprecated Use `onSelect` or `onDeselect` instead. */
    selected?: boolean;
    /** @deprecated Use `onSelect` or `onDeselect` instead. */
    checked?: boolean;
    /** @deprecated This prop not work as react node anymore. */
    triggerNode: any;
    /** @deprecated This prop not work as react node anymore. */
    allCheckedNodes: LegacyCheckedNode[];
}
export interface FieldNames {
    value?: string;
    label?: string;
    children?: string;
}
export interface InternalFieldName extends Omit<FieldNames, 'label'> {
    _title: string[];
}
export interface SimpleModeConfig {
    id?: Key;
    pId?: Key;
    rootPId?: Key;
}
export interface BaseOptionType {
    disabled?: boolean;
    checkable?: boolean;
    disableCheckbox?: boolean;
    children?: BaseOptionType[];
    [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
    value?: RawValueType;
    title?: any;
    label?: any;
    key?: Key;
    children?: DefaultOptionType[];
}
export interface LegacyDataNode extends DefaultOptionType {
    props: any;
}
export declare function treeSelectProps<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType>(): {
    prefixCls: StringConstructor;
    id: StringConstructor;
    value: {
        type: PropType<ValueType>;
    };
    defaultValue: {
        type: PropType<ValueType>;
    };
    onChange: {
        type: PropType<(value: ValueType, labelList: any[], extra: ChangeEventExtra) => void>;
    };
    searchValue: StringConstructor;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    onSearch: {
        type: PropType<(value: string) => void>;
    };
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterTreeNode: {
        type: PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
        default: any;
    };
    treeNodeFilterProp: StringConstructor;
    onSelect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    onDeselect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    showCheckedStrategy: {
        type: PropType<CheckedStrategy>;
    };
    treeNodeLabelProp: StringConstructor;
    fieldNames: {
        type: PropType<FieldNames>;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckable: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    treeData: {
        type: PropType<OptionType[]>;
    };
    treeDataSimpleMode: {
        type: PropType<boolean | SimpleModeConfig>;
        default: any;
    };
    loadData: {
        type: PropType<(dataNode: LegacyDataNode) => Promise<unknown>>;
    };
    treeLoadedKeys: {
        type: PropType<Key[]>;
    };
    onTreeLoad: {
        type: PropType<(loadedKeys: Key[]) => void>;
    };
    treeDefaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    treeExpandedKeys: {
        type: PropType<Key[]>;
    };
    treeDefaultExpandedKeys: {
        type: PropType<Key[]>;
    };
    onTreeExpand: {
        type: PropType<(expandedKeys: Key[]) => void>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    treeLine: {
        type: (ObjectConstructor | BooleanConstructor)[];
        default: any;
    };
    treeIcon: import("vue-types").VueTypeValidableDef<any>;
    showTreeIcon: {
        type: BooleanConstructor;
        default: any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    treeMotion: import("vue-types").VueTypeValidableDef<any>;
    children: PropType<VueNode[]>;
    treeExpandAction: PropType<ExpandAction>;
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    maxTagPlaceholder: {
        type: PropType<(omittedValues: DisplayValueType[]) => any>;
    };
    dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
    customSlots: ObjectConstructor;
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
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    animation: StringConstructor;
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    transitionName: StringConstructor;
    placement: {
        type: PropType<import("../vc-select/BaseSelect").Placement>;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
};
export type TreeSelectProps = Partial<ExtractPropTypes<ReturnType<typeof treeSelectProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    id: StringConstructor;
    value: {
        type: PropType<any>;
    };
    defaultValue: {
        type: PropType<any>;
    };
    onChange: {
        type: PropType<(value: any, labelList: any[], extra: ChangeEventExtra) => void>;
    };
    searchValue: StringConstructor;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    onSearch: {
        type: PropType<(value: string) => void>;
    };
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterTreeNode: {
        type: PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
        default: any;
    };
    treeNodeFilterProp: StringConstructor;
    onSelect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    onDeselect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    showCheckedStrategy: {
        type: PropType<CheckedStrategy>;
    };
    treeNodeLabelProp: StringConstructor;
    fieldNames: {
        type: PropType<FieldNames>;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckable: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    treeData: {
        type: PropType<DefaultOptionType[]>;
    };
    treeDataSimpleMode: {
        type: PropType<boolean | SimpleModeConfig>;
        default: any;
    };
    loadData: {
        type: PropType<(dataNode: LegacyDataNode) => Promise<unknown>>;
    };
    treeLoadedKeys: {
        type: PropType<Key[]>;
    };
    onTreeLoad: {
        type: PropType<(loadedKeys: Key[]) => void>;
    };
    treeDefaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    treeExpandedKeys: {
        type: PropType<Key[]>;
    };
    treeDefaultExpandedKeys: {
        type: PropType<Key[]>;
    };
    onTreeExpand: {
        type: PropType<(expandedKeys: Key[]) => void>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    treeLine: {
        type: (ObjectConstructor | BooleanConstructor)[];
        default: any;
    };
    treeIcon: import("vue-types").VueTypeValidableDef<any>;
    showTreeIcon: {
        type: BooleanConstructor;
        default: any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    treeMotion: import("vue-types").VueTypeValidableDef<any>;
    children: PropType<VueNode[]>;
    treeExpandAction: PropType<ExpandAction>;
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    maxTagPlaceholder: {
        type: PropType<(omittedValues: DisplayValueType[]) => any>;
    };
    dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
    customSlots: ObjectConstructor;
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
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    animation: StringConstructor;
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    transitionName: StringConstructor;
    placement: {
        type: PropType<import("../vc-select/BaseSelect").Placement>;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    id: StringConstructor;
    value: {
        type: PropType<any>;
    };
    defaultValue: {
        type: PropType<any>;
    };
    onChange: {
        type: PropType<(value: any, labelList: any[], extra: ChangeEventExtra) => void>;
    };
    searchValue: StringConstructor;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    onSearch: {
        type: PropType<(value: string) => void>;
    };
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    filterTreeNode: {
        type: PropType<boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean)>;
        default: any;
    };
    treeNodeFilterProp: StringConstructor;
    onSelect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    onDeselect: PropType<import("../vc-select/Select").SelectHandler<unknown, import("../select").BaseOptionType>>;
    showCheckedStrategy: {
        type: PropType<CheckedStrategy>;
    };
    treeNodeLabelProp: StringConstructor;
    fieldNames: {
        type: PropType<FieldNames>;
    };
    multiple: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckable: {
        type: BooleanConstructor;
        default: any;
    };
    treeCheckStrictly: {
        type: BooleanConstructor;
        default: any;
    };
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    treeData: {
        type: PropType<DefaultOptionType[]>;
    };
    treeDataSimpleMode: {
        type: PropType<boolean | SimpleModeConfig>;
        default: any;
    };
    loadData: {
        type: PropType<(dataNode: LegacyDataNode) => Promise<unknown>>;
    };
    treeLoadedKeys: {
        type: PropType<Key[]>;
    };
    onTreeLoad: {
        type: PropType<(loadedKeys: Key[]) => void>;
    };
    treeDefaultExpandAll: {
        type: BooleanConstructor;
        default: any;
    };
    treeExpandedKeys: {
        type: PropType<Key[]>;
    };
    treeDefaultExpandedKeys: {
        type: PropType<Key[]>;
    };
    onTreeExpand: {
        type: PropType<(expandedKeys: Key[]) => void>;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    treeLine: {
        type: (ObjectConstructor | BooleanConstructor)[];
        default: any;
    };
    treeIcon: import("vue-types").VueTypeValidableDef<any>;
    showTreeIcon: {
        type: BooleanConstructor;
        default: any;
    };
    switcherIcon: import("vue-types").VueTypeValidableDef<any>;
    treeMotion: import("vue-types").VueTypeValidableDef<any>;
    children: PropType<VueNode[]>;
    treeExpandAction: PropType<ExpandAction>;
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    open: {
        type: BooleanConstructor;
        default: any;
    };
    defaultOpen: {
        type: BooleanConstructor;
        default: any;
    };
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    maxTagPlaceholder: {
        type: PropType<(omittedValues: DisplayValueType[]) => any>;
    };
    dropdownPopupAlign: import("vue-types").VueTypeValidableDef<any>;
    customSlots: ObjectConstructor;
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
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    animation: StringConstructor;
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    autofocus: BooleanConstructor;
    getPopupContainer: {
        type: PropType<import("../vc-select/BaseSelect").RenderDOMFunc>;
    };
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    transitionName: StringConstructor;
    placement: {
        type: PropType<import("../vc-select/BaseSelect").Placement>;
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownRender: {
        type: PropType<import("../vc-select/BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagTextLength: NumberConstructor;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    tagRender: {
        type: PropType<(props: import("../vc-select/BaseSelect").CustomTagProps) => any>;
    };
    choiceTransitionName: StringConstructor;
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    onClear: PropType<() => void>;
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
}>> & Readonly<{}>, {
    open: boolean;
    multiple: boolean;
    disabled: boolean;
    autofocus: boolean;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    loading: boolean;
    allowClear: boolean;
    filterTreeNode: boolean | ((inputValue: string, treeNode: DefaultOptionType) => boolean);
    treeCheckable: boolean;
    showSearch: boolean;
    defaultOpen: boolean;
    showArrow: boolean;
    autoClearSearchValue: boolean;
    labelInValue: boolean;
    treeDefaultExpandAll: boolean;
    showTreeIcon: boolean;
    treeLine: boolean | Record<string, any>;
    treeCheckStrictly: boolean;
    treeDataSimpleMode: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
