import type { PropType } from 'vue';
import type { OptionProps } from './Option';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    options: {
        type: PropType<OptionProps[]>;
        default: () => any[];
    };
    prefixCls: StringConstructor;
    placement: StringConstructor;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    getPopupContainer: FunctionConstructor;
    direction: StringConstructor;
    dropdownClassName: StringConstructor;
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    loading: {
        type: BooleanConstructor;
        default: any;
    };
    options: {
        type: PropType<OptionProps[]>;
        default: () => any[];
    };
    prefixCls: StringConstructor;
    placement: StringConstructor;
    visible: {
        type: BooleanConstructor;
        default: any;
    };
    transitionName: StringConstructor;
    getPopupContainer: FunctionConstructor;
    direction: StringConstructor;
    dropdownClassName: StringConstructor;
}>> & Readonly<{}>, {
    visible: boolean;
    options: OptionProps[];
    loading: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
