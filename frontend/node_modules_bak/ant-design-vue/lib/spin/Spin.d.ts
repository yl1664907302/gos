import type { ExtractPropTypes, PropType } from 'vue';
export type SpinSize = 'small' | 'default' | 'large';
export declare const spinProps: () => {
    prefixCls: StringConstructor;
    spinning: {
        type: BooleanConstructor;
        default: any;
    };
    size: PropType<SpinSize>;
    wrapperClassName: StringConstructor;
    tip: import("vue-types").VueTypeValidableDef<any>;
    delay: NumberConstructor;
    indicator: import("vue-types").VueTypeValidableDef<any>;
};
export type SpinProps = Partial<ExtractPropTypes<ReturnType<typeof spinProps>>>;
export declare function setDefaultIndicator(Content: any): void;
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    spinning: {
        type: BooleanConstructor;
        default: any;
    };
    size: PropType<SpinSize>;
    wrapperClassName: StringConstructor;
    tip: import("vue-types").VueTypeValidableDef<any>;
    delay: NumberConstructor;
    indicator: import("vue-types").VueTypeValidableDef<any>;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    spinning: {
        type: BooleanConstructor;
        default: any;
    };
    size: PropType<SpinSize>;
    wrapperClassName: StringConstructor;
    tip: import("vue-types").VueTypeValidableDef<any>;
    delay: NumberConstructor;
    indicator: import("vue-types").VueTypeValidableDef<any>;
}>> & Readonly<{}>, {
    spinning: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
