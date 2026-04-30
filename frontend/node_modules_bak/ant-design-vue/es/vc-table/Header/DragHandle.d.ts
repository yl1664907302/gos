import type { PropType } from 'vue';
import type { ColumnType } from '../interface';
declare const _default: import("vue").DefineComponent<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: NumberConstructor;
        required: true;
    };
    minWidth: {
        type: NumberConstructor;
        default: number;
    };
    maxWidth: {
        type: NumberConstructor;
        default: number;
    };
    column: {
        type: PropType<ColumnType<any>>;
        default: ColumnType<any>;
    };
}>, () => import("vue/jsx-runtime").JSX.Element, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    prefixCls: StringConstructor;
    width: {
        type: NumberConstructor;
        required: true;
    };
    minWidth: {
        type: NumberConstructor;
        default: number;
    };
    maxWidth: {
        type: NumberConstructor;
        default: number;
    };
    column: {
        type: PropType<ColumnType<any>>;
        default: ColumnType<any>;
    };
}>> & Readonly<{}>, {
    minWidth: number;
    maxWidth: number;
    column: ColumnType<any>;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, true, {}, any>;
export default _default;
