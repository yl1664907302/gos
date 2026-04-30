import type { VueNode } from '../../_util/type';
import type { ExtractPropTypes, HTMLAttributes } from 'vue';
export declare const baseOptionsProps: {
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: import("vue").PropType<Record<string, any>>;
        default: Record<string, any>;
    };
};
export declare const optionProps: {
    label: {
        default: VueNode | ((o: BaseOptionsProps) => VueNode);
        type: import("vue").PropType<VueNode | ((o: BaseOptionsProps) => VueNode)>;
    };
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: import("vue").PropType<Record<string, any>>;
        default: Record<string, any>;
    };
};
export type BaseOptionsProps = Partial<ExtractPropTypes<typeof baseOptionsProps>> & Partial<HTMLAttributes>;
export type OptionProps = Partial<ExtractPropTypes<typeof optionProps>> & Partial<HTMLAttributes>;
export declare const optionOptions: {
    name: string;
    props: {
        label: {
            default: VueNode | ((o: BaseOptionsProps) => VueNode);
            type: import("vue").PropType<VueNode | ((o: BaseOptionsProps) => VueNode)>;
        };
        value: StringConstructor;
        disabled: BooleanConstructor;
        payload: {
            type: import("vue").PropType<Record<string, any>>;
            default: Record<string, any>;
        };
    };
    render(_props: any, { slots }: any): any;
};
declare const _default: import("vue").DefineComponent<ExtractPropTypes<{
    label: {
        default: VueNode | ((o: BaseOptionsProps) => VueNode);
        type: import("vue").PropType<VueNode | ((o: BaseOptionsProps) => VueNode)>;
    };
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: import("vue").PropType<Record<string, any>>;
        default: Record<string, any>;
    };
}>, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    label: {
        default: VueNode | ((o: BaseOptionsProps) => VueNode);
        type: import("vue").PropType<VueNode | ((o: BaseOptionsProps) => VueNode)>;
    };
    value: StringConstructor;
    disabled: BooleanConstructor;
    payload: {
        type: import("vue").PropType<Record<string, any>>;
        default: Record<string, any>;
    };
}>> & Readonly<{}>, {
    label: VueNode | ((o: BaseOptionsProps) => VueNode);
    disabled: boolean;
    payload: Record<string, any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
