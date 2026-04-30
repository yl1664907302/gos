/**
 * To match accessibility requirement, we always provide an input in the component.
 * Other element will not set `tabindex` to avoid `onBlur` sequence problem.
 * For focused select, we set `aria-live="polite"` to update the accessibility content.
 *
 * ref:
 * - keyboard: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role#Keyboard_interactions
 *
 * New api:
 * - listHeight
 * - listItemHeight
 * - component
 *
 * Remove deprecated api:
 * - multiple
 * - tags
 * - combobox
 * - firstActiveValue
 * - dropdownMenuStyle
 * - openClassName (Not list in api)
 *
 * Update:
 * - `backfill` only support `combobox` mode
 * - `combobox` mode not support `labelInValue` since it's meaningless
 * - `getInputElement` only support `combobox` mode
 * - `onChange` return OptionData instead of ReactNode
 * - `filterOption` `onChange` `onSelect` accept OptionData instead of ReactNode
 * - `combobox` mode trigger `onChange` will get `undefined` if no `value` match in Option
 * - `combobox` mode not support `optionLabelProp`
 */
import type { DisplayValueType } from './BaseSelect';
import type { Key, VueNode } from '../_util/type';
import type { ExtractPropTypes, PropType } from 'vue';
type ArrayElementType<T> = T extends (infer E)[] ? E : T;
export type OnActiveValue = (active: RawValueType, index: number, info?: {
    source?: 'keyboard' | 'mouse';
}) => void;
export type OnInternalSelect = (value: RawValueType, info: {
    selected: boolean;
}) => void;
export type RawValueType = string | number;
export interface LabelInValueType {
    label: any;
    originLabel?: any;
    value: RawValueType;
    /** @deprecated `key` is useless since it should always same as `value` */
    key?: Key;
}
export type DraftValueType = RawValueType | LabelInValueType | DisplayValueType | (RawValueType | LabelInValueType | DisplayValueType)[];
export type FilterFunc<OptionType> = (inputValue: string, option?: OptionType) => boolean;
export interface FieldNames {
    value?: string;
    label?: string;
    options?: string;
}
export interface BaseOptionType {
    disabled?: boolean;
    [name: string]: any;
}
export interface DefaultOptionType extends BaseOptionType {
    label?: any;
    value?: string | number | null;
    children?: Omit<DefaultOptionType, 'children'>[];
}
export type SelectHandler<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType> = ((value: RawValueType | LabelInValueType, option: OptionType) => void) | ((value: ValueType, option: OptionType) => void);
export declare function selectProps<ValueType = any, OptionType extends BaseOptionType = DefaultOptionType>(): {
    prefixCls: StringConstructor;
    id: StringConstructor;
    backfill: {
        type: BooleanConstructor;
        default: any;
    };
    fieldNames: PropType<FieldNames>;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    searchValue: StringConstructor;
    onSearch: PropType<(value: string) => void>;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    onSelect: PropType<SelectHandler<ArrayElementType<ValueType>, OptionType>>;
    onDeselect: PropType<SelectHandler<ArrayElementType<ValueType>, OptionType>>;
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
        type: PropType<boolean | FilterFunc<OptionType>>;
        default: any;
    };
    filterSort: PropType<(optionA: OptionType, optionB: OptionType) => number>;
    optionFilterProp: StringConstructor;
    optionLabelProp: StringConstructor;
    options: PropType<OptionType[]>;
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: any;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    mode: PropType<"multiple" | "tags" | "combobox">;
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    defaultValue: import("vue-types").VueTypeValidableDef<any>;
    onChange: PropType<(value: ValueType, option: OptionType | OptionType[]) => void>;
    children: PropType<VueNode[]>;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    tagRender: {
        type: PropType<(props: import("./BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    tabindex: NumberConstructor;
    autofocus: BooleanConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    onClear: PropType<() => void>;
    choiceTransitionName: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
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
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    maxTagTextLength: NumberConstructor;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    animation: StringConstructor;
    transitionName: StringConstructor;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    dropdownRender: {
        type: PropType<import("./BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    placement: {
        type: PropType<import("./BaseSelect").Placement>;
    };
    getPopupContainer: {
        type: PropType<import("./BaseSelect").RenderDOMFunc>;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    onClick: PropType<(e: MouseEvent) => void>;
};
export type SelectProps = Partial<ExtractPropTypes<ReturnType<typeof selectProps>>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    id: StringConstructor;
    backfill: {
        type: BooleanConstructor;
        default: any;
    };
    fieldNames: PropType<FieldNames>;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    searchValue: StringConstructor;
    onSearch: PropType<(value: string) => void>;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    onSelect: PropType<SelectHandler<any, DefaultOptionType>>;
    onDeselect: PropType<SelectHandler<any, DefaultOptionType>>;
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
        type: PropType<boolean | FilterFunc<DefaultOptionType>>;
        default: any;
    };
    filterSort: PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    optionLabelProp: StringConstructor;
    options: PropType<DefaultOptionType[]>;
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: any;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    mode: PropType<"multiple" | "tags" | "combobox">;
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    defaultValue: import("vue-types").VueTypeValidableDef<any>;
    onChange: PropType<(value: any, option: DefaultOptionType | DefaultOptionType[]) => void>;
    children: PropType<VueNode[]>;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    tagRender: {
        type: PropType<(props: import("./BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    tabindex: NumberConstructor;
    autofocus: BooleanConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    onClear: PropType<() => void>;
    choiceTransitionName: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
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
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    maxTagTextLength: NumberConstructor;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    animation: StringConstructor;
    transitionName: StringConstructor;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    dropdownRender: {
        type: PropType<import("./BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    placement: {
        type: PropType<import("./BaseSelect").Placement>;
    };
    getPopupContainer: {
        type: PropType<import("./BaseSelect").RenderDOMFunc>;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    onClick: PropType<(e: MouseEvent) => void>;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    id: StringConstructor;
    backfill: {
        type: BooleanConstructor;
        default: any;
    };
    fieldNames: PropType<FieldNames>;
    /** @deprecated Use `searchValue` instead */
    inputValue: StringConstructor;
    searchValue: StringConstructor;
    onSearch: PropType<(value: string) => void>;
    autoClearSearchValue: {
        type: BooleanConstructor;
        default: any;
    };
    onSelect: PropType<SelectHandler<any, DefaultOptionType>>;
    onDeselect: PropType<SelectHandler<any, DefaultOptionType>>;
    /**
     * In Select, `false` means do nothing.
     * In TreeSelect, `false` will highlight match item.
     * It's by design.
     */
    filterOption: {
        type: PropType<boolean | FilterFunc<DefaultOptionType>>;
        default: any;
    };
    filterSort: PropType<(optionA: DefaultOptionType, optionB: DefaultOptionType) => number>;
    optionFilterProp: StringConstructor;
    optionLabelProp: StringConstructor;
    options: PropType<DefaultOptionType[]>;
    defaultActiveFirstOption: {
        type: BooleanConstructor;
        default: any;
    };
    virtual: {
        type: BooleanConstructor;
        default: any;
    };
    listHeight: NumberConstructor;
    listItemHeight: NumberConstructor;
    menuItemSelectedIcon: import("vue-types").VueTypeValidableDef<any>;
    mode: PropType<"multiple" | "tags" | "combobox">;
    labelInValue: {
        type: BooleanConstructor;
        default: any;
    };
    value: import("vue-types").VueTypeValidableDef<any>;
    defaultValue: import("vue-types").VueTypeValidableDef<any>;
    onChange: PropType<(value: any, option: DefaultOptionType | DefaultOptionType[]) => void>;
    children: PropType<VueNode[]>;
    showSearch: {
        type: BooleanConstructor;
        default: any;
    };
    tagRender: {
        type: PropType<(props: import("./BaseSelect").CustomTagProps) => any>;
    };
    optionLabelRender: {
        type: PropType<(option: Record<string, any>) => any>;
    };
    direction: {
        type: PropType<"rtl" | "ltr">;
    };
    tabindex: NumberConstructor;
    autofocus: BooleanConstructor;
    notFoundContent: import("vue-types").VueTypeValidableDef<any>;
    placeholder: import("vue-types").VueTypeValidableDef<any>;
    onClear: PropType<() => void>;
    choiceTransitionName: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    loading: {
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
    onDropdownVisibleChange: {
        type: PropType<(open: boolean) => void>;
    };
    getInputElement: {
        type: PropType<() => any>;
    };
    getRawInputElement: {
        type: PropType<() => any>;
    };
    maxTagTextLength: NumberConstructor;
    maxTagCount: {
        type: PropType<number | "responsive">;
    };
    maxTagPlaceholder: import("vue-types").VueTypeValidableDef<any>;
    tokenSeparators: {
        type: PropType<string[]>;
    };
    allowClear: {
        type: BooleanConstructor;
        default: any;
    };
    showArrow: {
        type: BooleanConstructor;
        default: any;
    };
    inputIcon: import("vue-types").VueTypeValidableDef<any>;
    clearIcon: import("vue-types").VueTypeValidableDef<any>;
    removeIcon: import("vue-types").VueTypeValidableDef<any>;
    animation: StringConstructor;
    transitionName: StringConstructor;
    dropdownStyle: {
        type: PropType<import("vue").CSSProperties>;
    };
    dropdownClassName: StringConstructor;
    dropdownMatchSelectWidth: {
        type: PropType<number | boolean>;
        default: any;
    };
    dropdownRender: {
        type: PropType<import("./BaseSelect").DropdownRender>;
    };
    dropdownAlign: PropType<import("../vc-trigger/interface").AlignType>;
    placement: {
        type: PropType<import("./BaseSelect").Placement>;
    };
    getPopupContainer: {
        type: PropType<import("./BaseSelect").RenderDOMFunc>;
    };
    showAction: {
        type: PropType<("click" | "focus")[]>;
    };
    onBlur: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onFocus: {
        type: PropType<(e: FocusEvent) => void>;
    };
    onKeyup: PropType<(e: KeyboardEvent) => void>;
    onKeydown: PropType<(e: KeyboardEvent) => void>;
    onMousedown: PropType<(e: MouseEvent) => void>;
    onPopupScroll: PropType<(e: UIEvent) => void>;
    onInputKeyDown: PropType<(e: KeyboardEvent) => void>;
    onMouseenter: PropType<(e: MouseEvent) => void>;
    onMouseleave: PropType<(e: MouseEvent) => void>;
    onClick: PropType<(e: MouseEvent) => void>;
}>> & Readonly<{}>, {
    open: boolean;
    disabled: boolean;
    autofocus: boolean;
    virtual: boolean;
    dropdownMatchSelectWidth: number | boolean;
    loading: boolean;
    allowClear: boolean;
    showSearch: boolean;
    defaultOpen: boolean;
    showArrow: boolean;
    backfill: boolean;
    autoClearSearchValue: boolean;
    filterOption: boolean | FilterFunc<DefaultOptionType>;
    defaultActiveFirstOption: boolean;
    labelInValue: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
