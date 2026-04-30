import type { ExtractPropTypes } from 'vue';
import { vcMentionsProps } from './mentionsProps';
import type { OptionProps } from './Option';
export type MentionsProps = Partial<ExtractPropTypes<typeof vcMentionsProps>>;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    dropdownClassName: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    prefix: import("vue-types").VueTypeDef<string | string[]>;
    prefixCls: StringConstructor;
    value: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    split: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue-types").VueTypeDef<"top" | "bottom">;
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    filterOption: {
        type: import("vue").PropType<false | typeof import("./util").filterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    options: {
        type: import("vue").PropType<OptionProps[]>;
        default: OptionProps[];
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: import("vue").PropType<import("./mentionsProps").Direction>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("blur" | "change" | "focus" | "select" | "search" | "pressenter")[], "blur" | "change" | "focus" | "select" | "search" | "pressenter", import("vue").PublicProps, Readonly<ExtractPropTypes<{
    dropdownClassName: StringConstructor;
    autofocus: {
        type: BooleanConstructor;
        default: any;
    };
    prefix: import("vue-types").VueTypeDef<string | string[]>;
    prefixCls: StringConstructor;
    value: StringConstructor;
    disabled: {
        type: BooleanConstructor;
        default: any;
    };
    split: StringConstructor;
    transitionName: StringConstructor;
    placement: import("vue-types").VueTypeDef<"top" | "bottom">;
    character: import("vue-types").VueTypeValidableDef<any>;
    characterRender: FunctionConstructor;
    filterOption: {
        type: import("vue").PropType<false | typeof import("./util").filterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: import("vue").PropType<() => HTMLElement>;
    };
    options: {
        type: import("vue").PropType<OptionProps[]>;
        default: OptionProps[];
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: import("vue").PropType<import("./mentionsProps").Direction>;
    };
}>> & Readonly<{
    onFocus?: (...args: any[]) => any;
    onBlur?: (...args: any[]) => any;
    onChange?: (...args: any[]) => any;
    onSelect?: (...args: any[]) => any;
    onSearch?: (...args: any[]) => any;
    onPressenter?: (...args: any[]) => any;
}>, {
    disabled: boolean;
    autofocus: boolean;
    options: OptionProps[];
    loading: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
