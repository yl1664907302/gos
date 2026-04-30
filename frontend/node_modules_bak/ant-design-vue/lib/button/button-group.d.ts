import type { ExtractPropTypes, PropType } from 'vue';
import type { SizeType } from '../config-provider';
export declare const buttonGroupProps: () => {
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
};
export type ButtonGroupProps = Partial<ExtractPropTypes<ReturnType<typeof buttonGroupProps>>>;
export declare const GroupSizeContext: {
    useProvide: (props: {
        size: SizeType;
    }, newProps?: {
        size: SizeType;
    }) => {
        size: SizeType;
    };
    useInject: () => {
        size: SizeType;
    };
};
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    size: {
        type: PropType<SizeType>;
    };
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
