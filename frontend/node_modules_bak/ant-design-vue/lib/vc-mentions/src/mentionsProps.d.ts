import type { PropType } from 'vue';
import { filterOption as defaultFilterOption, validateSearch as defaultValidateSearch } from './util';
import type { OptionProps } from './Option';
export declare const PlaceMent: ["top", "bottom"];
export type Direction = 'ltr' | 'rtl';
export declare const mentionsProps: {
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
        type: PropType<false | typeof defaultFilterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: PropType<() => HTMLElement>;
    };
    options: {
        type: PropType<OptionProps[]>;
        default: OptionProps[];
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: PropType<Direction>;
    };
};
export declare const vcMentionsProps: {
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
        type: PropType<false | typeof defaultFilterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: PropType<() => HTMLElement>;
    };
    options: {
        type: PropType<OptionProps[]>;
        default: OptionProps[];
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: PropType<Direction>;
    };
};
export declare const defaultProps: {
    prefix: string;
    split: string;
    rows: number;
    validateSearch: typeof defaultValidateSearch;
    filterOption: any;
};
declare const _default: {
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
        type: PropType<false | typeof defaultFilterOption>;
    };
    validateSearch: FunctionConstructor;
    getPopupContainer: {
        type: PropType<() => HTMLElement>;
    };
    options: {
        type: PropType<OptionProps[]>;
        default: OptionProps[];
    };
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    rows: (StringConstructor | NumberConstructor)[];
    direction: {
        type: PropType<Direction>;
    };
};
export default _default;
