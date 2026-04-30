import type { ExtractPropTypes, PropType } from 'vue';
declare const checkableTagProps: () => {
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: {
        type: PropType<(checked: boolean) => void>;
    };
    onClick: {
        type: PropType<(e: MouseEvent) => void>;
    };
    'onUpdate:checked': PropType<(checked: boolean) => void>;
};
export type CheckableTagProps = Partial<ExtractPropTypes<ReturnType<typeof checkableTagProps>>>;
declare const CheckableTag: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: {
        type: PropType<(checked: boolean) => void>;
    };
    onClick: {
        type: PropType<(e: MouseEvent) => void>;
    };
    'onUpdate:checked': PropType<(checked: boolean) => void>;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    checked: {
        type: BooleanConstructor;
        default: any;
    };
    onChange: {
        type: PropType<(checked: boolean) => void>;
    };
    onClick: {
        type: PropType<(e: MouseEvent) => void>;
    };
    'onUpdate:checked': PropType<(checked: boolean) => void>;
}>> & Readonly<{}>, {
    checked: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default CheckableTag;
