import type { ExtractPropTypes, PropType } from 'vue';
import type { Direction } from '../config-provider';
import type { AutoSizeType } from '../input/inputProps';
declare const editableProps: () => {
    prefixCls: StringConstructor;
    value: StringConstructor;
    maxlength: NumberConstructor;
    autoSize: {
        type: PropType<boolean | AutoSizeType>;
    };
    onSave: PropType<(val: string) => void>;
    onCancel: PropType<() => void>;
    onEnd: PropType<() => void>;
    onChange: PropType<(val: string) => void>;
    originContent: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
};
export type EditableProps = Partial<ExtractPropTypes<ReturnType<typeof editableProps>>>;
declare const Editable: import("vue").DefineComponent<ExtractPropTypes<{
    prefixCls: StringConstructor;
    value: StringConstructor;
    maxlength: NumberConstructor;
    autoSize: {
        type: PropType<boolean | AutoSizeType>;
    };
    onSave: PropType<(val: string) => void>;
    onCancel: PropType<() => void>;
    onEnd: PropType<() => void>;
    onChange: PropType<(val: string) => void>;
    originContent: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
}>, () => import("../_util/type").VueNode, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ExtractPropTypes<{
    prefixCls: StringConstructor;
    value: StringConstructor;
    maxlength: NumberConstructor;
    autoSize: {
        type: PropType<boolean | AutoSizeType>;
    };
    onSave: PropType<(val: string) => void>;
    onCancel: PropType<() => void>;
    onEnd: PropType<() => void>;
    onChange: PropType<(val: string) => void>;
    originContent: StringConstructor;
    direction: PropType<Direction>;
    component: StringConstructor;
}>> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default Editable;
