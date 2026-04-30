import type { CustomSlotsType } from '../../_util/type';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    upDisabled: BooleanConstructor;
    downDisabled: BooleanConstructor;
    onStep: {
        type: import("vue").PropType<(up: boolean) => void>;
        default: (up: boolean) => void;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    upDisabled: BooleanConstructor;
    downDisabled: BooleanConstructor;
    onStep: {
        type: import("vue").PropType<(up: boolean) => void>;
        default: (up: boolean) => void;
    };
}>> & Readonly<{}>, {
    upDisabled: boolean;
    downDisabled: boolean;
    onStep: (up: boolean) => void;
}, CustomSlotsType<{
    upNode?: any;
    downNode?: any;
    default?: any;
}>, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
